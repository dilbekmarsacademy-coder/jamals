'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { LANG_COOKIE, LOCALE, type L10n, type Lang } from './config'
import { formatMessage, type Params } from './format'
import { en, type MessageKey } from './dict/en'
import { uz } from './dict/uz'
import { ru } from './dict/ru'

export type { MessageKey }
export { LANGS } from './config'
export type { Lang, L10n } from './config'

const DICTS = { en, uz, ru } as const

export function translate(lang: Lang, key: MessageKey, params: Params = {}) {
  return formatMessage(DICTS[lang][key] ?? en[key], params, lang)
}

interface I18nValue {
  lang: Lang
  locale: string
  setLang: (l: Lang) => void
  t: (key: MessageKey, params?: Params) => string
  /** Pick the active language from localized content */
  tr: (text: L10n) => string
  /** Locale-aware number formatting */
  n: (value: number, opts?: Intl.NumberFormatOptions) => string
}

const I18nContext = createContext<I18nValue | null>(null)

export function I18nProvider({ initialLang, children }: { initialLang: Lang; children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    document.cookie = `${LANG_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`
    document.documentElement.lang = l
  }, [])

  const value = useMemo<I18nValue>(() => {
    const locale = LOCALE[lang]
    const nf = new Intl.NumberFormat(locale)
    return {
      lang,
      locale,
      setLang,
      t: (key, params) => translate(lang, key, params),
      tr: (text) => text[lang] ?? text.en,
      n: (value, opts) => (opts ? new Intl.NumberFormat(locale, opts).format(value) : nf.format(value)),
    }
  }, [lang, setLang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useT() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useT must be used inside <I18nProvider>')
  return ctx
}
