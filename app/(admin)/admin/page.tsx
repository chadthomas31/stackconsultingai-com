import Link from "next/link"
import { getRequiredAdmin } from "@/lib/auth-utils"
import { prisma } from "@/lib/db"
import { Users, FolderKanban, DollarSign, MessageSquare } from "lucide-react"
import { StatusBadge } from "@/components/status-badge"
import { formatCurrency, formatDate } from "@/lib/format"

export default async function AdminDashboardPage() {
  await getRequiredAdmin()

  const [
    clientCount,
    projectCount,
    paidTotal,
    outstandingTotal,
    unreadCount,
    recentProjects,
    recentInvoices,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "client" } }),
    prisma.project.count(),
    prisma.invoice.aggregate({ _sum: { amount: true }, where: { status: "paid" } }),
    prisma.invoice.aggregate({ _sum: { amount: true }, where: { status: { in: ["sent", "overdue"] } } }),
    prisma.message.count({ where: { isAdmin: false, read: false } }),
    prisma.project.findMany({ orderBy: { updatedAt: "desc" }, take: 5, include: { user: true } }),
    prisma.invoice.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { user: true } }),
  ])

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl font-bold text-zinc-900">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-zinc-500">Overview of all clients and projects</p>

      {/* Summary Cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-indigo-50 p-2">
              <Users className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900">{clientCount}</p>
              <p className="text-sm text-zinc-500">Clients</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-blue-50 p-2">
              <FolderKanban className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900">{projectCount}</p>
              <p className="text-sm text-zinc-500">Projects</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-green-50 p-2">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900">{formatCurrency(paidTotal._sum.amount ?? 0)}</p>
              <p className="text-sm text-zinc-500">Revenue</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-red-50 p-2">
              <DollarSign className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900">{formatCurrency(outstandingTotal._sum.amount ?? 0)}</p>
              <p className="text-sm text-zinc-500">Outstanding</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-amber-50 p-2">
              <MessageSquare className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900">{unreadCount}</p>
              <p className="text-sm text-zinc-500">Unread Messages</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">Recent Projects</h2>
          <Link href="/admin/projects" className="text-sm text-indigo-600 hover:text-indigo-700">View all</Link>
        </div>
        <div className="mt-4 overflow-x-auto rounded-lg bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-xs font-medium text-zinc-500">
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Progress</th>
                <th className="px-4 py-3">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {recentProjects.map((project) => (
                <tr key={project.id} className="border-b border-zinc-100 last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/admin/projects/${project.id}`} className="font-medium text-zinc-900 hover:text-indigo-600">
                      {project.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    <Link href={`/admin/clients/${project.userId}`} className="hover:text-indigo-600">
                      {project.user.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={project.status} /></td>
                  <td className="px-4 py-3 text-zinc-700">{project.progress}%</td>
                  <td className="px-4 py-3 text-zinc-500">{formatDate(project.dueDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">Recent Invoices</h2>
          <Link href="/admin/invoices" className="text-sm text-indigo-600 hover:text-indigo-700">View all</Link>
        </div>
        <div className="mt-4 overflow-x-auto rounded-lg bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-xs font-medium text-zinc-500">
                <th className="px-4 py-3">Invoice</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-zinc-100 last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/admin/invoices/${invoice.id}`} className="font-medium text-zinc-900 hover:text-indigo-600">
                      {invoice.number}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-zinc-500">{invoice.user.name}</td>
                  <td className="px-4 py-3 text-zinc-700">{formatCurrency(invoice.amount)}</td>
                  <td className="px-4 py-3"><StatusBadge status={invoice.status} /></td>
                  <td className="px-4 py-3 text-zinc-500">{formatDate(invoice.dueDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
