import { getRequiredAdmin } from "@/lib/auth-utils"
import { prisma } from "@/lib/db"
import { ProjectForm } from "./project-form"

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ userId?: string }>
}) {
  await getRequiredAdmin()
  const { userId } = await searchParams

  const clients = await prisma.user.findMany({
    where: { role: "client" },
    select: { id: true, name: true, company: true },
    orderBy: { name: "asc" },
  })

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl font-bold text-zinc-900">New Project</h1>
      <p className="mt-1 text-sm text-zinc-500">Create a new engagement for a client</p>

      <div className="mt-6 max-w-2xl rounded-lg bg-white p-6 shadow-sm">
        <ProjectForm clients={clients} initialUserId={userId} />
      </div>
    </div>
  )
}
