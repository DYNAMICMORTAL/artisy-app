import { Request } from 'express'

// Auth Types
export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role?: string
  }
}

// Product Types
export interface Product {
  id: number
  name: string
  description: string
  price: number
  original_price?: number
  image_url: string
  category: string
  subcategory?: string
  tags?: string[]
  artist_name?: string
  origin_state?: string
  art_form?: string
  material?: string
  dimensions?: string
  is_featured?: boolean
  is_handmade?: boolean
  stock_quantity?: number
  rating?: number
  review_count?: number
  created_at?: string
  updated_at?: string
}

// Cart Types
export interface CartItem {
  id: number
  name: string
  price: number
  image_url: string
  quantity: number
}

export interface Cart {
  id: string
  user_id: string
  items: CartItem[]
  created_at: string
  updated_at: string
}

// Order Types
export interface Order {
  id: string
  user_id: string | null
  stripe_session_id: string
  amount: number
  status: 'pending' | 'paid' | 'cancelled' | 'refunded'
  items: CartItem[]
  shipping_address?: Record<string, unknown>
  created_at: string
  updated_at: string
}

// Wishlist Types
export interface WishlistItem {
  id: string
  user_id: string
  product_id: number
  created_at: string
}

// Search/Filter Types
export interface SearchFilters {
  category?: string
  subcategory?: string
  art_form?: string
  state?: string
  minPrice?: number
  maxPrice?: number
  is_featured?: boolean
  is_handmade?: boolean
}

export interface SearchOptions {
  query?: string
  filters?: SearchFilters
  sortBy?: 'featured' | 'price_asc' | 'price_desc' | 'newest' | 'rating'
  limit?: number
  offset?: number
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}
