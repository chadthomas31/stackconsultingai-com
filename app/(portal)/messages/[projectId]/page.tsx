import Link from "next/link"
import { getRequiredSession } from "@/lib/auth-utils"
import { prisma } from "@/lib/db"
import { MessageInput } from "./message-input"
import { formatTime } from "@/lib/format"

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const session = await getRequiredSession()
  const userId = session.user.id

  // Get project name
  const project = projectId !== "general"
    ? await prisma.project.findUnique({ where: { id: projectId, userId } })
    : null

  const projectName = project?.name ?? "General"

  // Get messages
  const whereClause = projectId !== "general"
    ? { userId, projectId }
    : { userId, projectId: null }

  const messages = await prisma.message.findMany({
    where: whereClause,
    orderBy: { createdAt: "asc" },
  })

  // Mark unread admin messages as read
  await prisma.message.updateMany({
    where: { ...whereClause, isAdmin: true, read: false },
    data: { read: true },
  })

  return (
    <div className="flex h-full flex-col p-4 sm:p-8">
      <div>
        <Link href="/messages" className="text-sm text-blue-600 hover:text-blue-700">&larr; Back to messages</Link>
        <h1 className="mt-2 text-2xl font-bold text-zinc-900">{projectName}</h1>
      </div>

      <div className="mt-6 flex-1 space-y-4 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-sm text-zinc-500">No messages yet. Start the conversation below.</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isAdmin ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-md rounded-lg px-4 py-2.5 ${
                  msg.isAdmin
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "bg-blue-600 text-white"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className={`mt-1 text-xs ${msg.isAdmin ? "text-zinc-400" : "text-blue-200"}`}>
                  {msg.isAdmin ? "Admin" : "You"} · {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4">
        <MessageInput projectId={projectId === "general" ? undefined : projectId} />
      </div>
    </div>
  )
}
