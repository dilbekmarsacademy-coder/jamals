export type Lang = 'uz' | 'ru' | 'en'

export const LANGS: { code: Lang; label: string; short: string }[] = [
  { code: 'uz', label: 'O‘zbekcha', short: 'UZ' },
  { code: 'ru', label: 'Русский', short: 'RU' },
  { code: 'en', label: 'English', short: 'EN' },
]

export const DEFAULT_LANG: Lang = 'uz'
export const LANG_COOKIE = 'apex-lang'
export const THEME_COOKIE = 'apex-theme'

/** Localized content string (lessons, badges, explanations, …) */
export type L10n = Record<Lang, string>

export const isLang = (v: unknown): v is Lang => v === 'uz' || v === 'ru' || v === 'en'

/** Picks a language from an Accept-Language header */
export function negotiateLang(header: string | null): Lang {
  // Uzbek-first audience: only switch when the browser explicitly prefers Russian
  const first = header?.split(',')[0]?.trim().slice(0, 2).toLowerCase()
  return first === 'ru' ? 'ru' : DEFAULT_LANG
}

/** BCP-47 tags for Intl formatters */
export const LOCALE: Record<Lang, string> = { uz: 'uz-Latn-UZ', ru: 'ru-RU', en: 'en-US' }
