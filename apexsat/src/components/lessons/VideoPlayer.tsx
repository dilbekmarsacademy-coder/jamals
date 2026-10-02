'use client'

import { useEffect, useRef, useState } from 'react'
import * as DM from '@radix-ui/react-dropdown-menu'
import { motion, AnimatePresence } from 'framer-motion'
import { Pause, Play, Maximize, Minimize, Volume2, VolumeX, RotateCcw, RotateCw, Loader2, Check, Gauge } from 'lucide-react'
import type { Chapter } from '@/types'
import { useT } from '@/i18n'
import type { useYouTube } from '@/hooks/useYouTube'
import { formatClock, cn } from '@/lib/utils'

export type Player = ReturnType<typeof useYouTube>

export const SPEEDS = [0.75, 1, 1.25, 1.5, 2]

export function VideoPlayer({ player, chapters, title }: { player: Player; chapters: Chapter[]; title: string }) {
  const { t, tr } = useT()
  const [wrapEl, setWrapEl] = useState<HTMLDivElement | null>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [hover, setHover] = useState<{ x: number; t: number } | null>(null)
  const [dragging, setDragging] = useState(false)
  const { ready, playing, buffering, duration, position, rate, muted, error, mount } = player

  useEffect(() => {
    const onFs = () => setFullscreen(Boolean(wrapEl) && document.fullscreenElement === wrapEl)
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [wrapEl])

  const visibleChapters = chapters.filter((c) => !duration || c.t < duration - 5)
  const current = [...visibleChapters].reverse().find((c) => position >= c.t)

  const timeAt = (clientX: number) => {
    const r = barRef.current!.getBoundingClientRect()
    const frac = Math.min(1, Math.max(0, (clientX - r.left) / r.width))
    return { frac, t: frac * duration, x: clientX - r.left }
  }

  const toggleFs = () => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void wrapEl?.requestFullscreen()
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
    if (e.key === ' ' || e.key === 'k') {
      e.preventDefault()
      player.toggle()
    } else if (e.key === 'ArrowRight') player.seek(position + 5)
    else if (e.key === 'ArrowLeft') player.seek(position - 5)
    else if (e.key === 'f') toggleFs()
    else if (e.key === 'm') player.toggleMute()
  }

  const pct = duration ? (position / duration) * 100 : 0
  const watchedPct = player.watched * 100

  return (
    <div
      ref={setWrapEl}
      tabIndex={0}
      onKeyDown={onKey}
      aria-label={t('player.aria', { title })}
      className={cn('group/player relative overflow-hidden bg-black outline-none', fullscreen ? 'flex h-full w-full flex-col justify-center' : 'rounded-2xl border border-line')}
    >
      <div className="relative aspect-video w-full">
        <div ref={mount} className="absolute inset-0 [&>iframe]:h-full [&>iframe]:w-full" />
        {/* Click layer: our controls own all interaction */}
        <button type="button" className="absolute inset-0 z-10 cursor-pointer" onClick={() => player.toggle()} aria-label={playing ? t('player.pause') : t('player.play')} tabIndex={-1} />

        <AnimatePresence>
          {ready && !playing && !buffering && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.2 }} className="pointer-events-none absolute inset-0 z-10 grid place-items-center bg-black/30">
              <span className="grid size-16 place-items-center rounded-full bg-cta text-[#04121a] shadow-[0_0_40px_rgb(0_242_254/0.5)]">
                <Play className="ml-1 size-7 fill-current" />
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        {(!ready || buffering) && !error && (
          <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
            <Loader2 className="size-9 animate-spin text-cyan-fg" />
          </div>
        )}
        {error && (
          <div className="absolute inset-0 z-20 grid place-items-center bg-surface p-6 text-center text-sm text-muted">{t('player.error')}</div>
        )}
        {current && ready && (
          <div className="pointer-events-none absolute left-3 top-3 z-10 rounded-lg bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
            {tr(current.title)}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="relative z-20 bg-[linear-gradient(transparent,rgb(0_0_0/0.85))] px-3 pb-2.5 pt-2 text-white sm:px-4">
        {/* Scrub bar */}
        <div
          ref={barRef}
          role="slider"
          tabIndex={0}
          aria-label={t('player.seek')}
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(position)}
          aria-valuetext={formatClock(position)}
          className="group/bar relative flex h-5 cursor-pointer touch-none items-center"
          onPointerDown={(e) => {
            if (!duration) return
            e.currentTarget.setPointerCapture(e.pointerId)
            setDragging(true)
            player.seek(timeAt(e.clientX).t)
          }}
          onPointerMove={(e) => {
            if (!duration) return
            const p = timeAt(e.clientX)
            setHover({ x: p.x, t: p.t })
            if (dragging) player.seek(p.t)
          }}
          onPointerUp={() => setDragging(false)}
          onPointerLeave={() => setHover(null)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') {
              e.stopPropagation()
              player.seek(position + 5)
            } else if (e.key === 'ArrowLeft') {
              e.stopPropagation()
              player.seek(position - 5)
            }
          }}
        >
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/20 transition-[height] group-hover/bar:h-2">
            <div className="absolute inset-y-0 left-0 bg-white/25" style={{ width: `${watchedPct}%` }} />
            <div className="absolute inset-y-0 left-0 bg-[linear-gradient(90deg,var(--cyan-bright),var(--violet))]" style={{ width: `${pct}%` }} />
          </div>
          {duration > 0 &&
            visibleChapters
              .filter((c) => c.t > 0)
              .map((c) => <span key={c.t} className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 rounded bg-gold" style={{ left: `${(c.t / duration) * 100}%` }} />)}
          <span className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow opacity-0 transition group-hover/bar:opacity-100" style={{ left: `${pct}%` }} />
          {hover && duration > 0 && (
            <span className="pointer-events-none absolute -top-8 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/85 px-2 py-0.5 text-[11px] font-semibold tnum" style={{ left: hover.x }}>
              {formatClock(hover.t)}
              {(() => {
                const ch = [...visibleChapters].reverse().find((c) => hover.t >= c.t)
                return ch ? ` · ${tr(ch.title)}` : ''
              })()}
            </span>
          )}
        </div>

        <div className="mt-1 flex items-center gap-1 sm:gap-2">
          <CtrlButton label={playing ? t('player.pause') : t('player.play')} onClick={() => player.toggle()}>
            {playing ? <Pause className="fill-current" /> : <Play className="fill-current" />}
          </CtrlButton>
          <CtrlButton label={t('player.back10')} onClick={() => player.seek(position - 10)}>
            <RotateCcw />
          </CtrlButton>
          <CtrlButton label={t('player.fwd10')} onClick={() => player.seek(position + 10)}>
            <RotateCw />
          </CtrlButton>
          <CtrlButton label={muted ? t('player.unmute') : t('player.mute')} onClick={() => player.toggleMute()}>
            {muted ? <VolumeX /> : <Volume2 />}
          </CtrlButton>
          <span className="ml-1 text-xs font-semibold tnum text-white/90">
            {formatClock(position)} <span className="text-white/50">/ {formatClock(duration)}</span>
          </span>

          <div className="ml-auto flex items-center gap-1">
            <DM.Root>
              <DM.Trigger className="inline-flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-bold tnum text-white hover:bg-white/15" aria-label={t('player.speed')}>
                <Gauge className="size-4" />
                {rate}x
              </DM.Trigger>
              <DM.Portal container={fullscreen ? wrapEl : undefined}>
                <DM.Content side="top" align="end" sideOffset={8} className="z-[60] min-w-28 rounded-xl border border-line bg-surface p-1 shadow-2xl">
                  <DM.Label className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-subtle">{t('player.speed')}</DM.Label>
                  {SPEEDS.map((s) => (
                    <DM.Item
                      key={s}
                      onSelect={() => player.setRate(s)}
                      className="flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-sm tnum text-fg outline-none data-[highlighted]:bg-surface-2"
                    >
                      {s}x{s === rate && <Check className="size-3.5 text-cyan-fg" />}
                    </DM.Item>
                  ))}
                </DM.Content>
              </DM.Portal>
            </DM.Root>
            <CtrlButton label={fullscreen ? t('player.exitFullscreen') : t('player.fullscreen')} onClick={toggleFs}>
              {fullscreen ? <Minimize /> : <Maximize />}
            </CtrlButton>
          </div>
        </div>
      </div>
    </div>
  )
}

function CtrlButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} className="grid size-8 place-items-center rounded-lg text-white transition hover:bg-white/15 [&_svg]:size-[18px]">
      {children}
    </button>
  )
}

/** Chapter list under the player */
export function ChapterList({ player, chapters }: { player: Player; chapters: Chapter[] }) {
  const { t, tr } = useT()
  const visible = chapters.filter((c) => !player.duration || c.t < player.duration - 5)
  const current = [...visible].reverse().find((c) => player.position >= c.t)
  return (
    <div>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-subtle">{t('lesson.chapters')}</h3>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {visible.map((c) => {
          const active = current?.t === c.t
          return (
            <button
              key={c.t}
              type="button"
              onClick={() => {
                player.seek(c.t)
                player.play()
              }}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition',
                active ? 'border-cyan/50 bg-cyan/10 text-fg-strong' : 'border-line bg-surface-2/40 text-fg hover:border-line-strong hover:bg-surface-2',
              )}
            >
              <span className={cn('rounded-md px-1.5 py-0.5 font-mono text-[11px] font-bold tnum', active ? 'bg-cyan text-[#04121a]' : 'bg-gold/15 text-gold-fg')}>{formatClock(c.t)}</span>
              <span className="font-semibold">{tr(c.title)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
