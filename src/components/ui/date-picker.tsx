import { useEffect, useMemo, useRef, useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { addDays, formatDate, formatDateLong, fromDateKey, monthName, startOfDay, toDateKey, weekdaysShort } from '@/lib/date'
import { useT } from '@/i18n'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  /** "YYYY-MM-DD" */
  value: string
  onChange: (value: string) => void
  /** Earliest selectable day, "YYYY-MM-DD" */
  min?: string
  id?: string
  placeholder?: string
  className?: string
}

const sameDay = (a: Date, b: Date) => toDateKey(a) === toDateKey(b)

/**
 * Design-system date picker (replaces the browser's native calendar).
 * Keyboard: ←↑→↓ move by day/week, PageUp/PageDown by month, Home/End week edges, Enter selects, Esc closes.
 */
export function DatePicker({ value, onChange, min, id, placeholder, className }: DatePickerProps) {
  const { t } = useT()
  const selected = value ? fromDateKey(value) : undefined
  const minDate = min ? fromDateKey(min) : undefined
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState<Date>(() => selected ?? minDate ?? startOfDay(new Date()))
  const gridRef = useRef<HTMLDivElement>(null)

  // Re-sync the focused day each time the popover opens
  useEffect(() => {
    if (open) setFocused(selected ?? minDate ?? startOfDay(new Date()))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Move DOM focus with the roving focused day
  useEffect(() => {
    if (!open) return
    const el = gridRef.current?.querySelector<HTMLButtonElement>(`[data-day="${toDateKey(focused)}"]`)
    el?.focus({ preventScroll: true })
  }, [focused, open])

  const month = new Date(focused.getFullYear(), focused.getMonth(), 1)
  const days = useMemo(() => {
    const offset = (month.getDay() + 6) % 7 // Monday-first
    const start = addDays(month, -offset)
    return Array.from({ length: 42 }, (_, i) => addDays(start, i))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month.getTime()])

  const isDisabled = (d: Date) => !!minDate && d < minDate
  const today = startOfDay(new Date())
  const shiftMonth = (n: number) => {
    const next = new Date(focused.getFullYear(), focused.getMonth() + n, Math.min(focused.getDate(), 28))
    setFocused(minDate && next < minDate ? minDate : next)
  }
  const canPrev = !minDate || new Date(month.getFullYear(), month.getMonth(), 0) >= minDate

  const select = (d: Date) => {
    if (isDisabled(d)) return
    onChange(toDateKey(d))
    setOpen(false)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const moves: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focused, -1),
      ArrowRight: () => addDays(focused, 1),
      ArrowUp: () => addDays(focused, -7),
      ArrowDown: () => addDays(focused, 7),
      Home: () => addDays(focused, -((focused.getDay() + 6) % 7)),
      End: () => addDays(focused, 6 - ((focused.getDay() + 6) % 7)),
      PageUp: () => new Date(focused.getFullYear(), focused.getMonth() - 1, focused.getDate()),
      PageDown: () => new Date(focused.getFullYear(), focused.getMonth() + 1, focused.getDate()),
    }
    if (moves[e.key]) {
      e.preventDefault()
      const next = moves[e.key]()
      if (!isDisabled(next)) setFocused(next)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      select(focused)
    }
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          id={id}
          type="button"
          className={cn(
            'flex h-10 w-full cursor-pointer items-center gap-2.5 rounded-lg border border-border-strong bg-surface px-3 text-left text-sm transition-colors hover:border-subtle',
            open && 'border-primary',
            className,
          )}
          aria-haspopup="dialog"
        >
          <CalendarDays className="size-4 shrink-0 text-muted" />
          <span className={cn('flex-1 truncate', !selected && 'text-subtle')}>{selected ? formatDateLong(selected) : (placeholder ?? t('picker.placeholder'))}</span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          collisionPadding={12}
          className="surface-raised z-50 w-[19rem] rounded-xl p-3 data-[state=open]:animate-[fadeIn_.12s_ease-out]"
          onOpenAutoFocus={(e) => {
            // Put focus on the selected (or today's) day instead of the first button, so arrows work immediately
            e.preventDefault()
            const key = toDateKey(selected ?? minDate ?? startOfDay(new Date()))
            requestAnimationFrame(() => gridRef.current?.querySelector<HTMLButtonElement>(`[data-day="${key}"]`)?.focus())
          }}
        >
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              disabled={!canPrev}
              className="grid size-8 cursor-pointer place-items-center rounded-md text-muted transition-colors hover:bg-surface-sunken hover:text-foreground disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent"
              aria-label={t('picker.prevMonth')}
            >
              <ChevronLeft className="size-4" />
            </button>
            <p className="text-sm font-semibold" aria-live="polite">
              {monthName(month.getMonth())} {month.getFullYear()}
            </p>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              className="grid size-8 cursor-pointer place-items-center rounded-md text-muted transition-colors hover:bg-surface-sunken hover:text-foreground"
              aria-label={t('picker.nextMonth')}
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 text-center text-xs font-medium text-subtle" aria-hidden>
            {weekdaysShort().map((d) => (
              <span key={d} className="py-1.5">{d}</span>
            ))}
          </div>

          <div ref={gridRef} role="grid" aria-label={t('picker.calendar')} className="grid grid-cols-7 gap-0.5" onKeyDown={onKeyDown}>
            {days.map((d) => {
              const inMonth = d.getMonth() === month.getMonth()
              const disabled = isDisabled(d)
              const isSelected = !!selected && sameDay(d, selected)
              const isToday = sameDay(d, today)
              const isFocused = sameDay(d, focused)
              return (
                <button
                  key={toDateKey(d)}
                  type="button"
                  role="gridcell"
                  data-day={toDateKey(d)}
                  tabIndex={isFocused ? 0 : -1}
                  disabled={disabled}
                  aria-selected={isSelected}
                  aria-label={formatDateLong(d)}
                  onClick={() => select(d)}
                  className={cn(
                    'relative grid h-9 cursor-pointer place-items-center rounded-md text-sm tabular-nums transition-colors',
                    inMonth ? 'text-foreground' : 'text-subtle/60',
                    !isSelected && !disabled && 'hover:bg-surface-sunken',
                    isSelected && 'bg-primary font-semibold text-white',
                    disabled && 'cursor-not-allowed text-subtle/40 line-through decoration-subtle/30',
                    isToday && !isSelected && 'font-semibold text-primary-text',
                  )}
                >
                  {d.getDate()}
                  {isToday && !isSelected && <span className="absolute bottom-1 size-1 rounded-full bg-primary" aria-hidden />}
                </button>
              )
            })}
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-border pt-2 text-xs text-muted">
            <span>{selected ? t('picker.selected', { date: formatDate(selected) }) : t('picker.none')}</span>
            <span className="hidden sm:inline">← → ↑ ↓ · Enter</span>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
