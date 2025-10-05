import { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, TextInput, ImageBackground, StyleSheet, Dimensions } from 'react-native'
import { Link } from 'expo-router'

const { width, height } = Dimensions.get('window')

// Exact same data as the Next.js website
const backgroundImages = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070', 
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2070',
]

// Featured rooms data matching website
const featuredRooms = [
  {
    id: "presidential-suite",
    name: "Presidential Suite",
    price: 899,
    originalPrice: 1200,
    capacity: 4,
    size: "120 sqm",
    beds: "1 King Bed + Sofa Bed",
    amenities: ["Ocean View", "Private Balcony", "Butler Service", "Jacuzzi"],
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600",
    rating: 4.9,
    reviews: 287
  },
  {
    id: "deluxe-ocean-view",
    name: "Deluxe Ocean View",
    price: 449,
    originalPrice: 599,
    capacity: 2,
    size: "65 sqm",
    beds: "1 King Bed",
    amenities: ["Ocean View", "Private Balcony", "Mini Bar", "Spa Bath"],
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1600",
    rating: 4.8,
    reviews: 156
  },
  {
    id: "executive-suite",
    name: "Executive Suite",
    price: 649,
    originalPrice: 799,
    capacity: 3,
    size: "85 sqm",
    beds: "1 King Bed + Daybed",
    amenities: ["City View", "Work Desk", "Mini Kitchen", "Living Area"],
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1600",
    rating: 4.7,
    reviews: 203
  }
]

// Amenities data matching website
const amenities = [
  { icon: "📶", name: "Free WiFi", desc: "High-speed internet throughout the hotel" },
  { icon: "🏊", name: "Swimming Pool", desc: "Outdoor heated pool with city views" },
  { icon: "🏋️", name: "Fitness Center", desc: "24/7 state-of-the-art equipment" },
  { icon: "🍽️", name: "Fine Dining", desc: "Award-winning international cuisine" },
  { icon: "🚗", name: "Valet Parking", desc: "Complimentary parking service" },
  { icon: "🛎️", name: "Concierge", desc: "24/7 personalized assistance" },
  { icon: "🧖‍♀️", name: "Spa & Wellness", desc: "Full-service luxury spa" },
  { icon: "👔", name: "Business Center", desc: "Meeting rooms and business services" }
]

// Testimonials data matching website  
const testimonials = [
  {
    name: "Sarah Johnson",
    rating: 5,
    comment: "Absolutely wonderful stay! The staff was incredibly friendly and the room was spotless. The ocean view was breathtaking.",
    initials: "SJ",
    location: "New York, USA"
  },
  {
    name: "Michael Chen", 
    rating: 5,
    comment: "Perfect for a business trip. The business center and WiFi were excellent. The concierge service was outstanding.",
    initials: "MC",
    location: "Toronto, Canada"
  },
  {
    name: "Emma Davis",
    rating: 4,
    comment: "Great location and excellent amenities. The breakfast was delicious and the spa was very relaxing!",
    initials: "ED",
    location: "London, UK"
  }
]

