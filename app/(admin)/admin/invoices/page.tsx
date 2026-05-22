import Link from "next/link"
import { getRequiredAdmin } from "@/lib/auth-utils"
import { prisma } from "@/lib/db"
import { StatusBadge } from "@/components/status-badge"
import { formatCurrency, formatDate } from "@/lib/format"

export default async function AdminInvoicesPage() {
  await getRequiredAdmin()

  const [invoices, paidTotal, outstandingTotal] = await Promise.all([
    prisma.invoice.findMany({
      include: { user: true, project: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.invoice.aggregate({ _sum: { amount: true }, where: { status: "paid" } }),
    prisma.invoice.aggregate({ _sum: { amount: true }, where: { status: { in: ["sent", "overdue"] } } }),
  ])

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl font-bold text-zinc-900">All Invoices</h1>
      <p className="mt-1 text-sm text-zinc-500">
        {invoices.length} invoice{invoices.length !== 1 ? "s" : ""}
        {" · "}{formatCurrency(paidTotal._sum.amount ?? 0)} paid
        {" · "}{formatCurrency(outstandingTotal._sum.amount ?? 0)} outstanding
      </p>

      <div className="mt-6 overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-xs font-medium text-zinc-500">
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/invoices/${invoice.id}`} className="font-medium text-zinc-900 hover:text-indigo-600">
                    {invoice.number}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/clients/${invoice.userId}`} className="text-zinc-500 hover:text-indigo-600">
                    {invoice.user.name}
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
    </div>
  )
}
