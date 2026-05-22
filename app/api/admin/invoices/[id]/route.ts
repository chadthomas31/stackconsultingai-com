import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

const validStatuses = ["draft", "sent", "paid", "overdue"]

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
  const { status } = body

  if (!status || !validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  const data: Record<string, unknown> = { status }
  if (status === "paid") data.paidAt = new Date()
  else data.paidAt = null

  const invoice = await prisma.invoice.update({ where: { id }, data })
  return NextResponse.json({ data: invoice })
}
