import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'wf-fp-bookmarks'

export function useLocalBookmarks() {
  const [ids, setIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        const parsed: string[] = JSON.parse(raw)
        setIds(new Set(parsed))
      } catch (err) {
        console.warn('书签读取失败', err)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)))
  }, [ids])

  const toggle = (id: string) => {
    setIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const clear = () => setIds(new Set())

  const list = useMemo(() => Array.from(ids), [ids])

  return { ids, list, toggle, clear }
}

