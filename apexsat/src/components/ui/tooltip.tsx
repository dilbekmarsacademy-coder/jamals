'use client'

import * as T from '@radix-ui/react-tooltip'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export const TooltipProvider = T.Provider

export function Tooltip({ content, children, side = 'top', className }: { content: ReactNode; children: ReactNode; side?: T.TooltipContentProps['side']; className?: string }) {
  return (
    <T.Root>
      <T.Trigger asChild>{children}</T.Trigger>
      <T.Portal>
        <T.Content
          side={side}
          sideOffset={6}
          className={cn('z-[60] max-w-64 rounded-lg border border-line bg-surface-2 px-2.5 py-1.5 text-xs text-fg shadow-xl', className)}
        >
          {content}
        </T.Content>
      </T.Portal>
    </T.Root>
  )
}
