'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { hotelData } from '@/data/hotel'

export default function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our <span className="text-blue-600">Guests Say</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what our valued guests have to say about their experience at Hotel Ritam.
          </p>
          
          {/* Rating Summary */}
          <div className="flex items-center justify-center mt-8 space-x-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-2xl font-bold text-gray-900">{hotelData.rating}</span>
            <span className="text-gray-600">out of 5 ({hotelData.reviews.length} reviews)</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotelData.reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {/* Quote Icon */}
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Quote className="w-6 h-6 text-blue-600" />
              </div>

              {/* Rating Stars */}
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${
                      i < review.rating 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    }`} 
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {review.rating}/5
                </span>
              </div>

              {/* Review Text */}
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                &ldquo;{review.comment}&rdquo;
              </p>

              {/* Reviewer Info */}
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {review.guestName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900">{review.guestName}</h4>
                  <p className="text-sm text-gray-500">
                    {new Intl.DateTimeFormat('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }).format(review.date)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional testimonials from other sources */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
            <div className="flex items-center mb-4">
              <div className="text-3xl font-bold">4.9</div>
              <div className="ml-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-white text-white" />
                  ))}
                </div>
                <p className="text-sm text-blue-100">TripAdvisor Rating</p>
              </div>
            </div>
            <p className="text-lg font-medium">&ldquo;Certificate of Excellence&rdquo;</p>
            <p className="text-blue-100">Top 10% of hotels worldwide</p>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white">
            <div className="flex items-center mb-4">
              <div className="text-3xl font-bold">4.8</div>
              <div className="ml-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-white text-white" />
                  ))}
                </div>
                <p className="text-sm text-purple-100">Google Reviews</p>
              </div>
            </div>
            <p className="text-lg font-medium">&ldquo;Highly Rated&rdquo;</p>
            <p className="text-purple-100">Exceptional service & comfort</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
