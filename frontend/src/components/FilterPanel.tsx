import type { Filters } from '../hooks/usePapersData'

interface Facets {
  minYear?: number
  maxYear?: number
  venues: string[]
  subfields: string[]
  tasks: string[]
  features: string[]
  models: string[]
  tags: string[]
}

interface Props {
  filters: Filters
  facets: Facets
  onChange: (next: Filters) => void
}

export default function FilterPanel({ filters, facets, onChange }: Props) {
  const update = (patch: Partial<Filters>) => onChange({ ...filters, ...patch })
  const toggleMulti = (field: keyof Filters, value: string) => {
    const current = (filters as any)[field] as string[]
    if (!Array.isArray(current)) return
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    onChange({ ...filters, [field]: next })
  }

  return (
    <div className="card mb-6 px-4 py-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-col text-sm text-slate-700">
          <span className="font-medium text-slate-900">年份</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="w-24 rounded-lg border border-slate-200 px-3 py-2 text-sm"
              min={facets.minYear}
              max={facets.maxYear}
              value={filters.yearRange?.[0] ?? facets.minYear ?? ''}
              onChange={(e) =>
                update({
                  yearRange: [
                    Number(e.target.value || facets.minYear || 0),
                    filters.yearRange?.[1] ?? facets.maxYear ?? Number(e.target.value || 0),
                  ] as [number, number],
                })
              }
            />
            <span className="text-slate-400">—</span>
            <input
              type="number"
              className="w-24 rounded-lg border border-slate-200 px-3 py-2 text-sm"
              min={facets.minYear}
              max={facets.maxYear}
              value={filters.yearRange?.[1] ?? facets.maxYear ?? ''}
              onChange={(e) =>
                update({
                  yearRange: [
                    filters.yearRange?.[0] ?? facets.minYear ?? Number(e.target.value || 0),
                    Number(e.target.value || facets.maxYear || 0),
                  ] as [number, number],
                })
              }
            />
          </div>
        </div>

        <SelectGroup
          label="会议/期刊"
          values={facets.venues}
          selected={filters.venues}
          onToggle={(v) => toggleMulti('venues', v)}
        />
        <SelectGroup
          label="子领域"
          values={facets.subfields}
          selected={filters.subfields}
          onToggle={(v) => toggleMulti('subfields', v)}
        />
        <SelectGroup
          label="任务"
          values={facets.tasks}
          selected={filters.tasks}
          onToggle={(v) => toggleMulti('tasks', v)}
        />
        <SelectGroup
          label="特征类型"
          values={facets.features}
          selected={filters.features}
          onToggle={(v) => toggleMulti('features', v)}
        />
        <SelectGroup
          label="模型/分类器"
          values={facets.models}
          selected={filters.models}
          onToggle={(v) => toggleMulti('models', v)}
        />
        <SelectGroup label="标签" values={facets.tags} selected={filters.tags} onToggle={(v) => toggleMulti('tags', v)} />

        <div className="flex flex-col text-sm text-slate-700">
          <span className="font-medium text-slate-900">排序</span>
          <select
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={filters.sort}
            onChange={(e) => update({ sort: e.target.value as Filters['sort'] })}
          >
            <option value="year-desc">按年份（新→旧）</option>
            <option value="year-asc">按年份（旧→新）</option>
            <option value="title">按标题</option>
          </select>
        </div>
      </div>
    </div>
  )
}

function SelectGroup({
  label,
  values,
  selected,
  onToggle,
}: {
  label: string
  values: string[]
  selected: string[]
  onToggle: (v: string) => void
}) {
  if (!values.length) return null
  return (
    <div className="flex flex-col gap-2 text-sm text-slate-700">
      <span className="font-medium text-slate-900">{label}</span>
      <div className="flex flex-wrap gap-2 max-w-[320px]">
        {values.map((v) => (
          <button
            key={v}
            type="button"
            className={`pill ${selected.includes(v) ? 'bg-ink-900 text-white shadow-soft' : 'hover:bg-ink-200'}`}
            onClick={() => onToggle(v)}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  )
}

