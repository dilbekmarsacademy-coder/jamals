import { useLangStore, getLang, type Lang, type L10n } from './lang'
import type { Entry, Params } from './define'
import { common } from './dict/common'
import { pages } from './dict/pages'

export { useLangStore, getLang, LANGS } from './lang'
export type { Lang, L10n } from './lang'

const DICTS = [common, pages] as const

type UzOf<D> = D extends { uz: infer U } ? U : never
type Merge<T extends readonly unknown[]> = T extends readonly [infer H, ...infer R] ? UzOf<H> & Merge<R> : unknown
export type TKey = keyof Merge<typeof DICTS> & string

const TABLE = Object.fromEntries(
  (['uz', 'ru', 'en'] as Lang[]).map((l) => [l, Object.assign({}, ...DICTS.map((d) => d[l])) as Record<string, Entry>]),
) as Record<Lang, Record<string, Entry>>

/** Translate a key in the current (or given) language. Falls back to Uzbek, then the key itself. */
export function t(key: TKey, params: Params = {}, lang: Lang = getLang()): string {
  const entry = TABLE[lang][key] ?? TABLE.uz[key]
  if (entry === undefined) return key
  return typeof entry === 'function' ? entry(params) : entry.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? `{${k}}`))
}

/** Pick the current language's variant of localized content */
export const tr = (text: L10n, lang: Lang = getLang()) => text[lang] ?? text.uz

/**
 * Hook: subscribes the component to language changes and returns bound helpers.
 * Any component that renders text should call this so it re-renders on switch.
 */
export function useT() {
  const lang = useLangStore((s) => s.lang)
  return {
    lang,
    t: (key: TKey, params?: Params) => t(key, params, lang),
    tr: (text: L10n) => tr(text, lang),
  }
}
