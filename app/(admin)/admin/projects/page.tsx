import Link from "next/link"
import { getRequiredAdmin } from "@/lib/auth-utils"
import { prisma } from "@/lib/db"
import { StatusBadge } from "@/components/status-badge"
import { formatDate } from "@/lib/format"

export default async function AdminProjectsPage() {
  await getRequiredAdmin()

  const projects = await prisma.project.findMany({
    include: { user: true, _count: { select: { milestones: true } } },
    orderBy: { updatedAt: "desc" },
  })

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">All Projects</h1>
          <p className="mt-1 text-sm text-zinc-500">{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          New Project
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-xs font-medium text-zinc-500">
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Progress</th>
              <th className="px-4 py-3">Milestones</th>
              <th className="px-4 py-3">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/projects/${project.id}`} className="font-medium text-zinc-900 hover:text-indigo-600">
                    {project.name}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/clients/${project.userId}`} className="text-zinc-500 hover:text-indigo-600">
                    {project.user.name}
                  </Link>
                </td>
                <td className="px-4 py-3"><StatusBadge status={project.status} /></td>
                <td className="px-4 py-3 text-zinc-700">{project.progress}%</td>
                <td className="px-4 py-3 text-zinc-700">{project._count.milestones}</td>
                <td className="px-4 py-3 text-zinc-500">{formatDate(project.dueDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
