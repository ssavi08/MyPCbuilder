import { Router } from 'express'
import { getComponents } from '../controllers/componentController.js'

const router = Router()

// GET /api/components
// GET /api/components?type=cpu
// GET /api/components?type=gpu&useCase=gaming&maxPrice=500
router.get('/', getComponents)

export default router