import { Router } from 'express'
import { getProducts, getProductById, getFeaturedProducts, getFilterOptions, semanticSearch, addReview, getReviews } from '../controllers/product.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/', getProducts)
router.get('/featured', getFeaturedProducts)
router.get('/filters', getFilterOptions)
router.post('/semantic-search', semanticSearch)
router.get('/:id', getProductById)
router.post('/:id/reviews', authenticate, addReview)
router.get('/:id/reviews', getReviews)

export default router
