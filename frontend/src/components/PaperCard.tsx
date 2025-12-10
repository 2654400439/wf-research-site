import { Link } from 'react-router-dom'
import type { Paper } from '../lib/schema'
import { BookmarkIcon } from './icons/BookmarkIcon'

interface Props {
  paper: Paper
  bookmarked: boolean
  onToggleBookmark: (id: string) => void
}

export function PaperCard({ paper, bookmarked, onToggleBookmark }: Props) {
  return (
    <article className="card relative overflow-hidden px-5 py-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-ink-700">
              <span className="rounded-full bg-ink-100 px-2 py-1 font-semibold text-ink-800">{paper.year}</span>
              <span className="text-slate-500">{paper.venue}</span>
            </div>
            <Link to={`/papers/${paper.id}`} className="text-lg font-semibold text-slate-900 hover:text-ink-700">
              {paper.title}
            </Link>
            <div className="text-sm text-slate-600 mt-1">{paper.authors.join(', ')}</div>
          </div>
          <button
            type="button"
            onClick={() => onToggleBookmark(paper.id)}
            className={`rounded-full border px-3 py-2 text-sm font-medium transition-colors ${
              bookmarked ? 'bg-ink-900 text-white border-ink-900' : 'bg-white text-slate-700 hover:bg-ink-100'
            }`}
          >
            <BookmarkIcon filled={bookmarked} className="mr-2 h-4 w-4" />
            {bookmarked ? '已收藏' : '收藏'}
          </button>
        </div>
        <p className="text-sm leading-relaxed text-slate-700 line-clamp-3">{paper.summary}</p>
        <div className="flex flex-wrap gap-2">
          {paper.subfields.slice(0, 3).map((tag) => (
            <span key={tag} className="pill bg-ink-100 text-ink-800">
              {tag}
            </span>
          ))}
          {paper.tasks.slice(0, 2).map((tag) => (
            <span key={tag} className="pill bg-accent-100 text-accent-800">
              {tag}
            </span>
          ))}
          {paper.features.slice(0, 2).map((tag) => (
            <span key={tag} className="pill bg-white text-ink-700 border border-ink-200">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 text-sm text-ink-700">
          {paper.links.pdf && (
            <a className="text-ink-700 hover:text-ink-900 underline" href={paper.links.pdf} target="_blank" rel="noreferrer">
              PDF
            </a>
          )}
          {paper.links.code && (
            <a className="text-ink-700 hover:text-ink-900 underline" href={paper.links.code} target="_blank" rel="noreferrer">
              代码
            </a>
          )}
          {paper.links.project && (
            <a className="text-ink-700 hover:text-ink-900 underline" href={paper.links.project} target="_blank" rel="noreferrer">
              项目
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

