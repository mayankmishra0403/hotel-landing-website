import { account, databases, generateId, APPWRITE_CONFIG } from '@/lib/appwrite'
import { ID, Models, Permission, Role } from 'appwrite'

export interface User {
  $id: string
  name: string
  email: string
  phone?: string
  emailVerification: boolean
  phoneVerification: boolean
}

export interface UserProfile {
  userId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth?: string
  address?: string
  preferences?: {
    newsletter: boolean
    roomType: string
    specialRequests: string[]
  }
  loyaltyPoints: number
  totalBookings: number
  createdAt: string
  updatedAt: string
}

class AuthService {
  // Register new user
  async register(email: string, password: string, name: string): Promise<User> {
    try {
      const user = await account.create(generateId(), email, password, name)
      
      // Try to create user profile in database, but don't fail registration if it fails
      try {
        await this.createUserProfile({
          userId: user.$id,
          firstName: name.split(' ')[0] || '',
          lastName: name.split(' ').slice(1).join(' ') || '',
          email: email,
          loyaltyPoints: 0,
          totalBookings: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        console.log('User profile created successfully')
      } catch (profileError) {
        console.warn('Failed to create user profile, but registration was successful:', profileError)
        // Don't throw the error - let registration succeed even if profile creation fails
      }
      
      return user as User
    } catch (error: any) {
      console.error('Registration error:', error)
      
      // Handle specific error cases
      if (error.message?.includes('user with the same id, email, or phone already exists')) {
        throw new Error('An account with this email already exists. Please try logging in instead.')
      } else if (error.message?.includes('Invalid credentials')) {
        throw new Error('Please check your email and password and try again.')
      } else if (error.message?.includes('user is not authorized')) {
        throw new Error('Registration is currently unavailable. Please try again later.')
      }
      
      throw error
    }
  }

  // Login user
  async login(email: string, password: string): Promise<Models.Session> {
    try {
      return await account.createEmailPasswordSession(email, password)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await account.deleteSession('current')
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      return (await account.get()) as User
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  }

  // Get current session
  async getCurrentSession(): Promise<Models.Session | null> {
    try {
      return await account.getSession('current')
    } catch (error) {
      console.error('Get current session error:', error)
      return null
    }
  }

  // Create user profile in database
  async createUserProfile(profile: UserProfile): Promise<any> {
    try {
      const response = await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.users,
        generateId(),
        profile,
        [
          Permission.read(Role.user(profile.userId)),
          Permission.write(Role.user(profile.userId)),
          Permission.read(Role.any())
        ]
      )
      return response
    } catch (error) {
      console.error('Create user profile error:', error)
      throw error
    }
  }

  // Get user profile
  async getUserProfile(userId: string): Promise<any | null> {
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.users,
        [
          // Query by userId - you'll need to add proper query here
        ]
      )
      return response.documents[0] || null
    } catch (error) {
      console.error('Get user profile error:', error)
      return null
    }
  }

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<any> {
    try {
      const profile = await this.getUserProfile(userId)
      if (!profile) throw new Error('User profile not found')

      const response = await databases.updateDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.users,
        profile.$id,
        {
          ...updates,
          updatedAt: new Date().toISOString(),
        }
      )
      return response
    } catch (error) {
      console.error('Update user profile error:', error)
      throw error
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<void> {
    try {
      await account.createRecovery(
        email,
        `${window.location.origin}/reset-password`
      )
    } catch (error) {
      console.error('Reset password error:', error)
      throw error
    }
  }

  // Update password
  async updatePassword(newPassword: string, oldPassword: string): Promise<void> {
    try {
      await account.updatePassword(newPassword, oldPassword)
    } catch (error) {
      console.error('Update password error:', error)
      throw error
    }
  }

  // Verify email
  async verifyEmail(url: string): Promise<void> {
    try {
      await account.createVerification(url)
    } catch (error) {
      console.error('Verify email error:', error)
      throw error
    }
  }
}

const authService = new AuthService()
export default authService
