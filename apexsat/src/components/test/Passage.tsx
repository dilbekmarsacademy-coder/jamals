'use client'

import { useMemo, useRef, useState } from 'react'
import { Highlighter, Strikethrough, Eraser } from 'lucide-react'
import type { Annotation } from '@/types'
import { useT } from '@/i18n'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/** Character offset of a DOM point inside the passage (each segment span holds one text node) */
function offsetOf(node: Node, offset: number): number | null {
  const el = (node.nodeType === Node.TEXT_NODE ? node.parentElement : (node as Element))?.closest<HTMLElement>('[data-off]')
  if (!el) return null
  return Number(el.dataset.off) + (node.nodeType === Node.TEXT_NODE ? offset : 0)
}

function segments(text: string, list: Annotation[]) {
  const cuts = new Set([0, text.length])
  for (const a of list) {
    cuts.add(a.start)
    cuts.add(a.end)
  }
  const points = [...cuts].sort((a, b) => a - b)
  const out: { start: number; end: number; ann?: Annotation }[] = []
  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i]
    const end = points[i + 1]
    out.push({ start, end, ann: list.find((a) => a.start <= start && a.end >= end) })
  }
  return out
}

/**
 * SAT-style passage with highlight and strikethrough. Select text to get a
 * mini toolbar; click an existing mark to remove it.
 */
export function Passage({ text, annotations, onChange }: { text: string; annotations: Annotation[]; onChange: (list: Annotation[]) => void }) {
  const { t } = useT()
  const ref = useRef<HTMLDivElement>(null)
  const [pending, setPending] = useState<{ start: number; end: number; x: number; y: number } | null>(null)
  const segs = useMemo(() => segments(text, annotations), [text, annotations])

  const captureSelection = () => {
    const sel = window.getSelection()
    if (!sel || sel.isCollapsed || !ref.current) return setPending(null)
    const range = sel.getRangeAt(0)
    if (!ref.current.contains(range.commonAncestorContainer)) return setPending(null)
    const a = offsetOf(range.startContainer, range.startOffset)
    const b = offsetOf(range.endContainer, range.endOffset)
    if (a === null || b === null || a === b) return setPending(null)
    const rect = range.getBoundingClientRect()
    const box = ref.current.getBoundingClientRect()
    setPending({ start: Math.min(a, b), end: Math.max(a, b), x: rect.left + rect.width / 2 - box.left, y: rect.top - box.top })
  }

  const apply = (kind: Annotation['kind']) => {
    if (!pending) return
    const kept = annotations.filter((a) => a.end <= pending.start || a.start >= pending.end)
    onChange([...kept, { start: pending.start, end: pending.end, kind }].sort((x, y) => x.start - y.start))
    setPending(null)
    window.getSelection()?.removeAllRanges()
  }

  return (
    <div className="relative">
      <div className="mb-3 flex items-center gap-2 text-[11px] text-subtle">
        <Highlighter className="size-3.5" />
        <span>{t('test.annotateHint')}</span>
        {annotations.length > 0 && (
          <button type="button" onClick={() => onChange([])} className="ml-auto inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-semibold text-muted hover:bg-surface-2 hover:text-fg-strong">
            <Eraser className="size-3.5" />
            {t('test.clearMarks')}
          </button>
        )}
      </div>
      <div
        ref={ref}
        onMouseUp={captureSelection}
        onTouchEnd={() => setTimeout(captureSelection, 0)}
        onKeyUp={captureSelection}
        className="whitespace-pre-line font-serif text-[17px] leading-[1.8] text-fg-strong selection:bg-gold/40"
      >
        {segs.map((s) => (
          <span
            key={s.start}
            data-off={s.start}
            className={cn(s.ann?.kind === 'hl' && 'mark-hl', s.ann?.kind === 'strike' && 'mark-strike')}
            onClick={s.ann ? () => onChange(annotations.filter((a) => a !== s.ann)) : undefined}
            title={s.ann ? t('test.removeMark') : undefined}
          >
            {text.slice(s.start, s.end)}
          </span>
        ))}
      </div>
      {pending && (
        <div className="absolute z-20 flex -translate-x-1/2 -translate-y-full gap-1 rounded-xl border border-line bg-surface p-1 shadow-xl" style={{ left: pending.x, top: pending.y - 6 }}>
          <Button size="sm" variant="ghost" onMouseDown={(e) => e.preventDefault()} onClick={() => apply('hl')}>
            <Highlighter className="text-gold-fg" />
            {t('test.highlight')}
          </Button>
          <Button size="sm" variant="ghost" onMouseDown={(e) => e.preventDefault()} onClick={() => apply('strike')}>
            <Strikethrough className="text-crimson-fg" />
            {t('test.strike')}
          </Button>
        </div>
      )}
    </div>
  )
}
