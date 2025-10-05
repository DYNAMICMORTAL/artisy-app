import { Router } from 'express'
import { getWishlist, addToWishlist, removeFromWishlist, checkWishlist } from '../controllers/wishlist.controller'
import { authenticate, optionalAuth } from '../middleware/auth.middleware'

const router = Router()

router.get('/', authenticate, getWishlist)
router.post('/items', authenticate, addToWishlist)
router.delete('/items/:id', authenticate, removeFromWishlist)
router.get('/check/:productId', optionalAuth, checkWishlist)

export default router
