// Auth utility functions for frontend
// These replace direct Supabase auth calls with localStorage-based auth

export interface User {
  id: string
  email: string
  user_metadata?: Record<string, unknown>
}

export interface AuthData {
  access_token: string
  refresh_token?: string
  expires_at?: number
  user: User
}

// Get current user from localStorage
export function getCurrentUser(): User | null {
  try {
    const authData = localStorage.getItem('sb-oumhpjuzkubfieowkjxe-auth-token')
    if (!authData) return null
    
    const parsed: AuthData = JSON.parse(authData)
    return parsed.user ?? null
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Get auth token from localStorage
export function getAuthToken(): string | null {
  try {
    const authData = localStorage.getItem('sb-oumhpjuzkubfieowkjxe-auth-token')
    if (!authData) return null
    
    const parsed: AuthData = JSON.parse(authData)
    return parsed.access_token ?? null
  } catch (error) {
    console.error('Error getting auth token:', error)
    return null
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

// Sign out (clear localStorage)
export function signOut(): void {
  localStorage.removeItem('sb-oumhpjuzkubfieowkjxe-auth-token')
  window.location.href = '/'
}

// Set auth data (after login)
export function setAuthData(data: AuthData): void {
  localStorage.setItem('sb-oumhpjuzkubfieowkjxe-auth-token', JSON.stringify(data))
}

// Listen for auth changes (for cross-tab sync)
export function onAuthChange(callback: (user: User | null) => void): () => void {
  const handleStorageChange = () => {
    callback(getCurrentUser())
  }
  
  window.addEventListener('storage', handleStorageChange)
  
  // Return cleanup function
  return () => {
    window.removeEventListener('storage', handleStorageChange)
  }
}
