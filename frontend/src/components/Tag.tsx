import type { ReactNode } from 'react'
import clsx from 'clsx'

export function Tag({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'accent' | 'neutral' }) {
  return (
    <span
      className={clsx('pill', {
        'bg-accent-100 text-accent-800': tone === 'accent',
        'bg-white border border-ink-200 text-ink-800': tone === 'neutral',
      })}
    >
      {children}
    </span>
  )
}

