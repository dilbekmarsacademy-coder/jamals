import { useEffect, useState } from 'react'

const cache = new Map<string, unknown>()

/**
 * Tiny query hook: shows skeletons on the first load of a key, then serves
 * from an in-memory cache (a drop-in spot for TanStack Query later).
 */
export function useQuery<T>(key: string, fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | undefined>(() => cache.get(key) as T | undefined)
  const [loading, setLoading] = useState(!cache.has(key))

  useEffect(() => {
    if (cache.has(key)) {
      setData(cache.get(key) as T)
      setLoading(false)
      return
    }
    let alive = true
    setLoading(true)
    fetcher().then((d) => {
      cache.set(key, d)
      if (alive) {
        setData(d)
        setLoading(false)
      }
    })
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return { data, loading }
}
