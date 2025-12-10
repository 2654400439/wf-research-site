import { Link } from 'react-router-dom'
import { usePapersData } from '../hooks/usePapersData'
import { StatCard } from '../components/StatCard'
import { PaperCard } from '../components/PaperCard'
import { useLocalBookmarks } from '../hooks/useLocalBookmarks'
import { Tag } from '../components/Tag'

export default function HomePage() {
  const { papers, loading, error, facets } = usePapersData()
  const { ids, toggle } = useLocalBookmarks()

  const latest = papers
    .slice()
    .sort((a, b) => b.year - a.year)
    .slice(0, 3)

  const topSubfields = papers
    .flatMap((p) => p.subfields)
    .reduce<Record<string, number>>((acc, cur) => {
      acc[cur] = (acc[cur] || 0) + 1
      return acc
    }, {})
  const topSubfieldList = Object.entries(topSubfields)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)

  return (
    <div className="space-y-8">
      <section className="card relative overflow-hidden px-6 py-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(76,99,173,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(31,152,255,0.12),transparent_30%)]" />
        <div className="relative grid gap-6 md:grid-cols-5">
          <div className="md:col-span-3 space-y-3">
            <p className="text-sm font-medium text-ink-700">网站指纹攻击 · 论文导航</p>
            <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 leading-tight">
              快速定位 WF 研究进展
            </h1>
            <p className="text-slate-600">
              汇集近年顶会论文，围绕小样本、多标签、特征工程与分类器等维度做结构化提炼，支持标签化检索、时间轴回溯与对比收藏。
            </p>
            <div className="flex gap-3">
              <Link className="rounded-full bg-ink-900 px-4 py-2 text-white shadow-soft" to="/papers">
                进入论文库
              </Link>
              <Link className="rounded-full border border-ink-200 px-4 py-2 text-ink-800 hover:bg-ink-100" to="/timeline">
                查看时间轴
              </Link>
            </div>
          </div>
          <div className="md:col-span-2 grid gap-3">
            <StatCard label="收录论文" value={papers.length} hint="按年份/标签/会议可筛选" />
            <StatCard
              label="年份跨度"
              value={
                facets.minYear && facets.maxYear ? `${facets.minYear} – ${facets.maxYear}` : loading ? '加载中' : '未设置'
              }
              hint="时间轴查看演进"
            />
            <StatCard label="会议/期刊" value={facets.venues.length} hint="含 NDSS/USENIX/CCS 等" />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">高频子领域标签</h2>
          <Link to="/papers" className="text-sm text-ink-700 underline">
            去筛选
          </Link>
        </div>
        <div className="card flex flex-wrap gap-2 px-4 py-4">
          {topSubfieldList.length ? (
            topSubfieldList.map(([tag, count]) => (
              <Tag key={tag}>
                {tag} · {count}
              </Tag>
            ))
          ) : (
            <span className="text-sm text-slate-500">暂无数据</span>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">最新收录</h2>
          <Link to="/papers" className="text-sm text-ink-700 underline">
            查看全部
          </Link>
        </div>
        {loading && <div className="text-slate-500">加载中…</div>}
        {error && <div className="text-red-600">加载失败：{error}</div>}
        {!loading && !latest.length && <div className="text-slate-500">暂无数据</div>}
        <div className="grid gap-4">
          {latest.map((paper) => (
            <PaperCard key={paper.id} paper={paper} bookmarked={ids.has(paper.id)} onToggleBookmark={toggle} />
          ))}
        </div>
      </section>
    </div>
  )
}

