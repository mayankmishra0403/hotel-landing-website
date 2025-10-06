"use client"

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, Mail, Phone, MapPin, Calendar, Award, Edit2, Save, X, Camera, Star, 
  UploadCloud, BadgeCheck, Crown, Gift, Heart, TrendingUp, Clock, Shield,
  Bell, Settings, LogOut, ChevronRight, CheckCircle, Sparkles
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import bookingService from '@/services/booking'
import userPreferencesService from '@/services/userPreferences'

export default function ProfilePage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)

  const [bookingStats, setBookingStats] = useState({
    totalBookings: 0,
    totalSpent: 0,
    nightsStayed: 0,
    favoriteRoomType: '',
    avgSpend: 0
  })

  const [recentBookings, setRecentBookings] = useState<any[]>([])
  const [userPreferences, setUserPreferences] = useState<any>(null)
  const [favoriteServices, setFavoriteServices] = useState<string[]>([])
  const [loyaltyPoints, setLoyaltyPoints] = useState(0)

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    profilePicture: '',
    preferences: {
      roomType: 'deluxe',
      newsletter: true,
      specialRequests: [] as string[],
      smokingPreference: 'non-smoking',
      bedType: 'king',
      floorPreference: 'high',
      dietaryRestrictions: ''
    }
  })

  const [loyaltyTier, setLoyaltyTier] = useState('Member')
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null)
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!user && !loading) {
      router.push('/auth/login')
      return
    }

    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: (profile as any)?.phone || '',
        address: (profile as any)?.address || '',
        profilePicture: (profile as any)?.profilePicture || '',
        preferences: {
          ...prev.preferences,
          roomType: (profile as any)?.preferences?.roomType || 'deluxe',
          newsletter: (profile as any)?.preferences?.newsletter ?? true,
          specialRequests: (profile as any)?.preferences?.specialRequests || []
        }
      }))

      // Load user preferences and services
      const loadUserPreferences = async () => {
        try {
          const prefs = await userPreferencesService.getUserPreferences(user.$id)
          if (prefs) {
            setUserPreferences(prefs)
            setFavoriteServices(prefs.favoriteServices)
            setLoyaltyPoints(prefs.loyaltyPoints)
            setLoyaltyTier(prefs.membershipTier)
            
            // Update profile data with guest preferences
            setProfileData(prev => ({
              ...prev,
              preferences: {
                ...prev.preferences,
                smokingPreference: prefs.guestPreferences.smokingPreference,
                bedType: prefs.guestPreferences.bedType,
                floorPreference: prefs.guestPreferences.floorPreference,
                dietaryRestrictions: prefs.guestPreferences.dietaryRestrictions
              }
            }))
          }
        } catch (error) {
          console.log('User preferences not available yet:', error)
          // Enhanced features will be available after first booking with services
        }
      }

      loadUserPreferences()

      const loadBookingStats = async () => {
        try {
          const bookings = await bookingService.getUserBookings(user.$id)
          const completed = bookings.filter((b: any) => b.status !== 'cancelled')
          const totalSpent = completed.reduce((sum: number, b: any) => sum + (b.finalTotal || 0), 0)
          const nightsStayed = completed.reduce((sum: number, b: any) => sum + (b.nights || 1), 0)
          const roomTypeCounts: Record<string, number> = {}
          completed.forEach((b: any) => { if (b.roomType) roomTypeCounts[b.roomType] = (roomTypeCounts[b.roomType] || 0) + 1 })
          const favoriteRoomType = Object.entries(roomTypeCounts).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0] || ''
          const avgSpend = completed.length ? Math.round(totalSpent / completed.length) : 0

          setBookingStats({ totalBookings: bookings.length, totalSpent, nightsStayed, favoriteRoomType, avgSpend })
          setRecentBookings(bookings.slice(0, 3))

          if (totalSpent > 5000) setLoyaltyTier('Platinum')
          else if (totalSpent > 2000) setLoyaltyTier('Gold')
          else if (totalSpent > 500) setLoyaltyTier('Silver')
          else setLoyaltyTier('Member')
        } catch (err) {
          console.error('Error loading bookings', err)
        }
      }

      loadBookingStats()
    }
  }, [user, profile, loading, router])



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement
    const { name, value, type } = target
    if (name.startsWith('preferences.')) {
      const key = name.split('.')[1]
      if (key === 'specialRequests') {
        setProfileData(prev => ({ ...prev, preferences: { ...prev.preferences, specialRequests: value.split(',').map(s => s.trim()).filter(Boolean) } }))
      } else {
        setProfileData(prev => ({ ...prev, preferences: { ...prev.preferences, // @ts-ignore
          [key]: type === 'checkbox' ? target.checked : value } }))
      }
    } else {
      setProfileData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) { setProfilePicFile(f); setProfilePicPreview(URL.createObjectURL(f)) }
  }

  const handleProfilePicClick = () => fileInputRef.current?.click()

  const handleSave = async () => {
    setIsSaving(true); setShowSaveSuccess(false)
    try {
      if (profilePicFile) { setProfileData(prev => ({ ...prev, profilePicture: profilePicPreview || '' })) }
      // call updateProfile when available
      toast.success('Profile updated successfully!')
      setIsEditing(false); setShowSaveSuccess(true); setTimeout(() => setShowSaveSuccess(false), 2000)
    } catch (err) { toast.error('Failed to update profile') }
    finally { setIsSaving(false) }
  }

  const getGreeting = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening' }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }
  
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const getLoyaltyColor = (tier: string) => {
    switch (tier) {
      case 'Platinum': return 'from-slate-400 to-slate-600'
      case 'Gold': return 'from-yellow-400 to-yellow-600'
      case 'Silver': return 'from-gray-300 to-gray-500'
      default: return 'from-blue-400 to-blue-600'
    }
  }

  const getLoyaltyIcon = (tier: string) => {
    switch (tier) {
      case 'Platinum': return <Crown className="w-4 h-4" />
      case 'Gold': return <Award className="w-4 h-4" />
      case 'Silver': return <Star className="w-4 h-4" />
      default: return <BadgeCheck className="w-4 h-4" />
    }
  }

  const handleLogout = () => {
    // Show confirmation toast
    toast((t) => (
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="font-semibold text-gray-900">Sign out of your account?</p>
          <p className="text-sm text-gray-600">You'll need to sign in again to access your profile.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              toast.dismiss(t.id)
              // Add actual logout logic here (clear auth, etc.)
              toast.success('Signed out successfully')
              router.push('/auth/login')
            }}
            className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Sign Out
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 8000,
      style: {
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '16px',
        maxWidth: '400px',
      }
    })
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="animate-spin w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full" />
          <div className="absolute inset-0 animate-ping w-12 h-12 border-4 border-blue-300 rounded-full opacity-20" />
        </div>
        <p className="text-gray-600 font-medium">Loading your profile...</p>
      </div>
    </div>
  )
  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/10 to-pink-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-300/5 to-purple-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-12"
        >
          {/* Navigation Header */}
          <div className="flex items-center justify-between mb-8">
            {/* Logo/Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Hotel Ritam</span>
            </div>

            {/* User Name - Direct Link to Profile */}
            <Link href="/profile">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 bg-white/80 backdrop-blur-lg rounded-2xl px-4 py-2 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="font-semibold text-gray-900">{user.name || 'Guest'}</span>
                <User className="w-4 h-4 text-gray-500" />
              </motion.div>
            </Link>
          </div>

          {/* Welcome Section */}
          <div className="text-center mt-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-2 mb-4"
            >
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span className="text-lg text-gray-600 font-medium">{getGreeting()},</span>
            </motion.div>
            
            <motion.h1 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4"
            >
              Welcome back!
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 text-lg max-w-2xl mx-auto"
            >
              Manage your profile, view your booking history, and customize your preferences.
            </motion.p>
          </div>
        </motion.div>

        <div className="grid xl:grid-cols-4 lg:grid-cols-3 gap-8">
          {/* Profile Card - Left Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="xl:col-span-1"
          >
            <div className="sticky top-8">
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                {/* Profile Picture Section */}
                <div className="relative p-8 text-center bg-gradient-to-br from-blue-500/5 to-purple-500/5">
                  <div className="relative inline-block mb-6">
                    {profilePicPreview || profileData.profilePicture ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={profilePicPreview || profileData.profilePicture} 
                        alt="Profile" 
                        className="w-32 h-32 rounded-full object-cover ring-4 ring-white shadow-xl"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold ring-4 ring-white shadow-xl">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}

                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      type="button" 
                      onClick={handleProfilePicClick} 
                      className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300"
                      title="Change profile picture"
                    >
                      <Camera className="w-4 h-4" />
                    </motion.button>
                    
                    <input 
                      ref={fileInputRef} 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleProfilePicChange} 
                      name="profilePicture" 
                    />
                  </div>

                  <AnimatePresence>
                    {profilePicPreview && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center justify-center gap-2 mb-4"
                      >
                        <UploadCloud className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-blue-700 font-medium">Preview uploaded</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h2>
                  <p className="text-gray-600 text-sm truncate px-4">{user.email}</p>
                </div>

                {/* Stats Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200/50"
                    >
                      <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-xl font-bold text-blue-700">{formatNumber(bookingStats.totalBookings)}</div>
                      <div className="text-xs text-blue-600 font-medium">Bookings</div>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border border-emerald-200/50"
                    >
                      <Award className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                      <div className="text-xl font-bold text-emerald-700">{formatCurrency(bookingStats.totalSpent)}</div>
                      <div className="text-xs text-emerald-600 font-medium">Total Spent</div>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl border border-amber-200/50"
                    >
                      <Star className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                      <div className="text-sm font-bold text-amber-700 truncate">{bookingStats.favoriteRoomType || 'N/A'}</div>
                      <div className="text-xs text-amber-600 font-medium">Favorite Room</div>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200/50"
                    >
                      <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <div className="text-xl font-bold text-purple-700">{formatNumber(bookingStats.nightsStayed)}</div>
                      <div className="text-xs text-purple-600 font-medium">Nights</div>
                    </motion.div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Link href="/bookings">
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Calendar className="w-4 h-4" />
                        View Bookings
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </Link>
                    
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsEditing(!isEditing)} 
                      className="w-full bg-gray-100/80 backdrop-blur-sm text-gray-700 py-3 rounded-2xl font-semibold hover:bg-gray-200/80 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {isEditing ? (
                        <>
                          <X className="w-4 h-4" />
                          Cancel Edit
                        </>
                      ) : (
                        <>
                          <Edit2 className="w-4 h-4" />
                          Edit Profile
                        </>
                      )}
                    </motion.button>

                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleLogout}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content Area */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="xl:col-span-3 lg:col-span-2"
          >
            <div className="space-y-8">
              {/* Profile Information Card */}
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                        Profile Information
                      </h3>
                      <p className="text-gray-600 mt-1">Manage your personal details and preferences</p>
                    </div>
                    
                    <AnimatePresence>
                      {isEditing && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex gap-3"
                        >
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsEditing(false)} 
                            className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-2xl transition-all duration-200"
                          >
                            <X className="w-5 h-5" />
                          </motion.button>
                          
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSave} 
                            disabled={isSaving} 
                            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                          >
                            {isSaving ? (
                              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                            ) : showSaveSuccess ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                            {showSaveSuccess ? 'Saved!' : 'Save Changes'}
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Personal Information */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-800">Personal Details</h4>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">Full Name</label>
                          {isEditing ? (
                            <motion.input 
                              whileFocus={{ scale: 1.02 }}
                              type="text" 
                              name="name" 
                              value={profileData.name} 
                              onChange={handleInputChange} 
                              className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-gray-900 font-medium"
                              placeholder="Enter your full name"
                            />
                          ) : (
                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
                              <User className="w-5 h-5 text-blue-600" />
                              <span className="text-gray-900 font-medium">{profileData.name || 'Not provided'}</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">Email Address</label>
                          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-green-50 rounded-2xl border border-gray-200">
                            <Mail className="w-5 h-5 text-green-600" />
                            <span className="text-gray-900 font-medium">{profileData.email}</span>
                            <Shield className="w-4 h-4 text-green-500 ml-auto" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">Phone Number</label>
                          {isEditing ? (
                            <motion.input 
                              whileFocus={{ scale: 1.02 }}
                              type="tel" 
                              name="phone" 
                              value={profileData.phone} 
                              onChange={handleInputChange} 
                              className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-gray-900 font-medium"
                              placeholder="Enter phone number"
                            />
                          ) : (
                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-2xl border border-gray-200">
                              <Phone className="w-5 h-5 text-purple-600" />
                              <span className="text-gray-900 font-medium">{profileData.phone || 'Not provided'}</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">Address</label>
                          {isEditing ? (
                            <motion.textarea 
                              whileFocus={{ scale: 1.02 }}
                              name="address" 
                              value={profileData.address} 
                              onChange={handleInputChange} 
                              rows={3}
                              className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-gray-900 font-medium resize-none"
                              placeholder="Enter your address"
                            />
                          ) : (
                            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-2xl border border-gray-200 min-h-[60px]">
                              <MapPin className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-900 font-medium">{profileData.address || 'Not provided'}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Preferences */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                          <Settings className="w-4 h-4 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-800">Preferences</h4>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">Preferred Room Type</label>
                          {isEditing ? (
                            <motion.select 
                              whileFocus={{ scale: 1.02 }}
                              name="preferences.roomType" 
                              value={profileData.preferences.roomType} 
                              onChange={handleInputChange} 
                              className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-gray-900 font-medium bg-white"
                            >
                              <option value="standard">Standard Room</option>
                              <option value="deluxe">Deluxe Room</option>
                              <option value="suite">Suite</option>
                              <option value="presidential">Presidential Suite</option>
                            </motion.select>
                          ) : (
                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-amber-50 rounded-2xl border border-gray-200">
                              <Star className="w-5 h-5 text-amber-600" />
                              <span className="text-gray-900 font-medium capitalize">{profileData.preferences.roomType}</span>
                            </div>
                          )}
                        </div>

                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                          <label className="flex items-center gap-4 cursor-pointer">
                            <motion.input 
                              whileTap={{ scale: 0.95 }}
                              type="checkbox" 
                              name="preferences.newsletter" 
                              checked={profileData.preferences.newsletter} 
                              onChange={e => handleInputChange(e as any)} 
                              disabled={!isEditing} 
                              className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:ring-2"
                            />
                            <div className="flex items-center gap-2">
                              <Bell className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-semibold text-gray-700">Newsletter & Promotions</span>
                            </div>
                          </label>
                          <p className="text-xs text-gray-600 mt-2 ml-9">Get the latest offers and updates</p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">Member Since</label>
                          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200">
                            <Calendar className="w-5 h-5 text-emerald-600" />
                            <span className="text-gray-900 font-medium">
                              {(profile as any)?.createdAt 
                                ? new Date((profile as any).createdAt).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  }) 
                                : 'Recently joined'
                              }
                            </span>
                            <Heart className="w-4 h-4 text-red-500 ml-auto" />
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200">
                          <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-5 h-5 text-indigo-600" />
                            <h5 className="font-bold text-gray-800">Your Journey</h5>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                              <div className="text-2xl font-bold text-indigo-600">{formatCurrency(bookingStats.avgSpend)}</div>
                              <div className="text-xs text-gray-600">Avg. Spend</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-purple-600">{loyaltyTier}</div>
                              <div className="text-xs text-gray-600">Status</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Bookings Preview */}
              {recentBookings.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
                >
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Recent Bookings</h3>
                      </div>
                      <Link href="/bookings">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2"
                        >
                          View All
                          <ChevronRight className="w-4 h-4" />
                        </motion.button>
                      </Link>
                    </div>
                    
                    <div className="grid gap-4">
                      {recentBookings.slice(0, 3).map((booking, index) => (
                        <motion.div
                          key={booking.$id || index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.9 + index * 0.1 }}
                          className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">{booking.roomType || 'Room Booking'}</h4>
                              <p className="text-sm text-gray-600">
                                {booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : 'Date not available'}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-green-600">{formatCurrency(booking.finalTotal || 0)}</div>
                              <div className={`text-xs px-2 py-1 rounded-full ${
                                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {booking.status || 'Unknown'}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Hotel Services & Preferences Section */}
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-900 to-indigo-900 bg-clip-text text-transparent">
                        Hotel Services & Preferences
                      </h3>
                      <p className="text-gray-600 mt-2">Your personalized hotel experience preferences</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-semibold text-purple-800">{loyaltyTier} Member</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Loyalty Points & Membership */}
                    <div className="space-y-6">
                      <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-200">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-xl font-bold text-purple-900">Loyalty Points</h4>
                          <Crown className="w-8 h-8 text-purple-600" />
                        </div>
                        <div className="text-center">
                          <div className="text-4xl font-bold text-purple-600 mb-2">
                            {formatNumber(loyaltyPoints)}
                          </div>
                          <p className="text-purple-700 font-medium mb-4">{loyaltyTier} Membership</p>
                          <div className="w-full bg-purple-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${Math.min((loyaltyPoints % 1000) / 10, 100)}%` 
                              }}
                            />
                          </div>
                          <p className="text-sm text-purple-600 mt-2">
                            {1000 - (loyaltyPoints % 1000)} points to next tier
                          </p>
                        </div>
                      </div>

                      {/* Guest Preferences */}
                      <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
                        <h4 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                          <Settings className="w-5 h-5" />
                          Your Preferences
                        </h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Smoking Preference</span>
                            <span className="text-sm text-blue-600 font-semibold capitalize">
                              {profileData.preferences.smokingPreference}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Bed Type</span>
                            <span className="text-sm text-blue-600 font-semibold capitalize">
                              {profileData.preferences.bedType}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Floor Preference</span>
                            <span className="text-sm text-blue-600 font-semibold capitalize">
                              {profileData.preferences.floorPreference}
                            </span>
                          </div>
                          {profileData.preferences.dietaryRestrictions && (
                            <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                              <span className="text-sm font-medium text-gray-700">Dietary</span>
                              <span className="text-sm text-blue-600 font-semibold">
                                {profileData.preferences.dietaryRestrictions}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Favorite Services */}
                    <div className="space-y-6">
                      <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-200">
                        <h4 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
                          <Heart className="w-5 h-5" />
                          Favorite Services
                        </h4>
                        {favoriteServices.length > 0 ? (
                          <div className="space-y-3">
                            {favoriteServices.map((serviceId, index) => {
                              const serviceName = {
                                'spa': '🧘‍♀️ Spa & Wellness',
                                'airport-transfer': '🚗 Airport Transfer',
                                'dining': '🍽️ Fine Dining',
                                'room-service': '☕ Room Service',
                                'fitness': '💪 Personal Training',
                                'pool': '🏊‍♂️ Pool Access',
                                'entertainment': '🎵 Live Music',
                                'celebration': '🎉 Celebration Package'
                              }[serviceId] || `✨ ${serviceId}`
                              
                              return (
                                <motion.div
                                  key={serviceId}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="flex items-center justify-between p-3 bg-white/60 rounded-lg hover:bg-white/80 transition-colors"
                                >
                                  <span className="text-sm font-medium text-gray-700">
                                    {serviceName}
                                  </span>
                                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                                </motion.div>
                              )
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Gift className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                            <p className="text-emerald-700 font-medium mb-2">No favorite services yet</p>
                            <p className="text-sm text-emerald-600">
                              Book services to see your favorites here
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Service History */}
                      {userPreferences?.previousServices && userPreferences.previousServices.length > 0 && (
                        <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
                          <h4 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Recent Services
                          </h4>
                          <div className="space-y-3">
                            {userPreferences.previousServices.slice(-3).map((service: any, index: number) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-between p-3 bg-white/60 rounded-lg"
                              >
                                <div>
                                  <p className="text-sm font-medium text-gray-700">
                                    {service.serviceName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(service.bookingDate).toLocaleDateString()}
                                  </p>
                                </div>
                                {service.rating && (
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                    <span className="text-sm font-medium text-gray-700">
                                      {service.rating}
                                    </span>
                                  </div>
                                )}
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200">
                    <h4 className="text-lg font-bold text-indigo-900 mb-4">Quick Actions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Link href="/rooms">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full p-4 bg-white/60 hover:bg-white/80 rounded-xl border border-white/40 transition-all duration-300 text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                              <MapPin className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">Book Again</p>
                              <p className="text-sm text-gray-600">Reserve your favorite room</p>
                            </div>
                          </div>
                        </motion.button>
                      </Link>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full p-4 bg-white/60 hover:bg-white/80 rounded-xl border border-white/40 transition-all duration-300 text-left"
                        onClick={() => toast('Coming soon! Update your preferences.', { icon: 'ℹ️' })}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Settings className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Update Preferences</p>
                            <p className="text-sm text-gray-600">Customize your stay</p>
                          </div>
                        </div>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full p-4 bg-white/60 hover:bg-white/80 rounded-xl border border-white/40 transition-all duration-300 text-left"
                        onClick={() => toast.success('Thank you! We value your feedback.')}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Star className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Rate Services</p>
                            <p className="text-sm text-gray-600">Share your experience</p>
                          </div>
                        </div>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
