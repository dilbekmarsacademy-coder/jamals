import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Lang = 'uz' | 'ru' | 'en'
export const LANGS: { code: Lang; label: string; short: string }[] = [
  { code: 'uz', label: 'O‘zbekcha', short: 'UZ' },
  { code: 'ru', label: 'Русский', short: 'RU' },
  { code: 'en', label: 'English', short: 'EN' },
]

/** Localized text for content (lessons, badges, …) */
export type L10n = Record<Lang, string>

/**
 * Language lives in its own tiny store so it survives logout and is available
 * before sign-in. Uzbek is the default.
 */
export const useLangStore = create<{ lang: Lang; setLang: (l: Lang) => void }>()(
  persist((set) => ({ lang: 'uz', setLang: (lang) => set({ lang }) }), { name: 'jamals-lang' }),
)

export const getLang = (): Lang => useLangStore.getState().lang

const HTML_LANG: Record<Lang, string> = { uz: 'uz', ru: 'ru', en: 'en' }
const syncHtml = (l: Lang) => {
  if (typeof document !== 'undefined') document.documentElement.lang = HTML_LANG[l]
}
syncHtml(getLang())
useLangStore.subscribe((s) => syncHtml(s.lang))
