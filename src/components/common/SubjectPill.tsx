import { useT } from '@/i18n'
import { BookOpen, Calculator, PenLine } from 'lucide-react'
import type { Subject } from '@/types'
import { SUBJECT_META } from '@/lib/homework'
import { Pill } from '@/components/ui/pill'
import { cn } from '@/lib/utils'

const ICONS = { Calculator, BookOpen, PenLine }

export function SubjectPill({ subject, className }: { subject: Subject; className?: string }) {
  const { t } = useT()
  const meta = SUBJECT_META[subject]
  const Icon = ICONS[meta.icon]
  return (
    <Pill className={cn(meta.className, className)}>
      <Icon className="size-3" />
      {t(`subject.${subject}`)}
    </Pill>
  )
}
