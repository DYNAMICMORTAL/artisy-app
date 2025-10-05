import { Router } from 'express'
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cart.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'

const router = Router()

router.use(authenticate) // All cart routes require authentication

router.get('/', getCart)
router.post('/items', addToCart)
router.put('/items/:id', updateCartItem)
router.delete('/items/:id', removeFromCart)
router.delete('/clear', clearCart)

export default router
