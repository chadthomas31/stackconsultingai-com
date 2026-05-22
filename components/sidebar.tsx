"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, LayoutDashboard, FolderKanban, FileText, MessageSquare, Users } from "lucide-react"
import { SignOutButton } from "./sign-out-button"

const iconMap = {
  LayoutDashboard,
  FolderKanban,
  FileText,
  MessageSquare,
  Users,
}

interface NavItem {
  href: string
  label: string
  icon: keyof typeof iconMap
}

interface SidebarProps {
  navItems: NavItem[]
  userName: string
  userRole: string
  isAdmin?: boolean
}

export function Sidebar({ navItems, userName, userRole, isAdmin }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const closeSidebar = () => setIsOpen(false)

  return (
    <>
      {/* Mobile Header */}
      <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-4 lg:hidden">
        <Link href={isAdmin ? "/admin" : "/dashboard"} className="text-lg font-bold text-zinc-900">
          SCA Portal
        </Link>
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-md p-2 text-zinc-500 hover:bg-zinc-100"
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-zinc-900/50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          isAdmin
            ? "border-indigo-800 bg-indigo-950 text-indigo-200"
            : "border-zinc-200 bg-white text-zinc-600"
        }`}
      >
        <div className={`flex h-full flex-col`}>
          <div className={`flex items-center justify-between border-b px-6 py-5 ${
            isAdmin ? "border-indigo-800" : "border-zinc-200"
          }`}>
            <div>
              <p className={`text-sm font-semibold ${isAdmin ? "text-white" : "text-zinc-900"}`}>{userName}</p>
              <p className={`text-xs ${isAdmin ? "text-indigo-300" : "text-zinc-500"}`}>
                {userRole === "admin" ? "Administrator" : "Client"}
              </p>
            </div>
            <button
              onClick={closeSidebar}
              className={`rounded-md p-1 lg:hidden ${
                isAdmin ? "hover:bg-indigo-900" : "hover:bg-zinc-100"
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 px-3 py-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeSidebar}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                        isActive
                          ? isAdmin
                            ? "bg-indigo-900 text-white"
                            : "bg-zinc-100 text-zinc-900"
                          : isAdmin
                            ? "hover:bg-indigo-900 hover:text-white"
                            : "hover:bg-zinc-100 hover:text-zinc-900"
                      }`}
                    >
                      {(() => {
                        const Icon = iconMap[item.icon]
                        return <Icon className="h-4 w-4" />
                      })()}
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className={`border-t px-3 py-4 ${isAdmin ? "border-indigo-800" : "border-zinc-200"}`}>
            {isAdmin && (
              <Link
                href="/dashboard"
                onClick={closeSidebar}
                className="mb-2 flex items-center gap-3 rounded-md px-3 py-2 text-sm text-indigo-300 hover:bg-indigo-900 hover:text-white"
              >
                Back to Portal
              </Link>
            )}
            <SignOutButton />
          </div>
        </div>
      </aside>
    </>
  )
}
