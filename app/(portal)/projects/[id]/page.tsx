import Link from "next/link"
import { notFound } from "next/navigation"
import { getRequiredSession } from "@/lib/auth-utils"
import { prisma } from "@/lib/db"
import { CheckCircle, Circle, Clock } from "lucide-react"
import { StatusBadge } from "@/components/status-badge"
import { ProgressBar } from "@/components/progress-bar"
import { formatCurrency, formatDate } from "@/lib/format"

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await getRequiredSession()

  const project = await prisma.project.findUnique({
    where: { id, userId: session.user.id },
    include: {
      milestones: { orderBy: { order: "asc" } },
      invoices: { orderBy: { createdAt: "desc" } },
    },
  })

  if (!project) notFound()

  return (
    <div className="p-4 sm:p-8">
      <Link href="/projects" className="text-sm text-blue-600 hover:text-blue-700">&larr; Back to projects</Link>

      <div className="mt-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-zinc-900">{project.name}</h1>
          <StatusBadge status={project.status} />
        </div>
        {project.description && (
          <p className="mt-2 text-sm text-zinc-600">{project.description}</p>
        )}
      </div>

      {/* Progress + Dates */}
      <div className="mt-6 rounded-lg bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between text-sm text-zinc-500 mb-2">
          <span>Progress</span>
          <span className="font-medium text-zinc-900">{project.progress}%</span>
        </div>
        <ProgressBar value={project.progress} />
        <div className="mt-4 flex gap-6 text-sm">
          <div>
            <span className="text-zinc-500">Start: </span>
            <span className="text-zinc-900">{formatDate(project.startDate)}</span>
          </div>
          <div>
            <span className="text-zinc-500">Due: </span>
            <span className="text-zinc-900">{formatDate(project.dueDate)}</span>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-zinc-900">Milestones</h2>
        {project.milestones.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">No milestones defined.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {project.milestones.map((milestone) => (
              <div key={milestone.id} className="flex items-start gap-3 rounded-lg bg-white p-4 shadow-sm">
                {milestone.status === "completed" ? (
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                ) : milestone.status === "in_progress" ? (
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
                ) : (
                  <Circle className="mt-0.5 h-5 w-5 shrink-0 text-zinc-300" />
                )}
                <div className="flex-1">
                  <p className="font-medium text-zinc-900">{milestone.title}</p>
                  {milestone.description && (
                    <p className="mt-0.5 text-sm text-zinc-500">{milestone.description}</p>
                  )}
                  <p className="mt-1 text-xs text-zinc-400">
                    {milestone.status === "completed"
                      ? `Completed ${formatDate(milestone.completedAt)}`
                      : milestone.dueDate
                        ? `Due ${formatDate(milestone.dueDate)}`
                        : "No due date"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related Invoices */}
      {project.invoices.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-zinc-900">Invoices</h2>
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
                {project.invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-zinc-100 last:border-0">
                    <td className="px-4 py-3">
                      <Link href={`/invoices/${invoice.id}`} className="font-medium text-zinc-900 hover:text-blue-600">
                        {invoice.number}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-zinc-700">{formatCurrency(invoice.amount)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={invoice.status} />
                    </td>
                    <td className="px-4 py-3 text-zinc-500">{formatDate(invoice.dueDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Messages Link */}
      <div className="mt-8">
        <Link
          href={`/messages/${project.id}`}
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
        >
          View messages for this project &rarr;
        </Link>
      </div>
    </div>
  )
}
