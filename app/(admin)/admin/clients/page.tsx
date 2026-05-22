import Link from "next/link"
import { getRequiredAdmin } from "@/lib/auth-utils"
import { prisma } from "@/lib/db"
import { formatDate } from "@/lib/format"

export default async function AdminClientsPage() {
  await getRequiredAdmin()

  const clients = await prisma.user.findMany({
    where: { role: "client" },
    include: {
      _count: { select: { projects: true, invoices: true, messages: true } },
    },
    orderBy: { name: "asc" },
  })

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Clients</h1>
          <p className="mt-1 text-sm text-zinc-500">{clients.length} client{clients.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/admin/clients/new"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          New Client
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-xs font-medium text-zinc-500">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Projects</th>
              <th className="px-4 py-3">Invoices</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/clients/${client.id}`} className="font-medium text-zinc-900 hover:text-indigo-600">
                    {client.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-zinc-500">{client.company ?? "—"}</td>
                <td className="px-4 py-3 text-zinc-500">{client.email}</td>
                <td className="px-4 py-3 text-zinc-700">{client._count.projects}</td>
                <td className="px-4 py-3 text-zinc-700">{client._count.invoices}</td>
                <td className="px-4 py-3 text-zinc-500">{formatDate(client.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
