'use client'

import { useState } from 'react'
import Image from 'next/image'

interface FallbackImageProps {
  src: string
  alt: string
  fill?: boolean
  className?: string
  width?: number
  height?: number
  priority?: boolean
  fallbackSrc?: string
}

export default function FallbackImage({ 
  src, 
  alt, 
  fill = false, 
  className = "", 
  width, 
  height, 
  priority = false,
  fallbackSrc 
}: FallbackImageProps) {
  const [imageSrc, setImageSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)

  const handleError = () => {
    // Fallback to a beautiful hotel room image from Unsplash
    const fallback = fallbackSrc || `https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop`
    setImageSrc(fallback)
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse">
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      <Image
        src={imageSrc}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={`object-cover transition-all duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
        onError={handleError}
        onLoad={handleLoad}
        priority={priority}
      />
    </div>
  )
}
