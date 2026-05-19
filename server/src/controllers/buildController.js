import {
  buildCandidatePool,
  validatePool,
  validateBuild,
} from '../services/compatibilityService.js'

// ================================
// POST /api/generate-build
// ================================

export async function generateBuild(req, res) {
  try {
    const { useCase, budget } = req.body

    // ---- Input validation ----
    if (!useCase || !budget) {
      return res.status(400).json({
        success: false,
        error: 'useCase and budget are required',
      })
    }

    const validUseCases = ['school', 'work', 'gaming']
    if (!validUseCases.includes(useCase)) {
      return res.status(400).json({
        success: false,
        error: `Invalid useCase. Must be one of: ${validUseCases.join(', ')}`,
      })
    }

    if (budget < 300 || budget > 10000) {
      return res.status(400).json({
        success: false,
        error: 'Budget must be between $300 and $10,000',
      })
    }

    // ---- Step 1: Build candidate pool ----
    console.log(`Generating build for: ${useCase}, $${budget}`)
    const pool = buildCandidatePool(useCase, budget)

    // ---- Step 2: Validate pool has enough options ----
    const poolValidation = validatePool(pool)
    if (!poolValidation.valid) {
      return res.status(400).json({
        success: false,
        error: 'Could not find enough compatible components',
        issues: poolValidation.issues,
        suggestion: 'Try increasing your budget or changing your use case',
      })
    }

    // ---- Step 3: Return pool to frontend ----
    // AI call will be added in Day 7
    // For now return the best option from each category

    const simpleBuild = {
      cpu:         pool.cpus[pool.cpus.length - 1],
      motherboard: pool.motherboards[pool.motherboards.length - 1],
      ram:         pool.rams[pool.rams.length - 1],
      gpu:         pool.gpus[pool.gpus.length - 1],
      storage:     pool.storage[pool.storage.length - 1],
      psu:         pool.psus[pool.psus.length - 1],
      case:        pool.cases[pool.cases.length - 1],
    }

    // ---- Step 4: Validate the selected build ----
    const buildValidation = validateBuild(simpleBuild)

    const totalPrice = Object.values(simpleBuild)
      .reduce((sum, c) => sum + c.price, 0)

    return res.json({
      success: true,
      build: simpleBuild,
      totalPrice,
      withinBudget: totalPrice <= budget,
      compatibility: buildValidation,
      candidatePool: {
        cpus:         pool.cpus.length,
        motherboards: pool.motherboards.length,
        rams:         pool.rams.length,
        gpus:         pool.gpus.length,
        storage:      pool.storage.length,
        psus:         pool.psus.length,
        cases:        pool.cases.length,
      },
      note: 'AI recommendations will be added in next version',
    })

  } catch (error) {
    console.error('generateBuild error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to generate build',
    })
  }
}

// ================================
// POST /api/validate-build
// Validate a user's manual build
// ================================

export function validateUserBuild(req, res) {
  try {
    const { build } = req.body

    if (!build) {
      return res.status(400).json({
        success: false,
        error: 'build object is required',
      })
    }

    const result = validateBuild(build)

    return res.json({
      success: true,
      ...result,
    })

  } catch (error) {
    console.error('validateUserBuild error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to validate build',
    })
  }
}