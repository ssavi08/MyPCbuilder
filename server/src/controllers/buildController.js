import {
  buildCandidatePool,
  validatePool,
  validateBuild,
} from '../services/compatibilityService.js'
import { generateAIBuild } from '../services/aiService.js'

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
        error: `Invalid useCase. Must be: ${validUseCases.join(', ')}`,
      })
    }

    if (budget < 300 || budget > 10000) {
      return res.status(400).json({
        success: false,
        error: 'Budget must be between $300 and $10,000',
      })
    }

    // ---- Step 1: Build candidate pool ----
    console.log(`\n🔧 Building for: ${useCase} | $${budget}`)
    const pool = await buildCandidatePool(useCase, budget)

    // ---- Step 2: Validate pool ----
    const poolValidation = validatePool(pool)
    if (!poolValidation.valid) {
      return res.status(400).json({
        success: false,
        error: 'Not enough compatible components for this budget',
        issues: poolValidation.issues,
        suggestion: 'Try increasing your budget or changing use case',
      })
    }

    console.log(`✅ Pool ready:`, Object.entries(pool)
      .map(([k, v]) => `${k}:${v.length}`)
      .join(' | ')
    )

    // ---- Step 3: Call OpenAI ----
    const aiResult = await generateAIBuild(useCase, budget, pool)

    // ---- Step 4: Validate the AI's build ----
    const buildValidation = validateBuild(aiResult.build)

    if (!buildValidation.valid) {
      console.warn('⚠️ AI returned incompatible build:', buildValidation.errors)

      // Fallback: pick best items manually
      const fallbackBuild = {
        cpu:         pool.cpus.at(-1),
        motherboard: pool.motherboards.at(-1),
        ram:         pool.rams.at(-1),
        gpu:         pool.gpus.at(-1),
        storage:     pool.storage.at(-1),
        psu:         pool.psus.at(-1),
        case:        pool.cases.at(-1),
      }

      const fallbackValidation = validateBuild(fallbackBuild)
      const totalPrice = Object.values(fallbackBuild)
        .reduce((sum, c) => sum + c.price, 0)

      return res.json({
        success: true,
        build: fallbackBuild,
        totalPrice,
        withinBudget: totalPrice <= budget,
        compatibility: fallbackValidation,
        explanation: {
          summary:
            'AI recommendation had compatibility issues. ' +
            'This is an automatically selected fallback build.',
        },
        performanceRating: null,
        source: 'fallback',
      })
    }

    // ---- Step 5: Calculate total ----
    const totalPrice = Object.values(aiResult.build)
      .reduce((sum, c) => sum + c.price, 0)

    console.log(`💰 Total: $${totalPrice} / $${budget}`)
    console.log(`✅ Build valid: ${buildValidation.valid}`)

    return res.json({
      success: true,
      build: aiResult.build,
      totalPrice,
      withinBudget: totalPrice <= budget,
      compatibility: buildValidation,
      explanation: aiResult.explanation,
      performanceRating: aiResult.performanceRating,
      source: 'ai',
    })

  } catch (error) {
    console.error('❌ generateBuild error:', error.message)

    // Handle OpenAI specific errors
    if (error.message?.includes('API key')) {
      return res.status(500).json({
        success: false,
        error: 'OpenAI API key is missing or invalid',
        hint: 'Check your server/.env file',
      })
    }

    if (error.message?.includes('quota')) {
      return res.status(500).json({
        success: false,
        error: 'OpenAI API quota exceeded',
        hint: 'Check your OpenAI usage at platform.openai.com',
      })
    }

    return res.status(500).json({
      success: false,
      error: 'Failed to generate build',
      details: error.message,
    })
  }
}

// ================================
// POST /api/validate-build
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