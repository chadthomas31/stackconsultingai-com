import Link from "next/link"
import { getRequiredSession } from "@/lib/auth-utils"
import { prisma } from "@/lib/db"
import { StatusBadge } from "@/components/status-badge"
import { formatCurrency, formatDate } from "@/lib/format"

export default async function InvoicesPage() {
  const session = await getRequiredSession()
  const invoices = await prisma.invoice.findMany({
    where: { userId: session.user.id },
    include: { project: true },
    orderBy: { createdAt: "desc" },
  })

  const totalOutstanding = invoices
    .filter((i) => i.status === "sent" || i.status === "overdue")
    .reduce((sum, i) => sum + i.amount, 0)

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Invoices</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {invoices.length} invoice{invoices.length !== 1 ? "s" : ""}
            {totalOutstanding > 0 && ` · ${formatCurrency(totalOutstanding)} outstanding`}
          </p>
        </div>
      </div>

      {invoices.length === 0 ? (
        <p className="mt-8 text-sm text-zinc-500">No invoices yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg bg-white shadow-sm">
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
                <tr key={invoice.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                  <td className="px-4 py-3">
                    <Link href={`/invoices/${invoice.id}`} className="font-medium text-zinc-900 hover:text-blue-600">
                      {invoice.number}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {invoice.project ? (
                      <Link href={`/projects/${invoice.project.id}`} className="hover:text-blue-600">
                        {invoice.project.name}
                      </Link>
                    ) : "—"}
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
  )
}
