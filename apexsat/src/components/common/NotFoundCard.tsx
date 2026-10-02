'use client'

import Link from 'next/link'
import { useT } from '@/i18n'
import { Button } from '@/components/ui/button'
import { CipherSays } from '@/components/brand/Cipher'

export function NotFoundCard() {
  const { t } = useT()
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-5 py-16 text-center">
      <CipherSays mood="sad">{t('notFound.body')}</CipherSays>
      <Button asChild>
        <Link href="/dashboard">{t('notFound.cta')}</Link>
      </Button>
    </div>
  )
}
