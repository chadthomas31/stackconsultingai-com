import { RegisterForm } from "./register-form"

export default function RegisterPage() {
  return (
    <div className="rounded-lg bg-white p-4 sm:p-8 shadow-md">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-zinc-900">Stack Consulting AI</h1>
        <p className="mt-1 text-sm text-zinc-500">Create your client portal account</p>
      </div>
      <RegisterForm />
    </div>
  )
}
