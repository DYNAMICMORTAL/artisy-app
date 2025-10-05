import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Header } from '../components/Header'
import { orderAPI } from '../lib/api'
import { getCurrentUser } from '../lib/auth'

interface OrderItem {
  image_url: string
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  amount: number
  status: string
  items: OrderItem[]
  created_at: string
}

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [error] = useState<string | null>(null)
  // const [setDiagnosticInfo] = useState<Record<string, unknown> | null>(null)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      console.log('Checking user session...')
      const currentUser = getCurrentUser()
      
      console.log('Current user:', currentUser)
      
      if (!currentUser) {
        console.log('No user session found, redirecting to auth')
        // Redirect to auth if not logged in
        window.location.href = '/auth'
        return
      }

      setUser(currentUser)
      await fetchOrders()
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrders = async () => {
    try {
      console.log('Fetching orders from backend API...')
      
      // Fetch orders from backend API
      const response = await orderAPI.getOrders() as {
        success: boolean
        data: Order[]
      }

      console.log('Orders API response:', response)

      if (!response.success) {
        console.error('Error fetching orders from API')
        return
      }
      
      console.log('Orders data:', response.data)
      console.log('Number of orders found:', response.data?.length || 0)
      
      // Parse items if they're stored as JSON string
      const ordersWithParsedItems = (response.data || []).map(order => {
        console.log('Processing order:', order.id, 'Items type:', typeof order.items)
        return {
          ...order,
          items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items
        }
      })
      
      console.log('Parsed orders:', ordersWithParsedItems)
      setOrders(ordersWithParsedItems)
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600'
      case 'pending':
        return 'text-yellow-600'
      case 'cancelled':
        return 'text-red-600'
      default:
        return 'text-muted-foreground'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Gallery
            </Link>
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <Package className="h-6 w-6" />
            <h1 className="text-3xl font-bold">Order History</h1>
          </div>
          <p className="text-muted-foreground">
            View and track all your artwork purchases
          </p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground text-center mb-6">
                When you make your first purchase, it will appear here.
              </p>
              {user && (
                <p className="text-xs text-gray-500 mb-4">
                  User ID: {user.id}
                </p>
              )}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
              <Button asChild>
                <Link to="/">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">₹{order.amount.toFixed(2)}</p>
                      <p className={`text-sm font-medium capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-medium">Items ({order.items.length})</h4>
                    {order.items.map((item: OrderItem, index: number) => (
                      <div key={index} className="flex gap-3 p-3 border rounded-lg">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="h-16 w-16 rounded object-cover"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium">{item.name}</h5>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                          <p className="text-sm font-medium">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {order.status === 'paid' && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        <span className="font-medium">Order confirmed!</span> Your artwork will be carefully prepared and shipped soon.
                      </p>
                    </div>
                  )}
                  
                  {order.status === 'pending' && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <span className="font-medium">Payment processing...</span> Please wait while we confirm your payment.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}