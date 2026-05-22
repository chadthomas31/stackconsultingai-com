import Link from "next/link"
import { getRequiredAdmin } from "@/lib/auth-utils"
import { prisma } from "@/lib/db"
import { MessageSquare } from "lucide-react"
import { formatDate } from "@/lib/format"

export default async function AdminMessagesPage() {
  await getRequiredAdmin()

  const messages = await prisma.message.findMany({
    include: { user: true, project: true },
    orderBy: { createdAt: "desc" },
  })

  // Group by userId, then by projectId
  const byClient = new Map<string, {
    userId: string
    userName: string
    company: string | null
    conversations: Map<string, {
      projectId: string
      projectName: string
      lastMessage: typeof messages[0]
      unreadCount: number
    }>
  }>()

  for (const msg of messages) {
    let client = byClient.get(msg.userId)
    if (!client) {
      client = {
        userId: msg.userId,
        userName: msg.user.name,
        company: msg.user.company,
        conversations: new Map(),
      }
      byClient.set(msg.userId, client)
    }

    const key = msg.projectId ?? "general"
    const conv = client.conversations.get(key)
    if (!conv) {
      client.conversations.set(key, {
        projectId: key,
        projectName: msg.project?.name ?? "General",
        lastMessage: msg,
        unreadCount: !msg.isAdmin && !msg.read ? 1 : 0,
      })
    } else {
      if (!msg.isAdmin && !msg.read) conv.unreadCount++
    }
  }

  const clientList = Array.from(byClient.values())

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl font-bold text-zinc-900">Messages</h1>
      <p className="mt-1 text-sm text-zinc-500">All client conversations</p>

      {clientList.length === 0 ? (
        <p className="mt-8 text-sm text-zinc-500">No messages yet.</p>
      ) : (
        <div className="mt-6 space-y-6">
          {clientList.map((client) => (
            <div key={client.userId}>
              <h3 className="text-sm font-semibold text-zinc-900">
                {client.userName}
                {client.company && <span className="font-normal text-zinc-500"> · {client.company}</span>}
              </h3>
              <div className="mt-2 space-y-2">
                {Array.from(client.conversations.values()).map((conv) => (
                  <Link
                    key={conv.projectId}
                    href={`/admin/messages/${client.userId}/${conv.projectId}`}
                    className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="rounded-full bg-indigo-50 p-2">
                      <MessageSquare className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-zinc-900">{conv.projectName}</p>
                        <span className="text-xs text-zinc-400">{formatDate(conv.lastMessage.createdAt)}</span>
                      </div>
                      <p className="mt-0.5 truncate text-sm text-zinc-500">
                        {conv.lastMessage.isAdmin ? "You: " : `${client.userName}: `}
                        {conv.lastMessage.content}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-medium text-white">
                        {conv.unreadCount}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
