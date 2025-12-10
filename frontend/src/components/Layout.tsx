import { NavLink, useLocation } from 'react-router-dom'
import type { PropsWithChildren } from 'react'
import { useEffect, useState } from 'react'
import clsx from 'clsx'

const navItems = [
  { to: '/', label: '首页' },
  { to: '/papers', label: '论文库' },
  { to: '/timeline', label: '时间轴' },
  { to: '/bookmarks', label: '书签/对比' },
]

export default function Layout({ children }: PropsWithChildren) {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="page-shell">
      <header
        className={clsx(
          'sticky top-0 z-30 px-4 py-3 transition-all',
          scrolled ? 'bg-white/90 backdrop-blur-lg shadow-sm' : 'bg-transparent',
        )}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-ink-500 to-accent-500 text-white font-semibold shadow-card">
              WF
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-900">WF Research Radar</div>
              <div className="text-xs text-slate-500">网站指纹攻击论文导航</div>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  clsx(
                    'px-3 py-2 rounded-full transition-colors',
                    isActive || location.pathname === item.to
                      ? 'bg-ink-900 text-white shadow-soft'
                      : 'hover:bg-ink-100',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="px-4 pb-16">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  )
}

