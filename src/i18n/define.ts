export type Params = Record<string, string | number>
export type Entry = string | ((p: Params) => string)

/** One feature's strings in all three languages; ru/en must cover every uz key */
export function defineDict<T extends Record<string, Entry>>(d: {
  uz: T
  ru: { [K in keyof T]: Entry }
  en: { [K in keyof T]: Entry }
}) {
  return d
}

/** Russian plural: 1 день, 2 дня, 5 дней */
export const ruPlural = (n: number, one: string, few: string, many: string) => {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return one
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few
  return many
}

/** English plural: 1 day, 2 days */
export const enPlural = (n: number, one: string, many: string) => (n === 1 ? one : many)
