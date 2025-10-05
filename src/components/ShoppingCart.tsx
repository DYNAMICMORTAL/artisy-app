import { X, Plus, Minus, ShoppingBag } from 'lucide-react'
import { Button } from './ui/button'
import { useCartStore } from '../store/cart'

interface ShoppingCartProps {
  isOpen: boolean
  onClose: () => void
  onCheckout: () => void
}

export function ShoppingCart({ isOpen, onClose, onCheckout }: ShoppingCartProps) {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl animate-slide-in-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-5 w-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">
                Shopping Cart
              </h2>
              <span className="bg-gray-900 text-white text-xs px-2 py-1 rounded-full">
                {items.length}
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-gray-200">
              <X className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <ShoppingBag className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">Your cart is empty</p>
                <p className="text-sm text-gray-500 mt-2">Add some beautiful artworks to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 truncate">{item.name}</h4>
                      <p className="text-sm text-gray-600 font-medium">₹{item.price.toLocaleString()}</p>
                      
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 ml-auto text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeItem(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {items.length > 0 && (
            <div className="border-t border-gray-100 p-6 bg-gray-50 space-y-4">
              <div className="flex justify-between items-center text-lg font-semibold text-gray-900">
                <span>Total:</span>
                <span>₹{getTotal().toLocaleString()}</span>
              </div>
              
              <div className="space-y-3">
                <Button onClick={onCheckout} className="w-full h-12 text-base font-medium">
                  Proceed to Checkout
                </Button>
                <Button 
                  variant="outline" 
                  onClick={clearCart} 
                  className="w-full h-10 text-sm"
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}