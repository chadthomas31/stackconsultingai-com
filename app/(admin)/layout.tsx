import { getRequiredAdmin } from "@/lib/auth-utils"
import { LayoutDashboard, Users, FolderKanban, FileText, MessageSquare } from "lucide-react"
import { Sidebar } from "@/components/sidebar"

const navItems: { href: string; label: string; icon: "LayoutDashboard" | "Users" | "FolderKanban" | "FileText" | "MessageSquare" }[] = [
  { href: "/admin", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/admin/clients", label: "Clients", icon: "Users" },
  { href: "/admin/projects", label: "Projects", icon: "FolderKanban" },
  { href: "/admin/invoices", label: "Invoices", icon: "FileText" },
  { href: "/admin/messages", label: "Messages", icon: "MessageSquare" },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getRequiredAdmin()
  const user = session.user!

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar
        navItems={navItems}
        userName={user.name ?? "Administrator"}
        userRole={user.role ?? "admin"}
        isAdmin
      />
      <main className="flex-1 bg-zinc-50 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
