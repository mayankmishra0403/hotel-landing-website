'use client'

import { motion } from 'framer-motion'

interface PageHeaderProps {
  title: string
  subtitle: string
  badge?: string
  backgroundImage?: string
  gradientFrom?: string
  gradientTo?: string
}

export default function PageHeader({
  title,
  subtitle,
  badge,
  backgroundImage = "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070",
  gradientFrom = "from-blue-600",
  gradientTo = "to-purple-600"
}: PageHeaderProps) {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url("${backgroundImage}")` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-blue-900/40 to-purple-900/60" />
      
      {/* Animated particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100, -20],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-white max-w-4xl mx-auto"
        >
          {badge && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block"
            >
              <span className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white px-6 py-2 rounded-full text-sm font-semibold tracking-wide uppercase mb-6 inline-block`}>
                {badge}
              </span>
            </motion.div>
          )}
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {title}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl md:text-2xl lg:text-3xl text-gray-100 leading-relaxed font-light"
          >
            {subtitle}
          </motion.p>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer group"
      >
        <div className="w-8 h-12 border-2 border-white/60 rounded-full flex justify-center group-hover:border-yellow-400 transition-colors duration-300">
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-4 bg-gradient-to-b from-white to-yellow-400 rounded-full mt-2"
          />
        </div>
        <p className="text-xs text-white/60 mt-2 group-hover:text-white/80 transition-colors">Scroll to explore</p>
      </motion.div>
    </section>
  )
}
