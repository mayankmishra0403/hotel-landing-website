'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Users, Star, ChefHat, Wine, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

const restaurants = [
  {
    id: 1,
    name: "Azure Restaurant",
    cuisine: "International Fine Dining",
    description: "Indulge in culinary excellence with our award-winning chef's internationally inspired menu, featuring the finest ingredients and innovative cooking techniques.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070",
    rating: 4.9,
    reviews: 284,
    priceRange: "$$$",
    hours: "6:00 PM - 11:00 PM",
    capacity: "80 guests",
    features: ["Michelin Recommended", "Wine Pairing", "Chef's Table", "Private Dining"],
    signature: "Wagyu Beef Tenderloin with Truffle Risotto"
  },
  {
    id: 2,
    name: "Oceanview Terrace",
    cuisine: "Mediterranean & Seafood",
    description: "Experience fresh seafood and Mediterranean flavors while enjoying breathtaking ocean views from our elegant terrace setting.",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2070",
    rating: 4.8,
    reviews: 156,
    priceRange: "$$",
    hours: "12:00 PM - 10:00 PM",
    capacity: "120 guests",
    features: ["Outdoor Seating", "Ocean View", "Fresh Seafood", "Sunset Dining"],
    signature: "Grilled Mediterranean Sea Bass with Lemon Herbs"
  },
  {
    id: 3,
    name: "Ritam Lounge & Bar",
    cuisine: "Cocktails & Light Bites",
    description: "Unwind in our sophisticated lounge with handcrafted cocktails, premium spirits, and carefully curated small plates in an intimate setting.",
    image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?q=80&w=2070",
    rating: 4.7,
    reviews: 198,
    priceRange: "$$",
    hours: "5:00 PM - 2:00 AM",
    capacity: "60 guests",
    features: ["Craft Cocktails", "Live Music", "Premium Spirits", "Late Night Menu"],
    signature: "Signature Ritam Martini with Gold Flakes"
  }
]

const diningExperiences = [
  {
    icon: "🍷",
    title: "Wine Tasting",
    description: "Curated selection of world-class wines"
  },
  {
    icon: "👨‍🍳",
    title: "Chef's Table",
    description: "Exclusive dining experience with our head chef"
  },
  {
    icon: "🌅",
    title: "Breakfast Buffet",
    description: "International breakfast buffet daily"
  },
  {
    icon: "🥂",
    title: "Private Events",
    description: "Customized dining for special occasions"
  }
]

export default function Dining() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(0)

  return (
    <section className="py-24 bg-gradient-to-br from-amber-50 via-white to-orange-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 30px 30px, #f59e0b 2px, transparent 0)`,
          backgroundSize: '60px 60px'
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
            <span className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-2 rounded-full text-sm font-semibold tracking-wide uppercase mb-4 inline-block">
              🍽️ Culinary Excellence
            </span>
          </motion.div>
          
          <h2 
            className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Dining &{' '}
            <span className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
              Restaurants
            </span>
          </h2>
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Embark on a culinary journey with our world-class restaurants, featuring award-winning chefs and exceptional dining experiences.
          </motion.p>
        </motion.div>

        {/* Restaurant Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {restaurants.map((restaurant, index) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.7, 
                delay: index * 0.2,
                type: "spring",
                stiffness: 100,
                damping: 12
              }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group"
            >
              {/* Restaurant Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Price Range Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-gray-800 font-semibold text-sm">{restaurant.priceRange}</span>
                </div>

                {/* Rating */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className="bg-yellow-500 rounded-full p-1">
                    <Star className="w-4 h-4 text-white fill-current" />
                  </div>
                  <span className="text-white font-semibold">{restaurant.rating}</span>
                  <span className="text-white/80 text-sm">({restaurant.reviews})</span>
                </div>
              </div>

              {/* Restaurant Info */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <ChefHat className="w-5 h-5 text-orange-600" />
                  <h3 className="text-2xl font-bold text-gray-900">{restaurant.name}</h3>
                </div>
                
                <p className="text-orange-600 font-semibold mb-3">{restaurant.cuisine}</p>
                
                <p className="text-gray-600 mb-4 leading-relaxed">{restaurant.description}</p>

                {/* Restaurant Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{restaurant.hours}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{restaurant.capacity}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {restaurant.features.slice(0, 2).map((feature, idx) => (
                    <span
                      key={idx}
                      className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Signature Dish */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-3 mb-4">
                  <p className="text-xs text-orange-600 font-semibold mb-1">SIGNATURE DISH</p>
                  <p className="text-sm text-gray-700 font-medium">{restaurant.signature}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full">
                      <MapPin className="w-4 h-4 mr-2" />
                      View Menu
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1"
                  >
                    <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                      <Wine className="w-4 h-4 mr-2" />
                      Reserve Table
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dining Experiences */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl p-8 md:p-12 text-white"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Exclusive Dining Experiences</h3>
            <p className="text-orange-100 text-lg max-w-2xl mx-auto">
              Elevate your culinary journey with our specially curated dining experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {diningExperiences.map((experience, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center group cursor-pointer"
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {experience.icon}
                </div>
                <h4 className="text-xl font-bold mb-2 group-hover:text-yellow-300 transition-colors">
                  {experience.title}
                </h4>
                <p className="text-orange-100 text-sm leading-relaxed">
                  {experience.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                size="xl" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm rounded-xl font-semibold px-8 py-4 text-lg"
              >
                <ChefHat className="w-5 h-5 mr-2" />
                Book Dining Experience
                <span className="ml-2">→</span>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
