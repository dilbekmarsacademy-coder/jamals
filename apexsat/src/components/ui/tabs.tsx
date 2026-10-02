'use client'

import * as T from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

export const Tabs = T.Root
export const TabsContent = ({ className, ...p }: T.TabsContentProps) => <T.Content className={cn('outline-none', className)} {...p} />

export function TabsList({ className, ...p }: T.TabsListProps) {
  return <T.List className={cn('inline-flex items-center gap-1 rounded-xl border border-line bg-surface-2/60 p-1', className)} {...p} />
}

export function TabsTrigger({ className, ...p }: T.TabsTriggerProps) {
  return (
    <T.Trigger
      className={cn(
        'inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-muted transition',
        'hover:text-fg-strong data-[state=active]:bg-surface data-[state=active]:text-fg-strong data-[state=active]:shadow-[0_0_0_1px_var(--border)]',
        '[&_svg]:size-3.5',
        className,
      )}
      {...p}
    />
  )
}
