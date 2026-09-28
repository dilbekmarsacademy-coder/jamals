import {
  Calculator, CalendarCheck, ClipboardCheck, Feather, Flame, Map, Medal, Moon, Rocket, Route,
  Sparkles, Sun, Sunrise, Target, Zap, type LucideIcon,
} from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  Calculator, CalendarCheck, ClipboardCheck, Feather, Flame, Map, Medal, Moon, Rocket, Route,
  Sparkles, Sun, Sunrise, Target, Zap,
}

export function BadgeIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Sparkles
  return <Icon className={className} />
}
