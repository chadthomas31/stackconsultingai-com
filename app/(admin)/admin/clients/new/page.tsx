import { getRequiredAdmin } from "@/lib/auth-utils"
import { ClientForm } from "./client-form"

export default async function NewClientPage() {
  await getRequiredAdmin()

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl font-bold text-zinc-900">New Client</h1>
      <p className="mt-1 text-sm text-zinc-500">Create a new client account</p>

      <div className="mt-6 max-w-2xl rounded-lg bg-white p-6 shadow-sm">
        <ClientForm />
      </div>
    </div>
  )
}
