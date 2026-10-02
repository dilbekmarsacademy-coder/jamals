import type { Lang } from './config'

/**
 * A message is either a plain string with {param} placeholders or a plural
 * map selected by `params.count` using Intl.PluralRules.
 */
export type Message = string | ({ other: string } & Partial<Record<Intl.LDMLPluralRule, string>>)
export type Params = Record<string, string | number>

const rules = new Map<Lang, Intl.PluralRules>()
const pluralRules = (lang: Lang) => {
  let r = rules.get(lang)
  if (!r) {
    r = new Intl.PluralRules(lang)
    rules.set(lang, r)
  }
  return r
}

export function formatMessage(msg: Message, params: Params, lang: Lang): string {
  let template: string
  if (typeof msg === 'string') template = msg
  else {
    const n = Number(params.count ?? 0)
    template = msg[pluralRules(lang).select(n)] ?? msg.other
  }
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(params[k] ?? `{${k}}`))
}
