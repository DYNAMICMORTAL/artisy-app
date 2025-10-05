import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Header } from '../components/Header'
import { useCartStore } from '../store/cart'
import { supabase } from '../lib/supabase'

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  amount: number
  status: string
  created_at: string
  items: OrderItem[]
  // add other fields if needed
}

export function OrderSuccess() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const { clearCart } = useCartStore()

  useEffect(() => {
    // Clear the cart since order was successful
    clearCart()

    if (sessionId) {
      fetchOrder()
    }
  }, [sessionId])

  const fetchOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('stripe_session_id', sessionId)
        .single()

      if (error) throw error
      setOrder(data)
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
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
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-xl text-muted-foreground">
              Thank you for your purchase. Your order has been successfully processed.
            </p>
          </div>

          {order && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="font-mono text-sm">{order.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="font-bold">₹{order.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="capitalize font-medium text-green-600">{order.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p className="text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Items Ordered</h4>
                  <div className="space-y-2">
                    {order.items.map((item: OrderItem, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.name} × {item.quantity}</span>
                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-6 text-left">
              <h3 className="font-semibold mb-3">What happens next?</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• You'll receive an order confirmation email shortly</p>
                <p>• Your artwork will be carefully prepared for shipping</p>
                <p>• We'll send you tracking information when your order ships</p>
                <p>• Most orders are delivered within 5-7 business days</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link to="/" className="flex items-center gap-2">
                  Continue Shopping
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/orders">View All Orders</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}