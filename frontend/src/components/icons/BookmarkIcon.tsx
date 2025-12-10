export function BookmarkIcon({ filled = false, className = '' }: { filled?: boolean; className?: string }) {
  if (filled) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M6.75 4.5A2.25 2.25 0 0 1 9 2.25h6a2.25 2.25 0 0 1 2.25 2.25v16.06a.75.75 0 0 1-1.19.6L12 17.21l-4.06 3.95a.75.75 0 0 1-1.19-.6z" />
      </svg>
    )
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 4.5A2.25 2.25 0 0 1 9 2.25h6a2.25 2.25 0 0 1 2.25 2.25v16.06a.75.75 0 0 1-1.19.6L12 17.21l-4.06 3.95a.75.75 0 0 1-1.19-.6z"
      />
    </svg>
  )
}

