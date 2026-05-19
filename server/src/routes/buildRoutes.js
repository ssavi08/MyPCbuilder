import { Router } from 'express'
import {
  generateBuild,
  validateUserBuild,
} from '../controllers/buildController.js'

const router = Router()

// POST /api/generate-build
router.post('/generate-build', generateBuild)

// POST /api/validate-build
router.post('/validate-build', validateUserBuild)

export default router