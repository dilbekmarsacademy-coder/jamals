'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useDragControls } from 'framer-motion'
import { Calculator as CalcIcon, GripHorizontal, Minus, Plus, RotateCcw, X, Delete } from 'lucide-react'
import { useT } from '@/i18n'
import { calculate, compile, formatResult } from '@/lib/calc'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

/* ───────────────────────── Scientific ───────────────────────── */

type Key = { label: string; insert?: string; action?: 'clear' | 'back' | 'eval' | 'mode'; tone?: 'op' | 'fn' | 'eq' }

const KEYS: Key[] = [
  { label: 'sin', insert: 'sin(', tone: 'fn' },
  { label: 'cos', insert: 'cos(', tone: 'fn' },
  { label: 'tan', insert: 'tan(', tone: 'fn' },
  { label: 'DEG', action: 'mode', tone: 'fn' },
  { label: 'AC', action: 'clear', tone: 'op' },
  { label: '√', insert: '√(', tone: 'fn' },
  { label: 'x²', insert: '^2', tone: 'fn' },
  { label: 'xʸ', insert: '^', tone: 'fn' },
  { label: '(', insert: '(', tone: 'fn' },
  { label: ')', insert: ')', tone: 'fn' },
  { label: 'ln', insert: 'ln(', tone: 'fn' },
  { label: 'log', insert: 'log(', tone: 'fn' },
  { label: 'π', insert: 'π', tone: 'fn' },
  { label: 'e', insert: 'e', tone: 'fn' },
  { label: '÷', insert: '÷', tone: 'op' },
  { label: '7', insert: '7' },
  { label: '8', insert: '8' },
  { label: '9', insert: '9' },
  { label: 'n!', insert: '!', tone: 'fn' },
  { label: '×', insert: '×', tone: 'op' },
  { label: '4', insert: '4' },
  { label: '5', insert: '5' },
  { label: '6', insert: '6' },
  { label: '%', insert: '%', tone: 'fn' },
  { label: '−', insert: '−', tone: 'op' },
  { label: '1', insert: '1' },
  { label: '2', insert: '2' },
  { label: '3', insert: '3' },
  { label: 'ans', insert: 'ans', tone: 'fn' },
  { label: '+', insert: '+', tone: 'op' },
  { label: '0', insert: '0' },
  { label: '.', insert: '.' },
  { label: '⌫', action: 'back' },
  { label: '=', action: 'eval', tone: 'eq' },
]

