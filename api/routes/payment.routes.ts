import { Router } from 'express'
import { handleWebhook } from '../controllers/payment.controller'

const router = Router()

// Webhook endpoint (raw body is handled in main app.ts)
router.post('/webhook', handleWebhook)

export default router
