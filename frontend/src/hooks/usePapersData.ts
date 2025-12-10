import { useEffect, useMemo, useState } from 'react'
import Fuse from 'fuse.js'
import { PaperCollectionSchema } from '../lib/schema'
import type { Paper } from '../lib/schema'

export type SortOption = 'year-desc' | 'year-asc' | 'title'

export interface Filters {
  query: string
  yearRange?: [number, number]
  venues: string[]
  subfields: string[]
  tasks: string[]
  features: string[]
  models: string[]
  tags: string[]
  sort: SortOption
  bookmarksOnly?: boolean
}

const defaultFilters: Filters = {
  query: '',
  venues: [],
  subfields: [],
  tasks: [],
  features: [],
  models: [],
  tags: [],
  sort: 'year-desc',
  bookmarksOnly: false,
}

export function usePapersData() {
  const [papers, setPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const url = `${import.meta.env.BASE_URL}data/papers.json`
        const res = await fetch(url)
        if (!res.ok) {
          throw new Error(`读取数据失败: ${res.statusText}`)
        }
        const json = await res.json()
        const parsed = PaperCollectionSchema.parse(json)
        setPapers(parsed)
      } catch (err) {
        setError(err instanceof Error ? err.message : '未知错误')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const facets = useMemo(() => {
    const years = papers.map((p) => p.year)
    return {
      minYear: years.length ? Math.min(...years) : undefined,
      maxYear: years.length ? Math.max(...years) : undefined,
      venues: unique(papers.flatMap((p) => p.venue)),
      subfields: unique(papers.flatMap((p) => p.subfields)),
      tasks: unique(papers.flatMap((p) => p.tasks)),
      features: unique(papers.flatMap((p) => p.features)),
      models: unique(papers.flatMap((p) => p.models)),
      tags: unique(papers.flatMap((p) => p.tags)),
    }
  }, [papers])

  return { papers, loading, error, facets }
}

function unique(list: string[]) {
  return Array.from(new Set(list)).filter(Boolean).sort()
}

export function useFilteredPapers(
  papers: Paper[],
  filters: Partial<Filters> = {},
  bookmarkedIds: Set<string> = new Set(),
) {
  const mergedFilters = { ...defaultFilters, ...filters }

  const fuse = useMemo(() => {
    if (!papers.length) return null
    return new Fuse(papers, {
      keys: ['title', 'summary', 'authors', 'venue', 'keywords', 'subfields', 'tasks', 'features', 'models'],
      threshold: 0.35,
    })
  }, [papers])

  const filtered = useMemo(() => {
    let result = papers

    if (mergedFilters.bookmarksOnly) {
      result = result.filter((p) => bookmarkedIds.has(p.id))
    }

    if (mergedFilters.query && fuse) {
      result = fuse.search(mergedFilters.query).map((r) => r.item)
    }

    if (mergedFilters.yearRange) {
      const [start, end] = mergedFilters.yearRange
      result = result.filter((p) => p.year >= start && p.year <= end)
    }

    if (mergedFilters.venues.length) {
      result = result.filter((p) => mergedFilters.venues.includes(p.venue))
    }
    if (mergedFilters.subfields.length) {
      result = result.filter((p) => intersects(p.subfields, mergedFilters.subfields))
    }
    if (mergedFilters.tasks.length) {
      result = result.filter((p) => intersects(p.tasks, mergedFilters.tasks))
    }
    if (mergedFilters.features.length) {
      result = result.filter((p) => intersects(p.features, mergedFilters.features))
    }
    if (mergedFilters.models.length) {
      result = result.filter((p) => intersects(p.models, mergedFilters.models))
    }
    if (mergedFilters.tags.length) {
      result = result.filter((p) => intersects(p.tags, mergedFilters.tags))
    }

    switch (mergedFilters.sort) {
      case 'year-asc':
        result = [...result].sort((a, b) => a.year - b.year)
        break
      case 'year-desc':
        result = [...result].sort((a, b) => b.year - a.year)
        break
      case 'title':
        result = [...result].sort((a, b) => a.title.localeCompare(b.title))
        break
      default:
        break
    }

    return result
  }, [papers, mergedFilters, fuse, bookmarkedIds])

  return filtered
}

function intersects(list: string[], selected: string[]) {
  const set = new Set(selected)
  return list.some((item) => set.has(item))
}

