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

// Featured rooms data matching Next.js website exactly
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

// Amenities data matching Next.js website exactly
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

// Testimonials data matching Next.js website exactly  
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
        {/* Top Bar - Enhanced with gradient and contact info */}
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
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
            <Text style={styles.contactText}>123 Luxury Avenue</Text>
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

      {/* Hero Section - Exactly matching Next.js website design */}
      <View style={styles.heroContainer}>
        <ImageBackground 
          source={{ uri: backgroundImages[currentImageIndex] }}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            {/* Hotel Rating Badge - Glassmorphism effect */}
            <View style={styles.ratingBadge}>
              <Text style={styles.badgeIcon}>🏆</Text>
              <Text style={styles.badgeText}>5-Star Luxury Hotel</Text>
              <View style={styles.stars}>
                {[1,2,3,4,5].map((_, i) => (
                  <Text key={i} style={styles.starIcon}>⭐</Text>
                ))}
              </View>
            </View>

            {/* Main Title - Matching Playfair Display styling */}
            <Text style={styles.heroMainTitle}>Welcome to</Text>
            <Text style={styles.heroTitleGradient}>Hotel Ritam</Text>

            {/* Subtitle - Enhanced spacing and typography */}
            <Text style={styles.heroSubtitle}>
              Experience unparalleled luxury and comfort in the heart of the city.
              {'\n'}
              Where every moment becomes an <Text style={styles.highlightText}>unforgettable memory</Text>.
            </Text>

            {/* Enhanced Booking Form - Glassmorphism */}
            <View style={styles.bookingForm}>
              <Text style={styles.formTitle}>Find Your Perfect Stay</Text>
              <Text style={styles.formSubtitle}>Book your luxury experience today</Text>
              
              <View style={styles.formGrid}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Check In</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.dateInput}
                      placeholder="Select Date"
                      placeholderTextColor="rgba(255,255,255,0.6)"
                      value={checkIn}
                      onChangeText={setCheckIn}
                    />
                    <Text style={styles.inputIcon}>📅</Text>
                  </View>
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Check Out</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.dateInput}
                      placeholder="Select Date"
                      placeholderTextColor="rgba(255,255,255,0.6)"
                      value={checkOut}
                      onChangeText={setCheckOut}
                    />
                    <Text style={styles.inputIcon}>📅</Text>
                  </View>
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Guests</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.guestInput}
                      value={`${guests} Guests`}
                      editable={false}
                    />
                    <Text style={styles.inputIcon}>👥</Text>
                  </View>
                </View>
                
                <TouchableOpacity style={styles.searchButton}>
                  <Text style={styles.searchIcon}>🔍</Text>
                  <Text style={styles.searchButtonText}>Search Luxury Rooms</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Enhanced CTA Buttons */}
            <View style={styles.ctaButtons}>
              <TouchableOpacity style={styles.ctaOutline}>
                <Text style={styles.ctaOutlineText}>Explore Our Rooms</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.ctaFilled}>
                <Text style={styles.ctaFilledText}>Special Offers</Text>
              </TouchableOpacity>
            </View>

            {/* Trust Indicators - Enhanced design */}
            <View style={styles.trustIndicators}>
              <View style={styles.trustItem}>
                <Text style={styles.trustIcon}>🏆</Text>
                <Text style={styles.trustText}>Award Winning</Text>
              </View>
              <View style={styles.trustItem}>
                <Text style={styles.trustIcon}>⭐</Text>
                <Text style={styles.trustText}>4.9/5 Rating</Text>
              </View>
              <View style={styles.trustItem}>
                <Text style={styles.trustIcon}>👥</Text>
                <Text style={styles.trustText}>10,000+ Happy Guests</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* Featured Rooms Section - Exactly matching Next.js website */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionBadge}>
            <Text style={styles.sectionBadgeText}>✨ Luxury Accommodations</Text>
          </View>
          <Text style={styles.sectionTitle}>Featured{' '}
            <Text style={styles.sectionTitleGradient}>Rooms & Suites</Text>
          </Text>
          <Text style={styles.sectionSubtitle}>
            Discover our carefully curated selection of luxury accommodations, each designed to provide you with the ultimate comfort and elegance.
          </Text>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roomsScroll}>
          {featuredRooms.map((room) => (
            <View key={room.id} style={styles.roomCard}>
              <ImageBackground source={{ uri: room.image }} style={styles.roomImage}>
                <View style={styles.roomBadge}>
                  <Text style={styles.roomBadgeText}>✨ Available</Text>
                </View>
                <View style={styles.roomRating}>
                  <Text style={styles.roomRatingText}>⭐ {room.rating}</Text>
                </View>
              </ImageBackground>
              <View style={styles.roomInfo}>
                <Text style={styles.roomName}>{room.name}</Text>
                <Text style={styles.roomSize}>{room.beds} • {room.size}</Text>
                <View style={styles.roomAmenities}>
                  {room.amenities.slice(0, 2).map((amenity, idx) => (
                    <View key={idx} style={styles.amenityTag}>
                      <Text style={styles.amenityTagText}>{amenity}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.roomPricing}>
                  <View>
                    <Text style={styles.roomPrice}>${room.price}</Text>
                    <Text style={styles.roomPriceOriginal}>${room.originalPrice}</Text>
                  </View>
                  <Text style={styles.roomPriceNight}>per night</Text>
                </View>
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
            <Text style={styles.exploreButtonIcon}>🏨</Text>
            <Text style={styles.exploreButtonText}>Explore All Rooms</Text>
            <Text style={styles.exploreButtonArrow}>→</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Amenities Section - Exactly matching Next.js website */}
      <View style={[styles.section, styles.amenitiesSection]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>World-Class{' '}
            <Text style={styles.sectionTitleGradient}>Amenities</Text>
          </Text>
          <Text style={styles.sectionSubtitle}>
            Experience unparalleled comfort with our comprehensive range of luxury amenities designed to exceed your expectations.
          </Text>
        </View>
        
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

      {/* Testimonials Section - Exactly matching Next.js website */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>What Our{' '}
            <Text style={styles.sectionTitleGradient}>Guests Say</Text>
          </Text>
          <Text style={styles.sectionSubtitle}>
            Don't just take our word for it. Here's what our valued guests have to say about their unforgettable experiences at Hotel Ritam.
          </Text>
        </View>
        
        <View style={styles.rating}>
          <Text style={styles.ratingNumber}>4.8</Text>
          <Text style={styles.ratingStars}>⭐⭐⭐⭐⭐</Text>
          <Text style={styles.ratingText}>Based on {testimonials.length} guest reviews</Text>
        </View>

        {testimonials.map((testimonial, index) => (
          <View key={index} style={styles.testimonialCard}>
            <View style={styles.testimonialHeader}>
              <View style={styles.testimonialAvatar}>
                <Text style={styles.testimonialInitials}>{testimonial.initials}</Text>
              </View>
              <View style={styles.testimonialInfo}>
                <Text style={styles.testimonialName}>{testimonial.name}</Text>
                <Text style={styles.testimonialLocation}>{testimonial.location}</Text>
                <View style={styles.testimonialStars}>
                  {[1,2,3,4,5].map((_, i) => (
                    <Text key={i} style={styles.starSmall}>
                      {i < testimonial.rating ? '⭐' : '☆'}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
            <Text style={styles.testimonialComment}>"{testimonial.comment}"</Text>
          </View>
        ))}
      </View>

      {/* Footer - Exactly matching Next.js website */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <Text style={styles.footerLogo}>Hotel <Text style={styles.footerLogoGradient}>Ritam</Text></Text>
          <Text style={styles.footerTagline}>Where luxury meets comfort</Text>
          
          <View style={styles.footerSection}>
            <Text style={styles.footerSectionTitle}>Contact Information</Text>
            <Text style={styles.footerItem}>📞 +1 (555) 123-4567</Text>
            <Text style={styles.footerItem}>✉️ info@hotelritam.com</Text>
            <Text style={styles.footerItem}>📍 123 Luxury Avenue, Downtown</Text>
          </View>
          
          <View style={styles.footerSection}>
            <Text style={styles.footerSectionTitle}>Follow Us</Text>
            <View style={styles.socialLinks}>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialIcon}>📘</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialIcon}>📷</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialIcon}>🐦</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <Text style={styles.footerCopy}>© 2024 Hotel Ritam. All rights reserved.</Text>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  
  // Enhanced Header Styles
  header: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  topBar: {
    backgroundColor: 'linear-gradient(to right, #1f2937, #1e3a8a, #7c3aed)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactIcon: {
    fontSize: 12,
  },
  contactText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  logoGradient: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2563eb',
  },
  nav: {
    flexDirection: 'row',
    gap: 16,
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  navItem: {
    color: '#374151',
    fontWeight: '500',
    fontSize: 14,
  },

  // Enhanced Hero Styles
  heroContainer: {
    height: height * 0.9,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    resizeMode: 'cover',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  heroContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1,
    flex: 1,
    justifyContent: 'center',
    paddingTop: 60,
  },
  ratingBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  badgeIcon: {
    fontSize: 16,
  },
  badgeText: {
    color: '#fbbf24',
    fontWeight: '600',
    fontSize: 14,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  starIcon: {
    fontSize: 12,
  },
  heroMainTitle: {
    fontSize: 42,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'serif',
  },
  heroTitleGradient: {
    fontSize: 52,
    fontWeight: '700',
    color: '#f59e0b',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'serif',
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#e5e7eb',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  highlightText: {
    color: '#fbbf24',
    fontWeight: '500',
  },

  // Enhanced Booking Form Styles
  bookingForm: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 24,
    padding: 24,
    marginBottom: 40,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  formSubtitle: {
    color: '#d1d5db',
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 16,
  },
  formGrid: {
    gap: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#e5e7eb',
    fontWeight: '600',
    marginBottom: 8,
    fontSize: 14,
  },
  inputWrapper: {
    position: 'relative',
  },
  dateInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    paddingRight: 40,
    color: '#ffffff',
    fontSize: 16,
  },
  guestInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    paddingRight: 40,
    color: '#ffffff',
    fontSize: 16,
  },
  inputIcon: {
    position: 'absolute',
    right: 12,
    top: 14,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },

  // Enhanced CTA Buttons
  ctaButtons: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  ctaOutline: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  ctaOutlineText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  ctaFilled: {
    flex: 1,
    backgroundColor: '#ec4899',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  ctaFilledText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },

  // Trust Indicators
  trustIndicators: {
    flexDirection: 'row',
    gap: 24,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  trustItem: {
    alignItems: 'center',
    gap: 4,
  },
  trustIcon: {
    fontSize: 16,
  },
  trustText: {
    color: '#d1d5db',
    fontSize: 12,
    fontWeight: '500',
  },

  // Section Styles
  section: {
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  sectionBadge: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  sectionBadgeText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    color: '#1f2937',
    fontFamily: 'serif',
  },
  sectionTitleGradient: {
    color: '#2563eb',
  },
  sectionSubtitle: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: 20,
  },

  // Room Card Styles
  roomsScroll: {
    marginBottom: 40,
  },
  roomCard: {
    width: 320,
    marginRight: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  roomImage: {
    height: 240,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  roomBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  roomBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  roomRating: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#fbbf24',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  roomRatingText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
  roomInfo: {
    padding: 20,
  },
  roomName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1f2937',
  },
  roomSize: {
    color: '#6b7280',
    marginBottom: 12,
    fontSize: 14,
  },
  roomAmenities: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  amenityTag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  amenityTagText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '500',
  },
  roomPricing: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  roomPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2563eb',
  },
  roomPriceOriginal: {
    fontSize: 16,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  roomPriceNight: {
    color: '#6b7280',
    fontSize: 14,
  },
  roomButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  roomButtonOutline: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  roomButtonOutlineText: {
    color: '#374151',
    fontWeight: '500',
    fontSize: 14,
  },
  roomButtonFilled: {
    flex: 1,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  roomButtonFilledText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },

  // Explore Button
  exploreButton: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  exploreButtonIcon: {
    fontSize: 20,
  },
  exploreButtonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 18,
  },
  exploreButtonArrow: {
    color: '#374151',
    fontSize: 18,
  },

  // Amenities Section
  amenitiesSection: {
    backgroundColor: '#f9fafb',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 40,
  },
  amenityCard: {
    width: (width - 60) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  amenityIcon: {
    fontSize: 40,
    marginBottom: 16,
  },
  amenityName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    color: '#1f2937',
  },
  amenityDesc: {
    color: '#6b7280',
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 20,
  },

  // Book Stay Button
  bookStayButton: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bookStayButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 18,
  },

  // Testimonials
  rating: {
    alignItems: 'center',
    marginBottom: 40,
  },
  ratingNumber: {
    fontSize: 56,
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: 8,
  },
  ratingStars: {
    fontSize: 20,
    marginBottom: 8,
  },
  ratingText: {
    color: '#6b7280',
    fontSize: 16,
  },
  testimonialCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  testimonialAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  testimonialInitials: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 18,
  },
  testimonialInfo: {
    flex: 1,
  },
  testimonialName: {
    fontWeight: '700',
    marginBottom: 4,
    fontSize: 16,
    color: '#1f2937',
  },
  testimonialLocation: {
    color: '#6b7280',
    fontSize: 14,
    marginBottom: 8,
  },
  testimonialStars: {
    flexDirection: 'row',
    gap: 2,
  },
  starSmall: {
    fontSize: 14,
  },
  testimonialComment: {
    color: '#374151',
    lineHeight: 24,
    fontStyle: 'italic',
    fontSize: 16,
  },

  // Footer
  footer: {
    backgroundColor: '#1f2937',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  footerContent: {
    alignItems: 'center',
  },
  footerLogo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  footerLogoGradient: {
    color: '#fbbf24',
  },
  footerTagline: {
    color: '#9ca3af',
    marginBottom: 30,
    fontSize: 16,
  },
  footerSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  footerSectionTitle: {
    color: '#ffffff',
    fontWeight: '700',
    marginBottom: 16,
    fontSize: 18,
  },
  footerItem: {
    color: '#d1d5db',
    marginBottom: 8,
    fontSize: 14,
  },
  socialLinks: {
    flexDirection: 'row',
    gap: 16,
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcon: {
    fontSize: 20,
  },
  footerCopy: {
    color: '#9ca3af',
    textAlign: 'center',
    fontSize: 14,
  },
})
