import { Router } from 'express'
import { signup, login, getUser, refreshToken, logout } from '../controllers/auth.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'

const router = Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/refresh-token', refreshToken)
router.get('/user', authenticate, getUser)
router.post('/logout', logout)

export default router
