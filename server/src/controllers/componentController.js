import { components } from '../data/components.js'

// ================================
// GET /api/components?type=cpu
// ================================

export function getComponents(req, res) {
  try {
    const { type, useCase, maxPrice } = req.query

    // Map URL param to data key
    const typeMap = {
      cpu:         'cpus',
      motherboard: 'motherboards',
      ram:         'rams',
      gpu:         'gpus',
      storage:     'storage',
      psu:         'psus',
      case:        'cases',
    }

    // Return ALL categories if no type specified
    if (!type) {
      return res.json({
        success: true,
        data: components,
      })
    }

    const key = typeMap[type.toLowerCase()]

    if (!key) {
      return res.status(400).json({
        success: false,
        error: `Invalid component type: ${type}`,
        validTypes: Object.keys(typeMap),
      })
    }

    let result = [...components[key]]

    // Filter by use case if provided
    if (useCase) {
      result = result.filter(c =>
        c.useCases.includes(useCase.toLowerCase())
      )
    }

    // Filter by max price if provided
    if (maxPrice) {
      result = result.filter(c => c.price <= Number(maxPrice))
    }

    return res.json({
      success: true,
      type,
      count: result.length,
      data: result,
    })

  } catch (error) {
    console.error('getComponents error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch components',
    })
  }
}