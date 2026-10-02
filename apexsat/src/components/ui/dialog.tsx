'use client'

import * as React from 'react'
import * as D from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Dialog = D.Root
export const DialogTrigger = D.Trigger
export const DialogClose = D.Close
export const DialogTitle = ({ className, ...p }: D.DialogTitleProps) => <D.Title className={cn('text-lg font-bold text-fg-strong', className)} {...p} />
export const DialogDescription = ({ className, ...p }: D.DialogDescriptionProps) => <D.Description className={cn('text-sm text-muted', className)} {...p} />

export function DialogContent({
  className,
  children,
  closeLabel,
  hideClose,
  ...props
}: D.DialogContentProps & { closeLabel?: string; hideClose?: boolean }) {
  return (
    <D.Portal>
      <D.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
      <D.Content
        className={cn(
          'glass fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl p-6 shadow-2xl outline-none scrollbar-thin',
          'bg-surface',
          className,
        )}
        {...props}
      >
        {children}
        {!hideClose && (
          <D.Close className="absolute right-3 top-3 rounded-lg p-1.5 text-muted transition hover:bg-surface-2 hover:text-fg-strong" aria-label={closeLabel ?? 'Close'}>
            <X className="size-4" />
          </D.Close>
        )}
      </D.Content>
    </D.Portal>
  )
}

/** Side drawer built on the same primitive (mobile navigation) */
export function SheetContent({ className, children, side = 'left', ...props }: D.DialogContentProps & { side?: 'left' | 'right' }) {
  return (
    <D.Portal>
      <D.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
      <D.Content
        className={cn(
          'fixed inset-y-0 z-50 flex w-[min(20rem,86vw)] flex-col border-line bg-bg-elev shadow-2xl outline-none',
          side === 'left' ? 'left-0 border-r' : 'right-0 border-l',
          className,
        )}
        {...props}
      >
        {children}
      </D.Content>
    </D.Portal>
  )
}
