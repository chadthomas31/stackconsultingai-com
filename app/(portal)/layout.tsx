import type { Metadata } from "next"
import { getRequiredSession } from "@/lib/auth-utils"
import { LayoutDashboard, FolderKanban, FileText, MessageSquare } from "lucide-react"
import { Sidebar } from "@/components/sidebar"

export const metadata: Metadata = {
  title: "Client Portal | Stack Consulting AI",
  robots: { index: false, follow: false },
}

const navItems: { href: string; label: string; icon: "LayoutDashboard" | "FolderKanban" | "FileText" | "MessageSquare" }[] = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/projects", label: "Projects", icon: "FolderKanban" },
  { href: "/invoices", label: "Invoices", icon: "FileText" },
  { href: "/messages", label: "Messages", icon: "MessageSquare" },
]

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getRequiredSession()
  const user = session.user!

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar
        navItems={navItems}
        userName={user.name ?? "Client"}
        userRole={user.role ?? "client"}
      />
      <main className="flex-1 bg-zinc-50 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
