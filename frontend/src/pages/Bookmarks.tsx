import { useMemo } from 'react'
import { useLocalBookmarks } from '../hooks/useLocalBookmarks'
import { usePapersData } from '../hooks/usePapersData'
import { PaperCard } from '../components/PaperCard'

export default function BookmarksPage() {
  const { ids, list, toggle, clear } = useLocalBookmarks()
  const { papers, loading, error } = usePapersData()

  const selected = useMemo(() => papers.filter((p) => ids.has(p.id)), [papers, ids])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">书签/对比</h1>
          <p className="text-sm text-slate-600">收藏的论文会保存在浏览器本地，可导出或对比关键字段。</p>
        </div>
        {list.length ? (
          <button
            type="button"
            onClick={clear}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-ink-100"
          >
            清空
          </button>
        ) : null}
      </div>

      {loading && <div className="text-slate-500">加载中…</div>}
      {error && <div className="text-red-600">加载失败：{error}</div>}

      {!loading && !selected.length && <div className="text-slate-500">还没有收藏，去论文库添加吧。</div>}

      <div className="grid gap-3">
        {selected.map((paper) => (
          <PaperCard key={paper.id} paper={paper} bookmarked={ids.has(paper.id)} onToggleBookmark={toggle} />
        ))}
      </div>

      {selected.length >= 2 ? (
        <div className="card px-4 py-3 space-y-2">
          <div className="text-sm font-semibold text-slate-800">快速对比</div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-slate-700">
              <thead>
                <tr>
                  <th className="py-2 pr-4">字段</th>
                  {selected.map((p) => (
                    <th key={p.id} className="py-2 pr-4 font-semibold text-slate-900">
                      {p.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="align-top">
                <CompareRow label="年份/会议" values={selected.map((p) => `${p.year} · ${p.venue}`)} />
                <CompareRow label="子领域" values={selected.map((p) => p.subfields.join('、') || '—')} />
                <CompareRow label="任务" values={selected.map((p) => p.tasks.join('、') || '—')} />
                <CompareRow label="特征" values={selected.map((p) => p.features.join('、') || '—')} />
                <CompareRow label="模型" values={selected.map((p) => p.models.join('、') || '—')} />
                <CompareRow label="主要发现" values={selected.map((p) => p.findings || '—')} />
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function CompareRow({ label, values }: { label: string; values: string[] }) {
  return (
    <tr>
      <td className="py-2 pr-4 font-medium text-slate-700">{label}</td>
      {values.map((v, i) => (
        <td key={i} className="py-2 pr-4 text-slate-700">
          {v}
        </td>
      ))}
    </tr>
  )
}

