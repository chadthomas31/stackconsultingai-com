import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export async function getRequiredSession() {
  const session = await auth()
  if (!session?.user) {
    redirect("/login")
  }
  return session
}

export async function getRequiredAdmin() {
  const session = await getRequiredSession()
  if (session.user.role !== "admin") {
    redirect("/dashboard")
  }
  return session
}
