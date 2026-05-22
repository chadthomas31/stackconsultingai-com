import Link from "next/link"
import { notFound } from "next/navigation"
import { getRequiredAdmin } from "@/lib/auth-utils"
import { prisma } from "@/lib/db"
import { StatusBadge } from "@/components/status-badge"
import { ProgressBar } from "@/components/progress-bar"
import { formatCurrency, formatDate } from "@/lib/format"

export default async function AdminClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await getRequiredAdmin()

  const [client, projects, invoices, unreadCount] = await Promise.all([
    prisma.user.findUnique({ where: { id, role: "client" } }),
    prisma.project.findMany({
      where: { userId: id },
      include: { milestones: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.invoice.findMany({
      where: { userId: id },
      include: { project: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.message.count({ where: { userId: id, isAdmin: false, read: false } }),
  ])

  if (!client) notFound()

  return (
    <div className="p-4 sm:p-8">
      <Link href="/admin/clients" className="text-sm text-indigo-600 hover:text-indigo-700">&larr; Back to clients</Link>

      <div className="mt-4">
        <h1 className="text-2xl font-bold text-zinc-900">{client.name}</h1>
        <div className="mt-2 flex flex-wrap gap-4 text-sm text-zinc-500">
          {client.company && <span>{client.company}</span>}
          <span>{client.email}</span>
          {client.phone && <span>{client.phone}</span>}
          <span>Joined {formatDate(client.createdAt)}</span>
          {unreadCount > 0 && (
            <span className="text-amber-600">{unreadCount} unread message{unreadCount !== 1 ? "s" : ""}</span>
          )}
        </div>
      </div>

      {/* Projects */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">Projects ({projects.length})</h2>
          <Link
            href={`/admin/projects/new?userId=${client.id}`}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
          >
            New Project
          </Link>
        </div>
        {projects.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">No projects.</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {projects.map((project) => {
              const done = project.milestones.filter((m) => m.status === "completed").length
              return (
                <Link
                  key={project.id}
                  href={`/admin/projects/${project.id}`}
                  className="rounded-lg bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <p className="font-medium text-zinc-900">{project.name}</p>
                    <StatusBadge status={project.status} />
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <ProgressBar value={project.progress} />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
                    <span>Due {formatDate(project.dueDate)}</span>
                    <span>{done}/{project.milestones.length} milestones</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Invoices */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-zinc-900">Invoices ({invoices.length})</h2>
        {invoices.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">No invoices.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-lg bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-xs font-medium text-zinc-500">
                  <th className="px-4 py-3">Invoice</th>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-zinc-100 last:border-0">
                    <td className="px-4 py-3">
                      <Link href={`/admin/invoices/${invoice.id}`} className="font-medium text-zinc-900 hover:text-indigo-600">
                        {invoice.number}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-zinc-500">{invoice.project?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-zinc-700">{formatCurrency(invoice.amount)}</td>
                    <td className="px-4 py-3"><StatusBadge status={invoice.status} /></td>
                    <td className="px-4 py-3 text-zinc-500">{formatDate(invoice.dueDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
