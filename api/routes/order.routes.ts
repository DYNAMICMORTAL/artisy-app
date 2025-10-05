import { Router } from 'express'
import { createCheckout, getOrders, getOrderById, getOrderStatus } from '../controllers/order.controller'
import { authenticate, optionalAuth } from '../middleware/auth.middleware'

const router = Router()

router.post('/checkout', createCheckout)
router.get('/', authenticate, getOrders)
router.get('/:id', optionalAuth, getOrderById)
router.get('/:id/status', getOrderStatus)

export default router
