// API Client for Artisy App Backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Helper to get auth token
const getAuthToken = () => {
  // Get token from localStorage (set by Supabase auth)
  const supabaseAuth = localStorage.getItem('sb-oumhpjuzkubfieowkjxe-auth-token')
  if (supabaseAuth) {
    try {
      const parsed = JSON.parse(supabaseAuth)
      return parsed.access_token
    } catch {
      return null
    }
  }
  return null
}

// Generic fetch wrapper
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken()
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || error.message || 'Request failed')
  }

  return response.json()
}

// Auth API
export const authAPI = {
  signup: (email: string, password: string, name?: string) =>
    apiFetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),

  login: (email: string, password: string) =>
    apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getUser: () => apiFetch('/api/auth/user'),

  refreshToken: (refresh_token: string) =>
    apiFetch('/api/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refresh_token }),
    }),

  logout: () => apiFetch('/api/auth/logout', { method: 'POST' }),
}

// Product API
export const productAPI = {
  getProducts: (params?: Record<string, string | number>) => {
    const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ''
    return apiFetch(`/api/products${queryString}`)
  },

  getProductById: (id: number) => apiFetch(`/api/products/${id}`),

  getFeatured: (limit = 4) => apiFetch(`/api/products/featured?limit=${limit}`),

  getFilters: () => apiFetch('/api/products/filters'),

  semanticSearch: (query: string, limit = 20) =>
    apiFetch('/api/products/semantic-search', {
      method: 'POST',
      body: JSON.stringify({ query, limit }),
    }),

  addReview: (productId: number, rating: number, review_text?: string) =>
    apiFetch(`/api/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify({ rating, review_text }),
    }),

  getReviews: (productId: number, limit = 20, offset = 0) =>
    apiFetch(`/api/products/${productId}/reviews?limit=${limit}&offset=${offset}`),
}

// Cart API
export const cartAPI = {
  getCart: () => apiFetch('/api/cart'),

  addItem: (product_id: number, quantity = 1) =>
    apiFetch('/api/cart/items', {
      method: 'POST',
      body: JSON.stringify({ product_id, quantity }),
    }),

  updateItem: (id: number, quantity: number) =>
    apiFetch(`/api/cart/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),

  removeItem: (id: number) =>
    apiFetch(`/api/cart/items/${id}`, { method: 'DELETE' }),

  clearCart: () => apiFetch('/api/cart/clear', { method: 'DELETE' }),
}

// Wishlist API
export const wishlistAPI = {
  getWishlist: () => apiFetch('/api/wishlist'),

  addItem: (product_id: number) =>
    apiFetch('/api/wishlist/items', {
      method: 'POST',
      body: JSON.stringify({ product_id }),
    }),

  removeItem: (product_id: number) =>
    apiFetch(`/api/wishlist/items/${product_id}`, { method: 'DELETE' }),

  checkItem: (productId: number) =>
    apiFetch(`/api/wishlist/check/${productId}`),
}

// Order API
export const orderAPI = {
  createCheckout: (items: unknown[], userEmail: string, userId?: string) =>
    apiFetch('/api/orders/checkout', {
      method: 'POST',
      body: JSON.stringify({ items, userEmail, userId }),
    }),

  getOrders: () => apiFetch('/api/orders'),

  getOrderById: (id: string) => apiFetch(`/api/orders/${id}`),

  getOrderStatus: (id: string) => apiFetch(`/api/orders/${id}/status`),
}

export default {
  auth: authAPI,
  products: productAPI,
  cart: cartAPI,
  wishlist: wishlistAPI,
  orders: orderAPI,
}
