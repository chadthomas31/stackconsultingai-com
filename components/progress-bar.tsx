export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full rounded-full bg-zinc-200">
      <div
        className="h-2 rounded-full bg-blue-600"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}
