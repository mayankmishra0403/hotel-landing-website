import { Metadata } from 'next'
import PageHeader from '@/components/ui/PageHeader'
import Dining from '@/components/sections/Dining'

export const metadata: Metadata = {
  title: 'Dining & Restaurants | Hotel Ritam',
  description: 'Experience culinary excellence at our award-winning restaurants featuring world-class chefs and exceptional dining.',
}

export default function DiningPage() {
  return (
    <main>
      <PageHeader
        title="Dining & Restaurants"
        subtitle="Embark on a culinary journey with our world-class restaurants, featuring award-winning chefs and exceptional dining experiences that will tantalize your senses."
        badge="🍽️ Culinary Excellence"
        backgroundImage="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070"
        gradientFrom="from-orange-600"
        gradientTo="to-red-600"
      />
      <Dining />
    </main>
  )
}
