'use client'

import { Download, ExternalLink, FileText, Sheet } from 'lucide-react'
import type { Lesson } from '@/types'
import { useT } from '@/i18n'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

function download(filename: string, body: string) {
  const url = URL.createObjectURL(new Blob([body], { type: 'text/plain;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export function ResourcesPanel({ lesson }: { lesson: Lesson }) {
  const { t, tr } = useT()
  return (
    <div className="space-y-5">
      <section>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-subtle">{t('resources.downloads')}</h3>
        <ul className="space-y-2">
          {lesson.resources.map((r) => {
            const Icon = r.kind === 'link' ? ExternalLink : r.kind === 'sheet' ? Sheet : FileText
            const inner = (
              <>
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-violet/12 text-violet-fg">
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-fg-strong">{tr(r.title)}</span>
                  <span className="text-xs text-muted">{r.kind === 'link' ? t('resources.external') : `${t(r.kind === 'sheet' ? 'resources.worksheet' : 'resources.cheatSheet')} · ${r.size}`}</span>
                </span>
                {r.kind === 'link' ? <ExternalLink className="size-4 text-muted" /> : <Download className="size-4 text-cyan-fg" />}
              </>
            )
            const cls = 'flex w-full items-center gap-3 rounded-xl border border-line bg-surface-2/30 p-2.5 text-left transition hover:border-cyan/40 hover:bg-surface-2'
            return (
              <li key={r.id}>
                {r.kind === 'link' ? (
                  <a href={r.url} target="_blank" rel="noreferrer" className={cls}>
                    {inner}
                  </a>
                ) : (
                  <button type="button" className={cls} onClick={() => download(`apexsat-${slug(r.title.en)}.txt`, r.body ?? '')}>
                    {inner}
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      </section>
      <section>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-subtle">{t('resources.formulas')}</h3>
        <Accordion type="multiple" defaultValue={[lesson.formulas[0]?.id]} className="space-y-2">
          {lesson.formulas.map((g) => (
            <AccordionItem key={g.id} value={g.id}>
              <AccordionTrigger>{tr(g.title)}</AccordionTrigger>
              <AccordionContent>
                <dl className="space-y-2">
                  {g.items.map((it) => (
                    <div key={it.formula} className="rounded-lg bg-surface/70 px-3 py-2">
                      <dt className="text-[11px] font-semibold uppercase tracking-wide text-subtle">{tr(it.label)}</dt>
                      <dd className="mt-0.5 font-serif text-[15px] text-fg-strong">{it.formula}</dd>
                    </div>
                  ))}
                </dl>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  )
}
