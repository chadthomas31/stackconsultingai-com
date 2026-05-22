import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

const validStatuses = ["discovery", "in_progress", "review", "completed", "on_hold"]

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { status, progress } = body

  const data: Record<string, unknown> = {}
  if (status && validStatuses.includes(status)) data.status = status
  if (progress !== undefined && progress >= 0 && progress <= 100) data.progress = progress

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
  }

  const project = await prisma.project.update({ where: { id }, data })
  return NextResponse.json({ data: project })
}
