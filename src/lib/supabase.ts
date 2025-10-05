import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
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
}

export interface Order {
  id: string
  user_id: string | null
  stripe_session_id: string
  amount: number
  status: 'pending' | 'paid' | 'cancelled'
  items: CartItem[]
  created_at: string
}

export interface CartItem {
  id: number
  name: string
  price: number
  image_url: string
  quantity: number
}