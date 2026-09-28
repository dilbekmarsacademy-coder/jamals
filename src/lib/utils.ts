import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const uid = () => Math.random().toString(36).slice(2, 10)

export const formatNumber = (n: number) => new Intl.NumberFormat('uz-UZ').format(n).replace(/,/g, ' ')

export const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n))

export const pluralDays = (n: number) => `${n} kun`
