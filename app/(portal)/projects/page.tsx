import Link from "next/link"
import { getRequiredSession } from "@/lib/auth-utils"
import { prisma } from "@/lib/db"
import { StatusBadge } from "@/components/status-badge"
import { ProgressBar } from "@/components/progress-bar"
import { formatDate } from "@/lib/format"

export default async function ProjectsPage() {
  const session = await getRequiredSession()
  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    include: { milestones: true },
    orderBy: { updatedAt: "desc" },
  })

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl font-bold text-zinc-900">Projects</h1>
      <p className="mt-1 text-sm text-zinc-500">{projects.length} project{projects.length !== 1 ? "s" : ""}</p>

      {projects.length === 0 ? (
        <p className="mt-8 text-sm text-zinc-500">No projects yet.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {projects.map((project) => {
            const completedMilestones = project.milestones.filter((m) => m.status === "completed").length
            return (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="rounded-lg bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-zinc-900">{project.name}</p>
                    {project.description && (
                      <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{project.description}</p>
                    )}
                  </div>
                  <StatusBadge status={project.status} />
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <ProgressBar value={project.progress} />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
                  <span>Due {formatDate(project.dueDate)}</span>
                  <span>{completedMilestones}/{project.milestones.length} milestones</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
