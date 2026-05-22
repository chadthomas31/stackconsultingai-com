import Link from "next/link"
import { getRequiredSession } from "@/lib/auth-utils"
import { prisma } from "@/lib/db"
import { FolderKanban, FileText, MessageSquare } from "lucide-react"
import { StatusBadge } from "@/components/status-badge"
import { ProgressBar } from "@/components/progress-bar"
import { formatCurrency, formatDate } from "@/lib/format"

export default async function DashboardPage() {
  const session = await getRequiredSession()
  const userId = session.user.id

  const [projects, invoices, unreadCount] = await Promise.all([
    prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.invoice.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.message.count({
      where: { userId, read: false, isAdmin: true },
    }),
  ])

  const activeProjects = projects.filter((p) => p.status !== "completed")
  const pendingInvoiceTotal = invoices
    .filter((i) => i.status === "sent" || i.status === "overdue")
    .reduce((sum, i) => sum + i.amount, 0)

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
      <p className="mt-1 text-sm text-zinc-500">Welcome back, {session.user.name}</p>

      {/* Summary Cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link href="/projects" className="rounded-lg bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-blue-50 p-2">
              <FolderKanban className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900">{activeProjects.length}</p>
              <p className="text-sm text-zinc-500">Active Projects</p>
            </div>
          </div>
        </Link>

        <Link href="/invoices" className="rounded-lg bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-amber-50 p-2">
              <FileText className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900">{formatCurrency(pendingInvoiceTotal)}</p>
              <p className="text-sm text-zinc-500">Pending Invoices</p>
            </div>
          </div>
        </Link>

        <Link href="/messages" className="rounded-lg bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-green-50 p-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900">{unreadCount}</p>
              <p className="text-sm text-zinc-500">Unread Messages</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Active Projects */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">Active Projects</h2>
          <Link href="/projects" className="text-sm text-blue-600 hover:text-blue-700">View all</Link>
        </div>
        {activeProjects.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">No active projects.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {activeProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-zinc-900">{project.name}</p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      Due {formatDate(project.dueDate)}
                    </p>
                  </div>
                  <StatusBadge status={project.status} />
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <ProgressBar value={project.progress} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Invoices */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">Recent Invoices</h2>
          <Link href="/invoices" className="text-sm text-blue-600 hover:text-blue-700">View all</Link>
        </div>
        {invoices.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">No invoices yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-lg bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-xs font-medium text-zinc-500">
                  <th className="px-4 py-3">Invoice</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-zinc-100 last:border-0">
                    <td className="px-4 py-3">
                      <Link href={`/invoices/${invoice.id}`} className="font-medium text-zinc-900 hover:text-blue-600">
                        {invoice.number}
                      </Link>
                    </td>
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
