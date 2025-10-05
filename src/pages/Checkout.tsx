import { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { useCartStore } from '../store/cart'
import { supabase } from '../lib/supabase'
import { Header } from '../components/Header'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Checkout() {
  const { items, getTotal } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [guestEmail, setGuestEmail] = useState('')

  useEffect(() => {
    // Get current user session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
  }, [])

  const handleCheckout = async () => {
    setLoading(true)

    try {
      const response = await fetch('http://localhost:3001/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          userEmail: user?.email || guestEmail,
          userId: user?.id || null,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { checkoutUrl } = await response.json()
      
      // Redirect to Stripe checkout
      window.location.href = checkoutUrl

    } catch (error) {
      console.error('Error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add some artwork to your cart before proceeding to checkout.
            </p>
            <Button asChild>
              <Link to="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Shopping
          </Link>
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-16 w-16 rounded object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      ${item.price} × {item.quantity}
                    </p>
                    <p className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span>${getTotal().toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checkout Form */}
          <Card>
            <CardHeader>
              <CardTitle>Checkout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!user && (
                <div className="space-y-4">
                  <h3 className="font-medium">Guest Checkout</h3>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      We'll send your order confirmation to this email.
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <Button variant="link" asChild>
                      <Link to="/auth">Sign in for order tracking</Link>
                    </Button>
                  </div>
                </div>
              )}

              {user && (
                <div className="space-y-2">
                  <h3 className="font-medium">Signed in as:</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="font-medium">Payment</h3>
                <p className="text-sm text-muted-foreground">
                  You'll be redirected to Stripe to complete your secure payment.
                </p>
                
                <Button
                  onClick={handleCheckout}
                  disabled={loading || (!user && !guestEmail)}
                  className="w-full"
                  size="lg"
                >
                  {loading ? 'Processing...' : `Pay $${getTotal().toFixed(2)}`}
                </Button>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Secure payment processing with Stripe</p>
                  <p>• SSL encrypted checkout</p>
                  <p>• 30-day money-back guarantee</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}