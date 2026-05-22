import Link from "next/link"
import { notFound } from "next/navigation"
import { getRequiredAdmin } from "@/lib/auth-utils"
import { prisma } from "@/lib/db"
import { StatusBadge } from "@/components/status-badge"
import { formatCurrency, formatDate } from "@/lib/format"
import { InvoiceStatusForm } from "./invoice-status-form"

interface LineItem {
  description: string
  quantity: number
  unitPrice: number
}

function parseLineItems(json: string | null): LineItem[] {
  if (!json) return []
  try { return JSON.parse(json) } catch { return [] }
}

export default async function AdminInvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await getRequiredAdmin()

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: { user: true, project: true },
  })

  if (!invoice) notFound()

  const lineItems = parseLineItems(invoice.lineItems)

  return (
    <div className="p-4 sm:p-8">
      <Link href="/admin/invoices" className="text-sm text-indigo-600 hover:text-indigo-700">&larr; Back to invoices</Link>

      <div className="mt-4 rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">{invoice.number}</h1>
            {invoice.description && <p className="mt-1 text-sm text-zinc-500">{invoice.description}</p>}
          </div>
          <StatusBadge status={invoice.status} />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-5">
          <div>
            <p className="text-zinc-500">Client</p>
            <p className="mt-1">
              <Link href={`/admin/clients/${invoice.userId}`} className="text-indigo-600 hover:text-indigo-700">
                {invoice.user.name}
              </Link>
            </p>
          </div>
          <div>
            <p className="text-zinc-500">Amount</p>
            <p className="mt-1 font-semibold text-zinc-900">{formatCurrency(invoice.amount)}</p>
          </div>
          <div>
            <p className="text-zinc-500">Due Date</p>
            <p className="mt-1 text-zinc-900">{formatDate(invoice.dueDate)}</p>
          </div>
          <div>
            <p className="text-zinc-500">Paid</p>
            <p className="mt-1 text-zinc-900">{formatDate(invoice.paidAt)}</p>
          </div>
          <div>
            <p className="text-zinc-500">Project</p>
            <p className="mt-1 text-zinc-900">
              {invoice.project ? (
                <Link href={`/admin/projects/${invoice.project.id}`} className="text-indigo-600 hover:text-indigo-700">
                  {invoice.project.name}
                </Link>
              ) : "—"}
            </p>
          </div>
        </div>

        {/* Status Update */}
        <div className="mt-6 border-t border-zinc-200 pt-4">
          <h2 className="text-sm font-semibold text-zinc-900 mb-3">Update Status</h2>
          <InvoiceStatusForm invoiceId={invoice.id} currentStatus={invoice.status} />
        </div>

        {lineItems.length > 0 && (
          <div className="mt-6 border-t border-zinc-200 pt-4">
            <h2 className="text-sm font-semibold text-zinc-900">Line Items</h2>
            <div className="overflow-x-auto">
              <table className="mt-3 w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-xs font-medium text-zinc-500">
                  <th className="pb-2">Description</th>
                  <th className="pb-2 text-right">Qty</th>
                  <th className="pb-2 text-right">Unit Price</th>
                  <th className="pb-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item, i) => (
                  <tr key={i} className="border-b border-zinc-100 last:border-0">
                    <td className="py-2 text-zinc-700">{item.description}</td>
                    <td className="py-2 text-right text-zinc-700">{item.quantity}</td>
                    <td className="py-2 text-right text-zinc-700">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-2 text-right font-medium text-zinc-900">{formatCurrency(item.quantity * item.unitPrice)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-zinc-200">
                  <td colSpan={3} className="py-2 text-right font-medium text-zinc-900">Total</td>
                  <td className="py-2 text-right font-bold text-zinc-900">{formatCurrency(invoice.amount)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
