'use client'

import { motion } from 'framer-motion'
import { 
  Wifi, 
  Car, 
  Waves, 
  Dumbbell, 
  Utensils, 
  Coffee,
  Phone,
  Shield,
  Briefcase,
  Plane
} from 'lucide-react'

const amenities = [
  {
    icon: Wifi,
    title: "Free WiFi",
    description: "High-speed internet access throughout the hotel"
  },
  {
    icon: Waves,
    title: "Swimming Pool",
    description: "Outdoor heated pool with stunning city views"
  },
  {
    icon: Dumbbell,
    title: "Fitness Center",
    description: "State-of-the-art equipment available 24/7"
  },
  {
    icon: Utensils,
    title: "Fine Dining",
    description: "Award-winning restaurant with international cuisine"
  },
  {
    icon: Coffee,
    title: "Coffee Lounge",
    description: "Premium coffee and light refreshments"
  },
  {
    icon: Phone,
    title: "24/7 Room Service",
    description: "Round-the-clock dining and assistance"
  },
  {
    icon: Car,
    title: "Valet Parking",
    description: "Secure parking with professional valet service"
  },
  {
    icon: Shield,
    title: "Concierge Service",
    description: "Personal assistance for all your needs"
  },
  {
    icon: Briefcase,
    title: "Business Center",
    description: "Meeting rooms and office facilities"
  },
  {
    icon: Plane,
    title: "Airport Shuttle",
    description: "Complimentary transportation service"
  }
]

export default function Amenities() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            World-Class <span className="text-blue-600">Amenities</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience unparalleled comfort with our comprehensive range of luxury amenities 
            designed to make your stay truly exceptional.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {amenities.map((amenity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -15, 
                scale: 1.05,
                rotateY: 5
              }}
              className="text-center p-8 rounded-2xl bg-gradient-to-br from-white via-gray-50 to-white border border-gray-200 hover:border-purple-200 shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer relative overflow-hidden"
            >
              {/* Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Icon Container */}
              <motion.div 
                className="relative w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl"
                whileHover={{ 
                  rotate: [0, -10, 10, 0],
                  scale: 1.1
                }}
                transition={{ 
                  rotate: { duration: 0.6 },
                  scale: { duration: 0.3 }
                }}
              >
                <amenity.icon className="w-10 h-10 text-white" />
                
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10" />
              </motion.div>
              
              <div className="relative">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                  {amenity.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {amenity.description}
                </p>
              </div>

              {/* Shine Effect */}
              <div className="absolute top-0 -left-full h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000" />
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Experience Luxury?
          </h3>
          <p className="text-lg mb-6 text-blue-100">
            Book your stay today and enjoy all our premium amenities
          </p>
          <button className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
            Book Your Stay
          </button>
        </motion.div>
      </div>
    </section>
  )
}
