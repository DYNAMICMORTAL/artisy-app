import { Response } from 'express'
import { AuthRequest } from '../types/index.js'
import { supabaseAdmin } from '../config/supabase.js'

// Sign up
export const signup = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, name } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name }
    })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json({
      success: true,
      message: 'User created successfully',
      data: {
        user: {
          id: data.user.id,
          email: data.user.email
        }
      }
    })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({ error: 'Signup failed' })
  }
}

// Sign in
export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    res.json({
      success: true,
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          user_metadata: data.user.user_metadata
        },
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at
        }
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
}

// Get current user
export const getUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const { data, error } = await supabaseAdmin.auth.admin.getUserById(req.user.id)

    if (error || !data.user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      success: true,
      data: {
        id: data.user.id,
        email: data.user.email,
        user_metadata: data.user.user_metadata,
        created_at: data.user.created_at
      }
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Failed to get user' })
  }
}

// Refresh token
export const refreshToken = async (req: AuthRequest, res: Response) => {
  try {
    const { refresh_token } = req.body

    if (!refresh_token) {
      return res.status(400).json({ error: 'Refresh token is required' })
    }

    const { data, error } = await supabaseAdmin.auth.refreshSession({
      refresh_token
    })

    if (error) {
      return res.status(401).json({ error: 'Invalid refresh token' })
    }

    res.json({
      success: true,
      data: {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
        expires_at: data.session?.expires_at
      }
    })
  } catch (error) {
    console.error('Refresh token error:', error)
    res.status(500).json({ error: 'Failed to refresh token' })
  }
}

// Logout
export const logout = async (req: AuthRequest, res: Response) => {
  try {
    const authHeader = req.headers?.authorization
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      await supabaseAdmin.auth.admin.signOut(token)
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({ error: 'Logout failed' })
  }
}
