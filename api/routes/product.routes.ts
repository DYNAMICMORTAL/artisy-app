import { Router } from 'express'
import { getProducts, getProductById, getFeaturedProducts, getFilterOptions } from '../controllers/product.controller'

const router = Router()

router.get('/', getProducts)
router.get('/featured', getFeaturedProducts)
router.get('/filters', getFilterOptions)
router.get('/:id', getProductById)

export default router
