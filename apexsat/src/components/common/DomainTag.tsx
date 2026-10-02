'use client'

import type { Domain } from '@/types'
import { useT, type MessageKey } from '@/i18n'
import { cn } from '@/lib/utils'

export const DOMAIN_KEY: Record<Domain, MessageKey> = {
  algebra: 'domain.algebra',
  advanced_math: 'domain.advanced_math',
  craft_structure: 'domain.craft_structure',
  expression_ideas: 'domain.expression_ideas',
}

export const DOMAIN_TONE: Record<Domain, string> = {
  algebra: 'text-cyan-fg bg-cyan/10 border-cyan/25',
  advanced_math: 'text-violet-fg bg-violet/10 border-violet/30',
  craft_structure: 'text-gold-fg bg-gold/10 border-gold/30',
  expression_ideas: 'text-emerald-fg bg-emerald/10 border-emerald/30',
}

export const DOMAIN_HEX: Record<Domain, string> = {
  algebra: 'var(--cyan)',
  advanced_math: 'var(--violet)',
  craft_structure: 'var(--gold)',
  expression_ideas: 'var(--emerald)',
}

export function DomainTag({ domain, className }: { domain: Domain; className?: string }) {
  const { t } = useT()
  return <span className={cn('inline-flex items-center rounded-md border px-1.5 py-0.5 text-[11px] font-semibold', DOMAIN_TONE[domain], className)}>{t(DOMAIN_KEY[domain])}</span>
}
