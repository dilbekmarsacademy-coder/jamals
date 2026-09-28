import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useT } from '@/i18n'

export default function NotFoundPage() {
  const { t } = useT()
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <p className="text-sm font-medium text-primary-text">404</p>
      <h1 className="mt-2 text-2xl font-semibold">{t('notFound.title')}</h1>
      <p className="mt-2 max-w-sm text-sm text-muted">{t('notFound.body')}</p>
      <Button asChild className="mt-6"><Link to="/">{t('notFound.home')}</Link></Button>
    </div>
  )
}
