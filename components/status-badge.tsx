const colors: Record<string, string> = {
  discovery: "bg-purple-100 text-purple-700",
  in_progress: "bg-blue-100 text-blue-700",
  review: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  on_hold: "bg-zinc-100 text-zinc-700",
  pending: "bg-zinc-100 text-zinc-700",
  draft: "bg-zinc-100 text-zinc-700",
  sent: "bg-blue-100 text-blue-700",
  paid: "bg-green-100 text-green-700",
  overdue: "bg-red-100 text-red-700",
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] ?? "bg-zinc-100 text-zinc-700"}`}>
      {status.replace(/_/g, " ")}
    </span>
  )
}
