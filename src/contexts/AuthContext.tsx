'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import authService, { User, UserProfile } from '@/services/auth'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  refreshUser: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize auth state
  useEffect(() => {
    checkAuthState()
  }, [])

  const checkAuthState = async () => {
    try {
      setLoading(true)
      const currentUser = await authService.getCurrentUser()
      
      if (currentUser) {
        setUser(currentUser as any)
        // Get user profile
        const userProfile = await authService.getUserProfile(currentUser.$id)
        if (userProfile) {
          setProfile(userProfile as any)
        }
      }
    } catch (error) {
      console.error('Auth state check error:', error)
      setUser(null)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const session = await authService.login(email, password)
      const currentUser = await authService.getCurrentUser()
      
      if (currentUser) {
        setUser(currentUser as any)
        // Get user profile
        const userProfile = await authService.getUserProfile(currentUser.$id)
        if (userProfile) {
          setProfile(userProfile as any)
        }
      }
    } catch (error: any) {
      console.error('Login error:', error)
      setError(error.message || 'Login failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true)
      setError(null)
      
      await authService.register(email, password, name)
      
      // Auto-login after registration
      await login(email, password)
    } catch (error: any) {
      console.error('Registration error:', error)
      setError(error.message || 'Registration failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      setError(null)
      
      await authService.logout()
      setUser(null)
      setProfile(null)
    } catch (error: any) {
      console.error('Logout error:', error)
      setError(error.message || 'Logout failed')
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      setError(null)
      
      if (!user) {
        throw new Error('No user logged in')
      }

      const updatedProfile = await authService.updateUserProfile(user.$id, updates as any)
      if (updatedProfile) {
        setProfile(updatedProfile as any)
      }
    } catch (error: any) {
      console.error('Update profile error:', error)
      setError(error.message || 'Profile update failed')
      throw error
    }
  }

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      if (currentUser) {
        setUser(currentUser as any)
        const userProfile = await authService.getUserProfile(currentUser.$id)
        if (userProfile) {
          setProfile(userProfile as any)
        }
      }
    } catch (error) {
      console.error('Refresh user error:', error)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const value: AuthContextType = {
    user,
    profile,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
    clearError,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
