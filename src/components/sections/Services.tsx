'use client'

import { motion } from 'framer-motion'
import { 
  Car, 
  Plane, 
  Shield, 
  Clock, 
  Shirt, 
  Baby, 
  Briefcase, 
  Heart,
  Phone,
  MapPin,
  Users,
  Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const services = [
  {
    icon: Car,
    title: "Airport Transfer",
    description: "Luxury vehicle pickup and drop-off service to and from the airport with professional chauffeurs.",
    features: ["24/7 Available", "Luxury Vehicles", "Flight Tracking", "Meet & Greet"],
    price: "From $45",
    category: "Transportation"
  },
  {
    icon: Shirt,
    title: "Laundry & Dry Cleaning",
    description: "Professional cleaning services for all your garments with same-day and express options available.",
    features: ["Same Day Service", "Eco-Friendly", "Pressing Included", "Pickup & Delivery"],
    price: "From $15",
    category: "Personal Care"
  },
  {
    icon: Heart,
    title: "Spa & Wellness",
    description: "Rejuvenating spa treatments and wellness programs designed to restore your mind, body, and spirit.",
    features: ["Couples Packages", "Aromatherapy", "Hot Stone Massage", "Wellness Consultation"],
    price: "From $120",
    category: "Wellness"
  },
  {
    icon: Baby,
    title: "Childcare Services",
    description: "Professional childcare and babysitting services so parents can enjoy worry-free leisure time.",
    features: ["Licensed Caregivers", "Activities Included", "Flexible Hours", "Age-Appropriate Care"],
    price: "From $25/hour",
    category: "Family"
  },
  {
    icon: Briefcase,
    title: "Business Services",
    description: "Complete business support including meeting rooms, secretarial services, and technical assistance.",
    features: ["Meeting Rooms", "A/V Equipment", "Printing Services", "Translation"],
    price: "From $30/hour",
    category: "Business"
  },
  {
    icon: Calendar,
    title: "Event Planning",
    description: "Professional event coordination for weddings, conferences, and special celebrations.",
    features: ["Full Planning", "Vendor Coordination", "Custom Packages", "Day-of Coordination"],
    price: "From $500",
    category: "Events"
  }
]

const additionalServices = [
  {
    icon: "🚗",
    title: "Valet Parking",
    description: "Complimentary valet service for all guests"
  },
  {
    icon: "🛎️",
    title: "24/7 Concierge",
    description: "Round-the-clock personalized assistance"
  },
  {
    icon: "🏥",
    title: "Medical Services",
    description: "On-call doctor and medical assistance"
  },
  {
    icon: "💼",
    title: "Luggage Storage",
    description: "Secure storage for early/late arrivals"
  },
  {
    icon: "🌐",
    title: "Currency Exchange",
    description: "Convenient foreign exchange services"
  },
  {
    icon: "🎫",
    title: "Tour Booking",
    description: "Local attractions and excursion booking"
  }
]

const categories = ['All', 'Transportation', 'Personal Care', 'Wellness', 'Family', 'Business', 'Events']

export default function Services() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
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
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-semibold tracking-wide uppercase mb-4 inline-block">
              🛎️ Premium Services
            </span>
          </motion.div>
          
          <h2 
            className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Hotel{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Services
            </span>
          </h2>
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Experience exceptional service with our comprehensive range of premium amenities and personalized assistance.
          </motion.p>
        </motion.div>

        {/* Main Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => {
            const IconComponent = service.icon
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
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 group border border-gray-100"
              >
                {/* Category Badge */}
                <div className="flex items-center justify-between mb-6">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                    {service.category}
                  </span>
                  <span className="text-blue-600 font-bold text-lg">{service.price}</span>
                </div>

                {/* Icon */}
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 inline-block mb-6 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      <Phone className="w-4 h-4 mr-2" />
                      Inquire
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1"
                  >
                    <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Now
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Additional Services */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-white"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Complimentary Services</h3>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Enjoy these additional services included with your stay at no extra charge
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center group cursor-pointer bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h4 className="text-xl font-bold mb-2 group-hover:text-yellow-300 transition-colors">
                  {service.title}
                </h4>
                <p className="text-blue-100 text-sm leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Service Request CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12 border border-gray-100">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Need Something Else?
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Our dedicated concierge team is available 24/7 to assist with any special requests or custom services you may need.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1"
              >
                <Button variant="outline" size="lg" className="w-full">
                  <Phone className="w-5 h-5 mr-2" />
                  Call Concierge
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1"
              >
                <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <MapPin className="w-5 h-5 mr-2" />
                  Service Request
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
