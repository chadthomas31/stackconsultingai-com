"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const statuses = ["discovery", "in_progress", "review", "completed", "on_hold"]

export function ProjectStatusForm({
  projectId,
  currentStatus,
  currentProgress,
}: {
  projectId: string
  currentStatus: string
  currentProgress: number
}) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [progress, setProgress] = useState(currentProgress)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, progress }),
      })
      if (res.ok) router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
      <div>
        <label htmlFor="status" className="block text-xs font-medium text-zinc-500">Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="progress" className="block text-xs font-medium text-zinc-500">Progress</label>
        <input
          id="progress"
          type="number"
          min={0}
          max={100}
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          className="mt-1 w-20 rounded-md border border-zinc-300 px-3 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <button
        type="submit"
        disabled={saving}
        className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Update"}
      </button>
    </form>
  )
}
