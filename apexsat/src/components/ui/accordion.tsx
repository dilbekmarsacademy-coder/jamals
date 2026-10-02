'use client'

import * as A from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Accordion = A.Root

export function AccordionItem({ className, ...p }: A.AccordionItemProps) {
  return <A.Item className={cn('overflow-hidden rounded-xl border border-line bg-surface-2/40', className)} {...p} />
}

export function AccordionTrigger({ className, children, ...p }: A.AccordionTriggerProps) {
  return (
    <A.Header>
      <A.Trigger
        className={cn('group flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-semibold text-fg-strong hover:bg-surface-2', className)}
        {...p}
      >
        {children}
        <ChevronDown className="size-4 text-muted transition-transform group-data-[state=open]:rotate-180" />
      </A.Trigger>
    </A.Header>
  )
}

export function AccordionContent({ className, ...p }: A.AccordionContentProps) {
  return <A.Content className={cn('px-3.5 pb-3', className)} {...p} />
}
