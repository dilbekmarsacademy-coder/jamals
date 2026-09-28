import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <p className="text-sm font-medium text-primary-text">404</p>
      <h1 className="mt-2 text-2xl font-semibold">Sahifa topilmadi</h1>
      <p className="mt-2 max-w-sm text-sm text-muted">Siz ochmoqchi bo‘lgan sahifa mavjud emas yoki boshqa manzilga ko‘chirilgan.</p>
      <Button asChild className="mt-6"><Link to="/">Bosh sahifaga qaytish</Link></Button>
    </div>
  )
}
