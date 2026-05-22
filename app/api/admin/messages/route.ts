import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { content, userId, projectId } = body

  if (!content || typeof content !== "string") {
    return NextResponse.json({ error: "Content is required" }, { status: 400 })
  }

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 })
  }

  // Verify client exists
  const client = await prisma.user.findUnique({ where: { id: userId } })
  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 })
  }

  // Verify project if provided
  if (projectId) {
    const project = await prisma.project.findUnique({ where: { id: projectId } })
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }
  }

  const message = await prisma.message.create({
    data: {
      content,
      userId,
      projectId: projectId || null,
      isAdmin: true,
    },
  })

  return NextResponse.json({ data: message })
}