function Scientific() {
  const { t } = useT()
  const [expr, setExpr] = useState('')
  const [ans, setAns] = useState(0)
  const [degrees, setDegrees] = useState(true)
  const [history, setHistory] = useState<{ expr: string; result: string }[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const preview = useMemo(() => {
    if (!expr.trim()) return ''
    try {
      return formatResult(calculate(expr, { ans, degrees }))
    } catch {
      return ''
    }
  }, [expr, ans, degrees])

  const run = () => {
    if (!expr.trim()) return
    try {
      const v = calculate(expr, { ans, degrees })
      const result = formatResult(v)
      setHistory((h) => [{ expr, result }, ...h].slice(0, 4))
      if (Number.isFinite(v)) setAns(v)
      setExpr(result === 'Error' ? '' : result.replace('−', '-'))
    } catch {
      setHistory((h) => [{ expr, result: t('calc.syntax') }, ...h].slice(0, 4))
    }
  }

  const press = (k: Key) => {
    if (k.action === 'clear') setExpr('')
    else if (k.action === 'back') setExpr((e) => e.slice(0, -1))
    else if (k.action === 'eval') run()
    else if (k.action === 'mode') setDegrees((d) => !d)
    else setExpr((e) => e + k.insert)
    inputRef.current?.focus()
  }

  return (
    <div>
      <div className="rounded-xl border border-line bg-bg/60 p-2.5">
        <ul className="min-h-10 space-y-0.5 text-right text-[11px] text-subtle">
          {history
            .slice(0, 2)
            .reverse()
            .map((h, i) => (
              <li key={i} className="truncate tnum">
                <button type="button" className="hover:text-fg" onClick={() => setExpr((e) => e + h.result.replace('−', '-'))}>
                  {h.expr} = <span className="font-semibold text-muted">{h.result}</span>
                </button>
              </li>
            ))}
        </ul>
        <input
          ref={inputRef}
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              run()
            } else if (e.key === 'Escape') setExpr('')
          }}
          aria-label={t('calc.input')}
          spellCheck={false}
          autoComplete="off"
          className="w-full bg-transparent text-right font-mono text-xl text-fg-strong outline-none"
          placeholder="0"
        />
        <p className="h-4 text-right font-mono text-xs tnum text-cyan-fg">{preview && `= ${preview}`}</p>
      </div>
      <div className="mt-2 grid grid-cols-5 gap-1.5">
        {KEYS.map((k) => (
          <button
            key={k.label}
            type="button"
            onClick={() => press(k)}
            className={cn(
              'h-9 rounded-lg text-sm font-semibold transition active:scale-95',
              k.tone === 'eq'
                ? 'bg-cta text-[#04121a]'
                : k.tone === 'op'
                  ? 'bg-violet/15 text-violet-fg hover:bg-violet/25'
                  : k.tone === 'fn'
                    ? 'bg-surface-3/60 text-fg hover:bg-surface-3'
                    : 'bg-surface-2 text-fg-strong hover:bg-surface-3',
            )}
            aria-label={k.action === 'back' ? t('calc.backspace') : k.action === 'mode' ? t('calc.mode') : undefined}
          >
            {k.action === 'mode' ? (degrees ? 'DEG' : 'RAD') : k.action === 'back' ? <Delete className="mx-auto size-4" /> : k.label}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ───────────────────────── Grapher ───────────────────────── */

const PLOT_COLORS = ['#22D3EE', '#A78BFA', '#F59E0B']

function Grapher() {
  const { t } = useT()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [fns, setFns] = useState(['x^2 - 4', '2x + 1', ''])
  const [view, setView] = useState({ cx: 0, cy: 0, scale: 24 }) // px per unit
  const drag = useRef<{ x: number; y: number; cx: number; cy: number } | null>(null)

  const compiled = useMemo(
    () =>
      fns.map((src) => {
        if (!src.trim()) return null
        try {
          const f = compile(src)
          f({ x: 1 })
          return f
        } catch {
          return 'error' as const
        }
      }),
    [fns],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    const ctx = canvas.getContext('2d')!
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    const css = getComputedStyle(document.documentElement)
    const grid = css.getPropertyValue('--surface-3').trim() || '#263349'
    const axis = css.getPropertyValue('--muted').trim() || '#94a3b8'
    const bg = css.getPropertyValue('--bg').trim() || '#090d16'

    ctx.fillStyle = bg
    ctx.fillRect(0, 0, w, h)

    const { cx, cy, scale } = view
    const toX = (x: number) => w / 2 + (x - cx) * scale
    const toY = (y: number) => h / 2 - (y - cy) * scale

    // grid step adapts to zoom
    const raw = 60 / scale
    const pow = Math.pow(10, Math.floor(Math.log10(raw)))
    const step = [1, 2, 5, 10].map((m) => m * pow).find((s) => s >= raw) ?? pow * 10

    ctx.lineWidth = 1
    ctx.strokeStyle = grid
    ctx.fillStyle = axis
    ctx.font = '10px ui-sans-serif, system-ui'
    const x0 = cx - w / 2 / scale
    const x1 = cx + w / 2 / scale
    const y0 = cy - h / 2 / scale
    const y1 = cy + h / 2 / scale
    for (let gx = Math.ceil(x0 / step) * step; gx <= x1; gx += step) {
      ctx.beginPath()
      ctx.moveTo(toX(gx), 0)
      ctx.lineTo(toX(gx), h)
      ctx.stroke()
      if (Math.abs(gx) > step / 2) ctx.fillText(String(+gx.toFixed(6)), toX(gx) + 2, Math.min(h - 4, Math.max(10, toY(0) + 11)))
    }
    for (let gy = Math.ceil(y0 / step) * step; gy <= y1; gy += step) {
      ctx.beginPath()
      ctx.moveTo(0, toY(gy))
      ctx.lineTo(w, toY(gy))
      ctx.stroke()
      if (Math.abs(gy) > step / 2) ctx.fillText(String(+gy.toFixed(6)), Math.min(w - 24, Math.max(2, toX(0) + 3)), toY(gy) - 2)
    }
    ctx.strokeStyle = axis
    ctx.lineWidth = 1.4
    ctx.beginPath()
    ctx.moveTo(toX(0), 0)
    ctx.lineTo(toX(0), h)
    ctx.moveTo(0, toY(0))
    ctx.lineTo(w, toY(0))
    ctx.stroke()

    compiled.forEach((f, i) => {
      if (!f || f === 'error') return
      ctx.strokeStyle = PLOT_COLORS[i]
      ctx.lineWidth = 2.2
      ctx.beginPath()
      let pen = false
      let prevY = 0
      for (let px = 0; px <= w; px += 1) {
        const x = x0 + px / scale
        const y = f({ x, degrees: false })
        const sy = toY(y)
        // break the line on discontinuities (e.g. tan) and off-screen jumps
        if (!Number.isFinite(y) || (pen && Math.abs(sy - prevY) > h * 2)) {
          pen = false
          continue
        }
        if (pen) ctx.lineTo(px, sy)
        else ctx.moveTo(px, sy)
        pen = true
        prevY = sy
      }
      ctx.stroke()
    })
  }, [compiled, view])

  const zoom = (k: number) => setView((v) => ({ ...v, scale: Math.min(400, Math.max(2, v.scale * k)) }))

  return (
    <div>
      <div className="space-y-1.5">
        {fns.map((src, i) => (
          <label key={i} className="flex items-center gap-2 rounded-lg border border-line bg-bg/50 px-2 py-1 focus-within:border-cyan">
            <span className="size-2.5 shrink-0 rounded-full" style={{ background: PLOT_COLORS[i] }} />
            <span className="font-mono text-xs text-muted">y =</span>
            <input
              value={src}
              onChange={(e) => setFns((all) => all.map((s, j) => (j === i ? e.target.value : s)))}
              spellCheck={false}
              aria-label={t('calc.fn', { n: i + 1 })}
              placeholder={t('calc.fnPlaceholder')}
              className={cn('min-w-0 flex-1 bg-transparent font-mono text-sm text-fg-strong outline-none placeholder:text-subtle', compiled[i] === 'error' && 'text-crimson-fg')}
            />
          </label>
        ))}
      </div>
      <div className="relative mt-2 overflow-hidden rounded-xl border border-line">
        <canvas
          ref={canvasRef}
          className="block h-56 w-full cursor-grab touch-none active:cursor-grabbing"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            drag.current = { x: e.clientX, y: e.clientY, cx: view.cx, cy: view.cy }
          }}
          onPointerMove={(e) => {
            const d = drag.current
            if (!d) return
            setView((v) => ({ ...v, cx: d.cx - (e.clientX - d.x) / v.scale, cy: d.cy + (e.clientY - d.y) / v.scale }))
          }}
          onPointerUp={() => (drag.current = null)}
          onWheel={(e) => zoom(e.deltaY < 0 ? 1.15 : 1 / 1.15)}
          aria-label={t('calc.graph')}
          role="img"
        />
        <div className="absolute right-2 top-2 flex flex-col gap-1">
          {[
            { icon: Plus, label: t('calc.zoomIn'), fn: () => zoom(1.4) },
            { icon: Minus, label: t('calc.zoomOut'), fn: () => zoom(1 / 1.4) },
            { icon: RotateCcw, label: t('calc.resetView'), fn: () => setView({ cx: 0, cy: 0, scale: 24 }) },
          ].map(({ icon: Icon, label, fn }) => (
            <button key={label} type="button" onClick={fn} aria-label={label} title={label} className="grid size-7 place-items-center rounded-md border border-line bg-surface/90 text-muted hover:text-fg-strong">
              <Icon className="size-3.5" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────── Floating panel ───────────────────────── */

export function CalculatorPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useT()
  const constraints = useRef<HTMLDivElement>(null)
  const controls = useDragControls()
  // Stays mounted while hidden so history and graphs survive toggling
  return (
    <div ref={constraints} className={cn('pointer-events-none fixed inset-2 z-50 sm:inset-4', !open && 'hidden')}>
      <motion.div
        drag
        dragControls={controls}
        dragListener={false}
        dragMomentum={false}
        dragConstraints={constraints}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass pointer-events-auto absolute bottom-20 right-0 w-[min(340px,calc(100vw-1rem))] rounded-2xl bg-surface/95 p-3 shadow-2xl sm:right-2 sm:top-16 sm:bottom-auto"
        role="dialog"
        aria-label={t('calc.title')}
      >
        <div className="mb-2 flex cursor-grab touch-none items-center gap-2 active:cursor-grabbing" onPointerDown={(e) => controls.start(e)}>
          <CalcIcon className="size-4 text-cyan-fg" />
          <span className="text-sm font-bold">{t('calc.title')}</span>
          <GripHorizontal className="mx-auto size-4 text-subtle" />
          <button type="button" onClick={onClose} onPointerDown={(e) => e.stopPropagation()} className="rounded-md p-1 text-muted hover:text-fg-strong" aria-label={t('common.close')}>
            <X className="size-4" />
          </button>
        </div>
        <Tabs defaultValue="sci">
          <TabsList className="mb-2 grid w-full grid-cols-2">
            <TabsTrigger value="sci">{t('calc.scientific')}</TabsTrigger>
            <TabsTrigger value="graph">{t('calc.graphing')}</TabsTrigger>
          </TabsList>
          <TabsContent value="sci">
            <Scientific />
          </TabsContent>
          <TabsContent value="graph">
            <Grapher />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
