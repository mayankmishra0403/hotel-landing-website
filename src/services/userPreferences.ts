import { databases, APPWRITE_CONFIG } from '@/lib/appwrite'
import { Query } from 'appwrite'

export interface UserPreferences {
  $id?: string
  userId: string
  favoriteServices: string[]
  preferredRoomTypes: string[]
  guestPreferences: {
    smokingPreference: string
    bedType: string
    floorPreference: string
    dietaryRestrictions: string
  }
  previousServices: Array<{
    serviceId: string
    serviceName: string
    bookingDate: string
    rating?: number
  }>
  loyaltyPoints: number
  membershipTier: string
  createdAt: string
  updatedAt: string
}

class UserPreferencesService {
  // Get user preferences using secure API
  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      const response = await fetch(`/api/user-preferences?userId=${encodeURIComponent(userId)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        console.log('User preferences API not available')
        return null
      }

      const result = await response.json()
      
      if (result.success) {
        return result.preferences as UserPreferences
      }

      return null
    } catch (error) {
      console.log('Error fetching user preferences:', error)
      return null
    }
  }

  // Create or update user preferences using secure API
  async saveUserPreferences(preferences: Omit<UserPreferences, '$id' | 'createdAt' | 'updatedAt'>): Promise<UserPreferences | null> {
    try {
      const response = await fetch('/api/user-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences)
      })

      if (!response.ok) {
        console.log('User preferences API not available')
        return null
      }

      const result = await response.json()
      
      if (result.success) {
        return result.preferences as UserPreferences
      }

      return null
    } catch (error) {
      console.log('Error saving user preferences:', error)
      return null
    }
  }

  // Add service to user's history using secure API
  async addServiceToHistory(userId: string, service: {
    serviceId: string
    serviceName: string
    bookingDate: string
    rating?: number
  }): Promise<void> {
    try {
      const response = await fetch('/api/user-preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'addService',
          userId,
          data: { service }
        })
      })

      if (!response.ok) {
        console.log('User preferences API not available for service history')
        return
      }

      const result = await response.json()
      
      if (!result.success) {
        console.log('Failed to add service to history:', result.message)
      }
    } catch (error) {
      console.log('Error adding service to history:', error)
    }
  }

  // Update favorite services using secure API
  async updateFavoriteServices(userId: string, serviceIds: string[]): Promise<void> {
    try {
      const response = await fetch('/api/user-preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateFavorites',
          userId,
          data: { services: serviceIds }
        })
      })

      if (!response.ok) {
        console.log('User preferences API not available for favorites')
        return
      }

      const result = await response.json()
      
      if (!result.success) {
        console.log('Failed to update favorite services:', result.message)
      }
    } catch (error) {
      console.log('Error updating favorite services:', error)
    }
  }

  // Update guest preferences
  async updateGuestPreferences(userId: string, guestPrefs: {
    smokingPreference: string
    bedType: string
    floorPreference: string
    dietaryRestrictions: string
  }): Promise<void> {
    try {
      const preferences = await this.getUserPreferences(userId)
      
      const updatedPreferences = {
        userId,
        favoriteServices: preferences?.favoriteServices || [],
        preferredRoomTypes: preferences?.preferredRoomTypes || [],
        guestPreferences: guestPrefs,
        previousServices: preferences?.previousServices || [],
        loyaltyPoints: preferences?.loyaltyPoints || 0,
        membershipTier: preferences?.membershipTier || 'bronze'
      }

      await this.saveUserPreferences(updatedPreferences)
    } catch (error) {
      console.error('Error updating guest preferences:', error)
    }
  }

  // Calculate membership tier based on loyalty points
  private calculateMembershipTier(points: number): string {
    if (points >= 1000) return 'platinum'
    if (points >= 500) return 'gold'
    if (points >= 200) return 'silver'
    return 'bronze'
  }

  // Get service recommendations based on history
  async getServiceRecommendations(userId: string): Promise<string[]> {
    try {
      const preferences = await this.getUserPreferences(userId)
      
      if (!preferences?.previousServices.length) {
        // Return popular services for new users
        return ['spa', 'airport-transfer', 'room-service', 'pool']
      }

      // Return services similar to previously booked ones
      const serviceFrequency: { [key: string]: number } = {}
      preferences.previousServices.forEach(service => {
        serviceFrequency[service.serviceId] = (serviceFrequency[service.serviceId] || 0) + 1
      })

      return Object.keys(serviceFrequency)
        .sort((a, b) => serviceFrequency[b] - serviceFrequency[a])
        .slice(0, 4)
    } catch (error) {
      console.error('Error getting service recommendations:', error)
      return ['spa', 'airport-transfer', 'room-service', 'pool']
    }
  }

  // Award loyalty points using secure API
  async awardLoyaltyPoints(userId: string, points: number): Promise<void> {
    try {
      const response = await fetch('/api/user-preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'addPoints',
          userId,
          data: { points }
        })
      })

      if (!response.ok) {
        console.log('User preferences API not available for points')
        return
      }

      const result = await response.json()
      
      if (!result.success) {
        console.log('Failed to award loyalty points:', result.message)
      }
    } catch (error) {
      console.log('Error awarding loyalty points:', error)
    }
  }
}

const userPreferencesService = new UserPreferencesService()
export default userPreferencesService
