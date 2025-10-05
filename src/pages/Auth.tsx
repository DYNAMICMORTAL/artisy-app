import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { authAPI } from '../lib/api'

export function Auth() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      if (isSignUp) {
        await authAPI.signup(email, password)
        setMessage('Account created successfully! Please sign in.')
        setIsSignUp(false)
        setEmail('')
        setPassword('')
      } else {
        const response = await authAPI.login(email, password) as {
          success: boolean
          data: {
            user: { id: string; email: string }
            session: { access_token: string; refresh_token: string; expires_at: number }
          }
        }
        
        if (response.success) {
          // Store auth token and user info in localStorage
          localStorage.setItem('sb-oumhpjuzkubfieowkjxe-auth-token', JSON.stringify({
            access_token: response.data.session.access_token,
            refresh_token: response.data.session.refresh_token,
            expires_at: response.data.session.expires_at,
            user: response.data.user
          }))
          
          // Redirect to home page on successful login
          window.location.href = '/'
        } else {
          setError('Login failed. Please try again.')
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </CardTitle>
          <CardDescription>
            {isSignUp 
              ? 'Create an account to track your orders and save favorites'
              : 'Sign in to your account to view orders and continue shopping'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            {error && (
              <div className="text-destructive text-sm bg-destructive/10 p-2 rounded">
                {error}
              </div>
            )}

            {message && (
              <div className="text-green-600 text-sm bg-green-50 p-2 rounded">
                {message}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <div className="text-sm text-muted-foreground">or</div>
            <Button
              variant="ghost"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Create one"
              }
            </Button>
          </div>

          <div className="mt-4 text-center">
            <Button variant="link" asChild>
              <a href="/">Continue as Guest</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}