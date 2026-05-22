import Link from "next/link"
import { notFound } from "next/navigation"
import { getRequiredAdmin } from "@/lib/auth-utils"
import { prisma } from "@/lib/db"
import { AdminMessageInput } from "./admin-message-input"
import { formatTime } from "@/lib/format"

export default async function AdminConversationPage({
  params,
}: {
  params: Promise<{ userId: string; projectId: string }>
}) {
  const { userId, projectId } = await params
  await getRequiredAdmin()

  const client = await prisma.user.findUnique({ where: { id: userId } })
  if (!client) notFound()

  const project = projectId !== "general"
    ? await prisma.project.findUnique({ where: { id: projectId } })
    : null

  const projectName = project?.name ?? "General"

  const whereClause = projectId !== "general"
    ? { userId, projectId }
    : { userId, projectId: null }

  const messages = await prisma.message.findMany({
    where: whereClause,
    orderBy: { createdAt: "asc" },
  })

  // Mark client messages as read
  await prisma.message.updateMany({
    where: { ...whereClause, isAdmin: false, read: false },
    data: { read: true },
  })

  return (
    <div className="flex h-full flex-col p-4 sm:p-8">
      <div>
        <Link href="/admin/messages" className="text-sm text-indigo-600 hover:text-indigo-700">&larr; Back to messages</Link>
        <h1 className="mt-2 text-2xl font-bold text-zinc-900">{client.name}</h1>
        <p className="text-sm text-zinc-500">{projectName}</p>
      </div>

      <div className="mt-6 flex-1 space-y-4 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-sm text-zinc-500">No messages yet.</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isAdmin ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-md rounded-lg px-4 py-2.5 ${
                  msg.isAdmin
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-zinc-900 shadow-sm"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className={`mt-1 text-xs ${msg.isAdmin ? "text-indigo-200" : "text-zinc-400"}`}>
                  {msg.isAdmin ? "You" : client.name} · {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4">
        <AdminMessageInput userId={userId} projectId={projectId === "general" ? undefined : projectId} />
      </div>
    </div>
  )
}
