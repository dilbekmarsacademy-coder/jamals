'use client'

import { useEffect, useState } from 'react'

/** Current time, re-rendering every `intervalMs`. Only use below the hydration gate. */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}
