import { Metadata } from 'next'
import PageHeader from '@/components/ui/PageHeader'
import Amenities from '@/components/sections/Amenities'
import Services from '@/components/sections/Services'

export const metadata: Metadata = {
  title: 'Amenities & Services | Hotel Ritam',
  description: 'Explore our world-class amenities and premium services designed to make your stay unforgettable.',
}

export default function AmenitiesPage() {
  return (
    <main>
      <PageHeader
        title="Amenities & Services"
        subtitle="Experience unparalleled comfort with our comprehensive range of luxury amenities and personalized services designed to exceed your expectations."
        badge="🏊 World-Class Facilities"
        backgroundImage="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070"
        gradientFrom="from-blue-600"
        gradientTo="to-indigo-600"
      />
      <Amenities />
      <Services />
    </main>
  )
}
