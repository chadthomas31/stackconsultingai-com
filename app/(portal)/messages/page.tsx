import Link from "next/link"
import { getRequiredSession } from "@/lib/auth-utils"
import { prisma } from "@/lib/db"
import { MessageSquare } from "lucide-react"
import { formatDate } from "@/lib/format"

export default async function MessagesPage() {
  const session = await getRequiredSession()
  const userId = session.user.id

  const messages = await prisma.message.findMany({
    where: { userId },
    include: { project: true },
    orderBy: { createdAt: "desc" },
  })

  // Group messages by projectId
  const conversations = new Map<string, {
    projectId: string
    projectName: string
    lastMessage: typeof messages[0]
    unreadCount: number
    totalCount: number
  }>()

  for (const msg of messages) {
    const key = msg.projectId ?? "general"
    const existing = conversations.get(key)
    if (!existing) {
      conversations.set(key, {
        projectId: msg.projectId ?? "general",
        projectName: msg.project?.name ?? "General",
        lastMessage: msg,
        unreadCount: msg.isAdmin && !msg.read ? 1 : 0,
        totalCount: 1,
      })
    } else {
      existing.totalCount++
      if (msg.isAdmin && !msg.read) existing.unreadCount++
    }
  }

  const conversationList = Array.from(conversations.values())

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl font-bold text-zinc-900">Messages</h1>
      <p className="mt-1 text-sm text-zinc-500">
        {conversationList.length} conversation{conversationList.length !== 1 ? "s" : ""}
      </p>

      {conversationList.length === 0 ? (
        <p className="mt-8 text-sm text-zinc-500">No messages yet.</p>
      ) : (
        <div className="mt-6 space-y-2">
          {conversationList.map((conv) => (
            <Link
              key={conv.projectId}
              href={`/messages/${conv.projectId}`}
              className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="rounded-full bg-zinc-100 p-2">
                <MessageSquare className="h-5 w-5 text-zinc-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-zinc-900">{conv.projectName}</p>
                  <span className="text-xs text-zinc-400">{formatDate(conv.lastMessage.createdAt)}</span>
                </div>
                <p className="mt-0.5 truncate text-sm text-zinc-500">
                  {conv.lastMessage.isAdmin ? "Admin: " : "You: "}
                  {conv.lastMessage.content}
                </p>
              </div>
              {conv.unreadCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-medium text-white">
                  {conv.unreadCount}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
