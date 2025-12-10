interface StatCardProps {
  label: string
  value: string | number
  hint?: string
}

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="card flex flex-col gap-1 px-4 py-3">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="text-2xl font-semibold text-slate-900">{value}</div>
      {hint ? <div className="text-xs text-slate-500">{hint}</div> : null}
    </div>
  )
}

