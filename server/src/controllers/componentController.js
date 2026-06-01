import { supabase } from '../lib/supabase.js'
import { flattenComponent } from '../lib/flattenComponent.js'

const validTypes = ['cpu', 'motherboard', 'ram', 'gpu', 'storage', 'psu', 'case']

// ================================
// GET /api/components?type=cpu
// ================================

export async function getComponents(req, res) {
  try {
    const { type, useCase, maxPrice } = req.query

    if (type && !validTypes.includes(type.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: `Invalid component type: ${type}`,
        validTypes,
      })
    }

    let query = supabase.from('components').select('*')
    if (type)     query = query.eq('slot', type.toLowerCase())
    if (maxPrice) query = query.lte('price', Number(maxPrice))

    const { data, error } = await query
    if (error) throw error

    let result = data.map(flattenComponent)

    // useCases lives inside specs (jsonb), filter in JS after fetch
    if (useCase) {
      result = result.filter(c => c.useCases.includes(useCase.toLowerCase()))
    }

    return res.json({
      success: true,
      type: type || 'all',
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
