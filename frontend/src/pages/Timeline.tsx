import Timeline from '../components/Timeline'
import { useLocalBookmarks } from '../hooks/useLocalBookmarks'
import { usePapersData } from '../hooks/usePapersData'

export default function TimelinePage() {
  const { papers, loading, error } = usePapersData()
  const { ids, toggle } = useLocalBookmarks()

  if (loading) return <div className="text-slate-500">加载中…</div>
  if (error) return <div className="text-red-600">加载失败：{error}</div>

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">时间轴</h1>
        <p className="text-sm text-slate-600">按年份查看关键论文与标签，支持直接收藏。</p>
      </div>
      <Timeline papers={papers} bookmarked={ids} onToggleBookmark={toggle} />
    </div>
  )
}

