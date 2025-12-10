import type { Paper } from '../lib/schema'
import { BookmarkIcon } from './icons/BookmarkIcon'
import { Link } from 'react-router-dom'

interface Props {
  papers: Paper[]
  bookmarked: Set<string>
  onToggleBookmark: (id: string) => void
}

export default function Timeline({ papers, bookmarked, onToggleBookmark }: Props) {
  const grouped = papers.reduce<Record<number, Paper[]>>((acc, paper) => {
    acc[paper.year] = acc[paper.year] || []
    acc[paper.year].push(paper)
    return acc
  }, {})
  const years = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a)

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 h-full w-px bg-ink-200" aria-hidden />
      <div className="space-y-8">
        {years.map((year) => (
          <section key={year} className="relative pl-10">
            <div className="absolute left-0 top-2 h-4 w-4 rounded-full border-2 border-white bg-ink-700 shadow-soft" />
            <div className="mb-3 text-lg font-semibold text-ink-900">{year}</div>
            <div className="space-y-3">
              {grouped[year].map((paper) => (
                <article key={paper.id} className="card px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link to={`/papers/${paper.id}`} className="text-base font-semibold text-slate-900 hover:text-ink-700">
                        {paper.title}
                      </Link>
                      <div className="text-sm text-slate-600">{paper.venue}</div>
                      <div className="text-xs text-slate-500">{paper.authors.join(', ')}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onToggleBookmark(paper.id)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${
                        bookmarked.has(paper.id) ? 'bg-ink-900 text-white border-ink-900' : 'bg-white text-ink-700 hover:bg-ink-100'
                      }`}
                    >
                      <BookmarkIcon filled={bookmarked.has(paper.id)} className="mr-1 h-4 w-4" />
                      收藏
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-slate-700 line-clamp-2">{paper.summary}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
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
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

