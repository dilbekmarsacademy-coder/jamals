import { useEffect, useRef, useState } from 'react'

let apiPromise: Promise<void> | null = null

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve()
  if (apiPromise) return apiPromise
  apiPromise = new Promise<void>((resolve) => {
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      prev?.()
      resolve()
    }
    const s = document.createElement('script')
    s.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(s)
  })
  return apiPromise
}

interface Options {
  videoId: string
  /** Fraction already watched (restored from storage) */
  initialWatched: number
  onProgress: (fraction: number) => void
  onEnded: () => void
}

/**
 * Mounts a YouTube player and measures how much was *actually watched*:
 * only real playback time is counted (seeking forward doesn't count),
 * so the "Dars tugallandi" state can't be skipped to.
 */
export function useYouTubePlayer({ videoId, initialWatched, onProgress, onEnded }: Options) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YT.Player | null>(null)
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [position, setPosition] = useState(0)
  const [error, setError] = useState(false)

  const cb = useRef({ onProgress, onEnded })
  cb.current = { onProgress, onEnded }

  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setInterval> | undefined
    let watchedSec = 0
    let lastT = 0
    setReady(false)
    setError(false)
    setPosition(0)

    loadYouTubeApi().then(() => {
      if (cancelled || !containerRef.current) return
      const mount = document.createElement('div')
      containerRef.current.innerHTML = ''
      containerRef.current.appendChild(mount)

      playerRef.current = new window.YT!.Player(mount, {
        videoId,
        width: '100%',
        height: '100%',
        playerVars: { rel: 0, modestbranding: 1, playsinline: 1 },
        events: {
          onReady: (e) => {
            const d = e.target.getDuration()
            setDuration(d)
            watchedSec = initialWatched * d
            setReady(true)
          },
          onError: () => setError(true),
          onStateChange: (e) => {
            const isPlaying = e.data === 1
            setPlaying(isPlaying)
            if (isPlaying) {
              lastT = e.target.getCurrentTime()
              clearInterval(timer)
              timer = setInterval(() => {
                const p = playerRef.current
                if (!p) return
                const t = p.getCurrentTime()
                const d = p.getDuration() || 1
                const delta = t - lastT
                // Count only natural playback (≤ 2s jumps, includes 2x speed)
                if (delta > 0 && delta <= 2.1) watchedSec = Math.min(d, watchedSec + delta)
                lastT = t
                setPosition(t)
                setDuration(d)
                cb.current.onProgress(watchedSec / d)
              }, 500)
            } else {
              clearInterval(timer)
            }
            if (e.data === 0) cb.current.onEnded()
          },
        },
      })
    })

    return () => {
      cancelled = true
      clearInterval(timer)
      playerRef.current?.destroy()
      playerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId])

  return { containerRef, ready, playing, duration, position, error }
}
