import { Metadata } from 'next'
import PageHeader from '@/components/ui/PageHeader'
import Contact from '@/components/sections/Contact'

export const metadata: Metadata = {
  title: 'Contact Us | Hotel Ritam',
  description: 'Get in touch with Hotel Ritam for reservations, inquiries, or any assistance you need. We are here 24/7.',
}

export default function ContactPage() {
  return (
    <main>
      <PageHeader
        title="Contact Us"
        subtitle="We're here to make your experience exceptional. Reach out to us for reservations, inquiries, or any assistance you need. Our dedicated team is available 24/7."
        badge="📞 Get In Touch"
        backgroundImage="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070"
        gradientFrom="from-slate-600"
        gradientTo="to-gray-600"
      />
      <Contact />
    </main>
  )
}
