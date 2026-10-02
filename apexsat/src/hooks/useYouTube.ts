'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

let apiPromise: Promise<void> | null = null

function loadApi() {
  if (window.YT?.Player) return Promise.resolve()
  if (apiPromise) return apiPromise
  apiPromise = new Promise<void>((resolve, reject) => {
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      prev?.()
      resolve()
    }
    const s = document.createElement('script')
    s.src = 'https://www.youtube.com/iframe_api'
    s.onerror = () => {
      apiPromise = null
      reject(new Error('YouTube API failed to load'))
    }
    document.head.appendChild(s)
  })
  return apiPromise
}

interface Options {
  videoId: string
  startAt: number
  /** Furthest fraction already watched (restored from storage) */
  initialWatched: number
  onProgress: (watched: number, position: number) => void
  onEnded: () => void
}

/**
 * YouTube player driven entirely by our own controls (`controls=0`).
 * "Watched" only grows with natural playback, so scrubbing to the end
 * doesn't count as having watched the lesson.
 */
export function useYouTube({ videoId, startAt, initialWatched, onProgress, onEnded }: Options) {
  // Callback-ref state (not a ref object) so consumers can read the hook result during render
  const [mountEl, setMountEl] = useState<HTMLDivElement | null>(null)
  const playerRef = useRef<YT.Player | null>(null)
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [buffering, setBuffering] = useState(false)
  const [duration, setDuration] = useState(0)
  const [position, setPosition] = useState(0)
  const [watched, setWatched] = useState(initialWatched)
  const [rate, setRateState] = useState(1)
  const [muted, setMuted] = useState(false)
  const [error, setError] = useState(false)

  const cb = useRef({ onProgress, onEnded })
  useEffect(() => {
    cb.current = { onProgress, onEnded }
  })

  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setInterval> | undefined
    let watchedSec = 0
    let lastT = 0
    let lastSaved = 0

    loadApi()
      .then(() => {
        if (cancelled || !mountEl || !window.YT) return
        const el = document.createElement('div')
        mountEl.replaceChildren(el)
        playerRef.current = new window.YT.Player(el, {
          videoId,
          width: '100%',
          height: '100%',
          playerVars: { controls: 0, disablekb: 1, rel: 0, modestbranding: 1, playsinline: 1, iv_load_policy: 3, fs: 0, start: Math.floor(startAt) },
          events: {
            onReady: (e) => {
              const d = e.target.getDuration()
              setDuration(d)
              watchedSec = initialWatched * d
              lastT = startAt
              setPosition(startAt)
              setReady(true)
            },
            onError: () => setError(true),
            onStateChange: (e) => {
              const state = e.data
              setPlaying(state === 1)
              setBuffering(state === 3)
              if (state === 0) {
                setPlaying(false)
                cb.current.onEnded()
              }
            },
          },
        })
        timer = setInterval(() => {
          const p = playerRef.current
          if (!p?.getCurrentTime) return
          const t = p.getCurrentTime()
          const d = p.getDuration() || 1
          const delta = t - lastT
          // Natural playback only: small forward steps (≤ 2x speed × tick + slack)
          if (p.getPlayerState() === 1 && delta > 0 && delta <= 1.2) watchedSec = Math.min(d, watchedSec + delta)
          lastT = t
          setPosition(t)
          setDuration(d)
          const frac = watchedSec / d
          setWatched(frac)
          if (Math.abs(t - lastSaved) >= 5) {
            lastSaved = t
            cb.current.onProgress(frac, t)
          }
        }, 250)
      })
      .catch(() => setError(true))

    return () => {
      cancelled = true
      clearInterval(timer)
      const p = playerRef.current
      if (p?.getCurrentTime) cb.current.onProgress(watchedSec / (p.getDuration() || 1), p.getCurrentTime())
      p?.destroy()
      playerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, mountEl])

  const play = useCallback(() => playerRef.current?.playVideo(), [])
  const pause = useCallback(() => playerRef.current?.pauseVideo(), [])
  const toggle = useCallback(() => (playing ? pause() : play()), [playing, play, pause])
  const seek = useCallback((sec: number) => {
    const p = playerRef.current
    if (!p) return
    p.seekTo(Math.max(0, sec), true)
    setPosition(sec)
  }, [])
  const setRate = useCallback((r: number) => {
    playerRef.current?.setPlaybackRate(r)
    setRateState(r)
  }, [])
  const toggleMute = useCallback(() => {
    const p = playerRef.current
    if (!p) return
    const was = p.isMuted()
    if (was) p.unMute()
    else p.mute()
    setMuted(!was)
  }, [])

  return { mount: setMountEl, ready, playing, buffering, duration, position, watched, rate, muted, error, play, pause, toggle, seek, setRate, toggleMute }
}
