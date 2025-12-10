import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import FilterPanel from '../components/FilterPanel'
import { PaperCard } from '../components/PaperCard'
import { useFilteredPapers, usePapersData } from '../hooks/usePapersData'
import type { Filters } from '../hooks/usePapersData'
import { useLocalBookmarks } from '../hooks/useLocalBookmarks'

export default function PapersPage() {
  const { papers, loading, error, facets } = usePapersData()
  const { ids, toggle } = useLocalBookmarks()
  const [filters, setFilters] = useState<Filters>({
    query: '',
    venues: [],
    subfields: [],
    tasks: [],
    features: [],
    models: [],
    tags: [],
    sort: 'year-desc',
    yearRange: undefined,
    bookmarksOnly: false,
  })

  useEffect(() => {
    if (facets.minYear && facets.maxYear && !filters.yearRange) {
      setFilters((prev) => ({ ...prev, yearRange: [facets.minYear!, facets.maxYear!] }))
    }
  }, [facets.minYear, facets.maxYear, filters.yearRange])

  const filtered = useFilteredPapers(papers, filters, ids)

  const countsText = useMemo(
    () => `${filtered.length} / ${papers.length || 0} 篇`,
    [filtered.length, papers.length],
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-900">论文库</h1>
        <p className="text-slate-600 text-sm">
          按年份、会议、子领域、小样本/多标签等标签过滤。可收藏或跳转详情页。
        </p>
      </div>

      <div className="card flex flex-col gap-3 px-4 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            placeholder="标题 / 作者 / 特征 / 模型 关键词"
            value={filters.query}
            onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-ink-400 focus:outline-none focus:ring-1 focus:ring-ink-300 md:w-96"
          />
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={filters.bookmarksOnly}
              onChange={(e) => setFilters((prev) => ({ ...prev, bookmarksOnly: e.target.checked }))}
            />
            仅看收藏
          </label>
          <span className="text-sm text-slate-500">{countsText}</span>
        </div>
      </div>

      <FilterPanel filters={filters} facets={facets} onChange={setFilters} />

      {loading && <div className="text-slate-500">加载中…</div>}
      {error && <div className="text-red-600">加载失败：{error}</div>}
      {!loading && !filtered.length && <div className="text-slate-500">暂无匹配结果</div>}

      <div className="grid gap-4">
        {filtered.map((paper) => (
          <PaperCard key={paper.id} paper={paper} bookmarked={ids.has(paper.id)} onToggleBookmark={toggle} />
        ))}
      </div>

      <div className="text-sm text-slate-500">
        数据有误或缺失？可在 <Link className="underline text-ink-700" to="/bookmarks">书签页</Link> 导出选中列表，或在{' '}
        <a className="underline text-ink-700" href="https://github.com/" target="_blank" rel="noreferrer">
          GitHub
        </a>{' '}
        提 issue 更新数据。
      </div>
    </div>
  )
}

