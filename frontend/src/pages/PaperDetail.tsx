import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMemo } from 'react'
import { usePapersData } from '../hooks/usePapersData'
import { useLocalBookmarks } from '../hooks/useLocalBookmarks'
import { Tag } from '../components/Tag'
import { BookmarkIcon } from '../components/icons/BookmarkIcon'

export default function PaperDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { papers, loading, error } = usePapersData()
  const { ids, toggle } = useLocalBookmarks()
  const navigate = useNavigate()

  const paper = useMemo(() => papers.find((p) => p.id === id), [papers, id])
  const related = useMemo(() => {
    if (!paper) return []
    const set = new Set([...paper.subfields, ...paper.tasks, ...paper.features, ...paper.models])
    return papers
      .filter((p) => p.id !== paper.id && p.subfields.some((t) => set.has(t)))
      .slice(0, 3)
  }, [paper, papers])

  if (loading) return <div className="text-slate-500">加载中…</div>
  if (error) return <div className="text-red-600">加载失败：{error}</div>
  if (!paper) return <div className="text-slate-500">未找到该论文。<button className="underline" onClick={() => navigate(-1)}>返回</button></div>

  return (
    <div className="space-y-6">
      <div className="card px-5 py-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-wide text-ink-600">
              {paper.year} · {paper.venue}
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">{paper.title}</h1>
            <div className="text-sm text-slate-600">{paper.authors.join(', ')}</div>
          </div>
          <button
            type="button"
            onClick={() => toggle(paper.id)}
            className={`rounded-full border px-4 py-2 text-sm font-medium ${
              ids.has(paper.id) ? 'bg-ink-900 text-white border-ink-900' : 'bg-white text-ink-700 hover:bg-ink-100'
            }`}
          >
            <BookmarkIcon filled={ids.has(paper.id)} className="mr-2 h-4 w-4" />
            {ids.has(paper.id) ? '已收藏' : '收藏'}
          </button>
        </div>
        <p className="mt-3 text-slate-700 leading-relaxed">{paper.summary}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {paper.subfields.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
          {paper.tasks.map((t) => (
            <Tag key={t} tone="accent">
              {t}
            </Tag>
          ))}
          {paper.features.map((t) => (
            <Tag key={t} tone="neutral">
              {t}
            </Tag>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <InfoBlock title="特征/信道">
          {paper.features.length ? paper.features.join('、') : '未标注'}
        </InfoBlock>
        <InfoBlock title="分类器/模型">{paper.models.length ? paper.models.join('、') : '未标注'}</InfoBlock>
        <InfoBlock title="任务与标签">
          {paper.tasks.length ? paper.tasks.join('、') : '未标注'}
          {paper.tags.length ? <div className="text-xs text-slate-500 mt-1">标签：{paper.tags.join('、')}</div> : null}
        </InfoBlock>
        <InfoBlock title="数据集与指标">
          {paper.datasets.length ? <div>数据集：{paper.datasets.join('、')}</div> : null}
          {paper.metrics.length ? <div>指标：{paper.metrics.join('、')}</div> : null}
          {!paper.datasets.length && !paper.metrics.length ? '未标注' : null}
        </InfoBlock>
      </div>

      <div className="card px-4 py-3 space-y-3">
        <Section title="主要发现">{paper.findings || '未填写'}</Section>
        <Section title="局限性">{paper.limitations || '未填写'}</Section>
        <Section title="未来工作">{paper.future_work || '未填写'}</Section>
        <Section title="链接">
          <div className="flex flex-wrap gap-3 text-sm text-ink-700">
            {paper.links.pdf && (
              <a className="underline" href={paper.links.pdf} target="_blank" rel="noreferrer">
                PDF
              </a>
            )}
            {paper.links.code && (
              <a className="underline" href={paper.links.code} target="_blank" rel="noreferrer">
                代码
              </a>
            )}
            {paper.links.dataset && (
              <a className="underline" href={paper.links.dataset} target="_blank" rel="noreferrer">
                数据集
              </a>
            )}
            {!paper.links.pdf && !paper.links.code && !paper.links.dataset ? '暂无' : null}
          </div>
        </Section>
      </div>

      {related.length ? (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">相关论文</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {related.map((p) => (
              <Link key={p.id} to={`/papers/${p.id}`} className="card px-4 py-3 hover:shadow-soft transition-shadow">
                <div className="text-sm text-slate-500">
                  {p.year} · {p.venue}
                </div>
                <div className="text-base font-semibold text-slate-900">{p.title}</div>
                <div className="text-xs text-slate-500 mt-1 line-clamp-2">{p.summary}</div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card px-4 py-3">
      <div className="text-sm font-medium text-slate-700">{title}</div>
      <div className="text-sm text-slate-600 mt-1 leading-relaxed">{children}</div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="text-sm font-semibold text-slate-800">{title}</div>
      <div className="text-sm text-slate-600 leading-relaxed">{children}</div>
    </div>
  )
}

