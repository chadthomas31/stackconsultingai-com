import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { content, projectId } = body

  if (!content || typeof content !== "string") {
    return NextResponse.json({ error: "Content is required" }, { status: 400 })
  }

  // Verify project belongs to user if projectId provided
  if (projectId) {
    const project = await prisma.project.findUnique({
      where: { id: projectId, userId: session.user.id },
    })
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }
  }

  const message = await prisma.message.create({
    data: {
      content,
      userId: session.user.id,
      projectId: projectId || null,
      isAdmin: session.user.role === "admin",
    },
  })

  return NextResponse.json({ data: message })
}
