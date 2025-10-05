'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Bed, Utensils, Waves, Phone } from 'lucide-react'

const quickLinks = [
  {
    title: "Luxury Rooms",
    description: "Explore our collection of premium accommodations",
    icon: Bed,
    href: "/rooms",
    color: "from-purple-600 to-pink-600",
    bgImage: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1600"
  },
  {
    title: "World-Class Amenities", 
    description: "Discover our exceptional facilities and services",
    icon: Waves,
    href: "/amenities",
    color: "from-blue-600 to-indigo-600",
    bgImage: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1600"
  },
  {
    title: "Fine Dining",
    description: "Experience culinary excellence at our restaurants",
    icon: Utensils,
    href: "/dining",
    color: "from-orange-600 to-red-600",
    bgImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1600"
  },
  {
    title: "Contact Us",
    description: "Get in touch for reservations and inquiries",
    icon: Phone,
    href: "/contact",
    color: "from-slate-600 to-gray-600",
    bgImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600"
  }
]

export default function QuickLinks() {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, #3b82f6 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold tracking-wide uppercase mb-4 inline-block">
              🌟 Explore Hotel Ritam
            </span>
          </motion.div>
          
          <h2 
            className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Discover{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Excellence
            </span>
          </h2>
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Explore all that Hotel Ritam has to offer - from luxury accommodations to world-class dining and exceptional service.
          </motion.p>
        </motion.div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {quickLinks.map((link, index) => {
            const IconComponent = link.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.7, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                  damping: 12
                }}
                viewport={{ once: true }}
                className="group"
              >
                <Link href={link.href}>
                  <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105 cursor-pointer">
                    {/* Background Image */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={link.bgImage}
                        alt={link.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-80 group-hover:opacity-90 transition-opacity duration-300`} />
                      
                      {/* Icon */}
                      <div className="absolute top-6 left-6">
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 group-hover:bg-white/30 transition-all duration-300">
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="absolute top-6 right-6">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                          <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                        {link.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {link.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to Experience Luxury?</h3>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Book your stay at Hotel Ritam and immerse yourself in unparalleled comfort and elegance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1"
              >
                <Link href="/rooms">
                  <Button variant="outline" size="lg" className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm">
                    <Bed className="w-5 h-5 mr-2" />
                    View Rooms
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1"
              >
                <Link href="/contact">
                  <Button size="lg" className="w-full bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                    <Phone className="w-5 h-5 mr-2" />
                    Book Now
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