export default function HomeScreen() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState('2')

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Enhanced Header - Exactly matching Next.js website */}
      <View style={styles.header}>
        {/* Top Bar - Enhanced with gradient */}
        <View style={styles.topBar}>
          <View style={styles.topBarContent}>
            <TouchableOpacity style={styles.contactItem}>
              <Text style={styles.contactIcon}>📞</Text>
              <Text style={styles.contactText}>+1 (555) 123-4567</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactItem}>
              <Text style={styles.contactIcon}>✉️</Text>
              <Text style={styles.contactText}>info@hotelritam.com</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.locationItem}>
            <Text style={styles.contactIcon}>📍</Text>
            <Text style={styles.contactText}>123 Luxury Avenue, Downtown</Text>
          </TouchableOpacity>
        </View>
        
        {/* Main Header - Enhanced with glassmorphism */}
        <View style={styles.mainHeader}>
          <TouchableOpacity style={styles.logoContainer}>
            <Text style={styles.logo}>Hotel </Text>
            <Text style={styles.logoGradient}>Ritam</Text>
          </TouchableOpacity>
          <View style={styles.nav}>
            <TouchableOpacity style={styles.navButton}>
              <Text style={styles.navItem}>Home</Text>
            </TouchableOpacity>
            <Link href="/rooms" asChild>
              <TouchableOpacity style={styles.navButton}>
                <Text style={styles.navItem}>Rooms</Text>
              </TouchableOpacity>
            </Link>
            <TouchableOpacity style={styles.navButton}>
              <Text style={styles.navItem}>Amenities</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton}>
              <Text style={styles.navItem}>Contact</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Hero Section - Same as website */}
      <ImageBackground 
        source={{ uri: backgroundImages[currentImageIndex] }}
        style={styles.hero}
        imageStyle={styles.heroImage}
      >
        <View style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>⭐ 5-Star Luxury Hotel ⭐⭐⭐⭐⭐</Text>
          </View>
          
          <Text style={styles.heroTitle}>Welcome to</Text>
          <Text style={styles.heroTitleGradient}>Hotel Ritam</Text>
          
          <Text style={styles.heroSubtitle}>
            Experience unparalleled luxury and comfort in the heart of the city.{'\n'}
            Where every moment becomes an <Text style={styles.highlight}>unforgettable memory</Text>.
          </Text>

          {/* Booking Form - Same as website */}
          <View style={styles.bookingForm}>
            <Text style={styles.formTitle}>Find Your Perfect Stay</Text>
            <Text style={styles.formSubtitle}>Book your luxury experience today</Text>
            
            <View style={styles.formRow}>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Check In</Text>
                <TextInput 
                  style={styles.formInput}
                  placeholder="dd/mm/yyyy"
                  placeholderTextColor="#9ca3af"
                  value={checkIn}
                  onChangeText={setCheckIn}
                />
              </View>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Check Out</Text>
                <TextInput 
                  style={styles.formInput}
                  placeholder="dd/mm/yyyy"
                  placeholderTextColor="#9ca3af"
                  value={checkOut}
                  onChangeText={setCheckOut}
                />
              </View>
            </View>
            
            <View style={styles.formRow}>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Guests</Text>
                <TextInput 
                  style={styles.formInput}
                  placeholder="2 Guests"
                  placeholderTextColor="#9ca3af"
                  value={guests}
                  onChangeText={setGuests}
                />
              </View>
              <TouchableOpacity style={styles.searchButton}>
                <Text style={styles.searchButtonText}>🔍 Search Luxury Rooms</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* CTA Buttons */}
          <View style={styles.ctaButtons}>
            <Link href="/rooms" asChild>
              <TouchableOpacity style={styles.ctaButtonOutline}>
                <Text style={styles.ctaButtonOutlineText}>Explore Our Rooms</Text>
              </TouchableOpacity>
            </Link>
            <TouchableOpacity style={styles.ctaButtonFilled}>
              <Text style={styles.ctaButtonFilledText}>Special Offers</Text>
            </TouchableOpacity>
          </View>

          {/* Trust Indicators */}
          <View style={styles.trustIndicators}>
            <Text style={styles.trustItem}>🏆 Award Winning</Text>
            <Text style={styles.trustItem}>⭐ 4.9/5 Rating</Text>
            <Text style={styles.trustItem}>👥 10,000+ Happy Guests</Text>
          </View>
        </View>
      </ImageBackground>

      {/* Featured Rooms - Same as website */}
      <View style={styles.section}>
        <Text style={styles.sectionBadge}>✨ Luxury Accommodations</Text>
        <Text style={styles.sectionTitle}>Featured Rooms & Suites</Text>
        <Text style={styles.sectionSubtitle}>
          Discover our carefully curated selection of luxury accommodations
        </Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roomsScroll}>
          {featuredRooms.map((room) => (
            <View key={room.id} style={styles.roomCard}>
              <ImageBackground source={{ uri: room.image }} style={styles.roomImage}>
                <View style={styles.roomBadge}>
                  <Text style={styles.roomBadgeText}>✨ Available</Text>
                </View>
                <View style={styles.roomPrice}>
                  <Text style={styles.roomPriceText}>${room.price}/night</Text>
                </View>
              </ImageBackground>
              <View style={styles.roomInfo}>
                <Text style={styles.roomName}>{room.name}</Text>
                <Text style={styles.roomCapacity}>Up to {room.capacity} guests</Text>
                <View style={styles.roomButtons}>
                  <TouchableOpacity style={styles.roomButtonOutline}>
                    <Text style={styles.roomButtonOutlineText}>👁️ View Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.roomButtonFilled}>
                    <Text style={styles.roomButtonFilledText}>Book Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        <Link href="/rooms" asChild>
          <TouchableOpacity style={styles.exploreButton}>
            <Text style={styles.exploreButtonText}>🏨 Explore All Rooms →</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Amenities - Same as website */}
      <View style={[styles.section, styles.amenitiesSection]}>
        <Text style={styles.sectionTitle}>World-Class Amenities</Text>
        <Text style={styles.sectionSubtitle}>
          Experience unparalleled comfort with our comprehensive range of luxury amenities
        </Text>
        
        <View style={styles.amenitiesGrid}>
          {amenities.map((amenity, index) => (
            <View key={index} style={styles.amenityCard}>
              <Text style={styles.amenityIcon}>{amenity.icon}</Text>
              <Text style={styles.amenityName}>{amenity.name}</Text>
              <Text style={styles.amenityDesc}>{amenity.desc}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.bookStayButton}>
          <Text style={styles.bookStayButtonText}>Book Your Stay</Text>
        </TouchableOpacity>
      </View>

      {/* Testimonials - Same as website */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What Our Guests Say</Text>
        <Text style={styles.sectionSubtitle}>
          Don't just take our word for it. Here's what our valued guests have to say
        </Text>
        
        <View style={styles.rating}>
          <Text style={styles.ratingNumber}>4.8</Text>
          <Text style={styles.ratingText}>out of 5 (3 reviews)</Text>
        </View>

        {testimonials.map((testimonial, index) => (
          <View key={index} style={styles.testimonialCard}>
            <View style={styles.testimonialHeader}>
              <View style={styles.testimonialAvatar}>
                <Text style={styles.testimonialInitials}>{testimonial.initials}</Text>
              </View>
              <View style={styles.testimonialInfo}>
                <Text style={styles.testimonialName}>{testimonial.name}</Text>
                <Text style={styles.testimonialStars}>{testimonial.rating === 5 ? '⭐⭐⭐⭐⭐' : testimonial.rating === 4 ? '⭐⭐⭐⭐' : '⭐⭐⭐'}</Text>
              </View>
            </View>
            <Text style={styles.testimonialComment}>"{testimonial.comment}"</Text>
          </View>
        ))}
      </View>

      {/* Footer - Same as website */}
      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Hotel Ritam</Text>
        <Text style={styles.footerDesc}>
          Experience luxury and comfort at Hotel Ritam, where modern elegance meets traditional hospitality.
        </Text>
        <View style={styles.footerContact}>
          <Text style={styles.footerContactText}>📍 123 Luxury Avenue, Downtown City</Text>
          <Text style={styles.footerContactText}>📞 +1 (555) 123-4567</Text>
          <Text style={styles.footerContactText}>✉️ info@hotelritam.com</Text>
        </View>
        <Text style={styles.footerCopyright}>© 2025 Hotel Ritam. All rights reserved.</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  topBar: {
    backgroundColor: '#1f2937',
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactText: {
    color: '#ffffff',
    fontSize: 12,
  },
  mainHeader: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  logoGradient: {
    color: '#2563eb',
  },
  nav: {
    flexDirection: 'row',
    gap: 20,
  },
  navItem: {
    color: '#374151',
    fontWeight: '500',
  },
  hero: {
    height: height * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    resizeMode: 'cover',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  heroContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  badgeText: {
    color: '#fbbf24',
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  heroTitleGradient: {
    fontSize: 40,
    fontWeight: '700',
    color: '#f59e0b',
    textAlign: 'center',
    marginBottom: 20,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#e5e7eb',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  highlight: {
    color: '#fbbf24',
    fontWeight: '500',
  },
  bookingForm: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    width: '100%',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  formSubtitle: {
    color: '#d1d5db',
    textAlign: 'center',
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  formField: {
    flex: 1,
  },
  formLabel: {
    color: '#e5e7eb',
    fontWeight: '600',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: '#ffffff',
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    flex: 1,
  },
  searchButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 30,
  },
  ctaButtonOutline: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  ctaButtonOutlineText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  ctaButtonFilled: {
    backgroundColor: '#ec4899',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  ctaButtonFilledText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  trustIndicators: {
    flexDirection: 'row',
    gap: 20,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  trustItem: {
    color: '#d1d5db',
    fontSize: 12,
  },
  section: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  sectionBadge: {
    color: '#2563eb',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    color: '#1f2937',
  },
  sectionSubtitle: {
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  roomsScroll: {
    marginBottom: 30,
  },
  roomCard: {
    width: 280,
    marginRight: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  roomImage: {
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  roomBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roomBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  roomPrice: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  roomPriceText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  roomInfo: {
    padding: 16,
  },
  roomName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  roomCapacity: {
    color: '#6b7280',
    marginBottom: 16,
  },
  roomButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  roomButtonOutline: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  roomButtonOutlineText: {
    color: '#374151',
    fontWeight: '500',
  },
  roomButtonFilled: {
    flex: 1,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  roomButtonFilledText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  exploreButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  exploreButtonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 16,
  },
  amenitiesSection: {
    backgroundColor: '#f9fafb',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 30,
  },
  amenityCard: {
    width: (width - 60) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  amenityIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  amenityName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  amenityDesc: {
    color: '#6b7280',
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
  },
  bookStayButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  bookStayButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  rating: {
    alignItems: 'center',
    marginBottom: 30,
  },
  ratingNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: '#2563eb',
  },
  ratingText: {
    color: '#6b7280',
  },
  testimonialCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  testimonialAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  testimonialInitials: {
    color: '#ffffff',
    fontWeight: '700',
  },
  testimonialInfo: {
    flex: 1,
  },
  testimonialName: {
    fontWeight: '700',
    marginBottom: 2,
  },
  testimonialStars: {
    fontSize: 12,
  },
  testimonialComment: {
    color: '#374151',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  footer: {
    backgroundColor: '#1f2937',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  footerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  footerDesc: {
    color: '#d1d5db',
    lineHeight: 20,
    marginBottom: 20,
  },
  footerContact: {
    marginBottom: 20,
  },
  footerContactText: {
    color: '#d1d5db',
    marginBottom: 4,
  },
  footerCopyright: {
    color: '#9ca3af',
    textAlign: 'center',
    fontSize: 12,
  },
})
