import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, userId, startDate, dueDate } = body

    if (!name || !userId) {
      return NextResponse.json(
        { error: "Name and Client are required" },
        { status: 400 }
      )
    }

    // Verify client exists
    const client = await prisma.user.findUnique({
      where: { id: userId, role: "client" },
    })

    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      )
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        name,
        description,
        userId,
        startDate: startDate ? new Date(startDate) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: "discovery",
        progress: 0,
      },
    })

    return NextResponse.json({ data: project })
  } catch (error: any) {
    console.error("Project creation error:", error)
    return NextResponse.json(
      { error: "An error occurred during project creation" },
      { status: 500 }
    )
  }
}
