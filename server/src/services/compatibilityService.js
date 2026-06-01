import { supabase } from '../lib/supabase.js'
import { flattenComponent } from '../lib/flattenComponent.js'

// ================================
// MAIN COMPATIBILITY CHECKER
// Validates a complete or partial build
// Returns { valid, errors, warnings }
// ================================

export function validateBuild(build) {
  const errors = []
  const warnings = []

  const { cpu, motherboard, ram, gpu, psu } = build

  // ---- CPU + Motherboard socket ----
  if (cpu && motherboard) {
    if (cpu.socket !== motherboard.socket) {
      errors.push(
        `CPU socket ${cpu.socket} is not compatible with ` +
        `motherboard socket ${motherboard.socket}`
      )
    }
  }

  // ---- Motherboard + RAM type ----
  if (motherboard && ram) {
    if (motherboard.ramType !== ram.type) {
      errors.push(
        `Motherboard requires ${motherboard.ramType} ` +
        `but selected RAM is ${ram.type}`
      )
    }
  }

  // ---- PSU wattage check ----
  if (psu && cpu && gpu) {
    const requiredWatts = cpu.tdp + gpu.tdp + 100 // +100W headroom
    if (psu.wattage < requiredWatts) {
      errors.push(
        `PSU (${psu.wattage}W) is insufficient. ` +
        `CPU + GPU require ~${requiredWatts}W`
      )
    }
  }

  // ---- PSU wattage warning (headroom) ----
  if (psu && cpu && gpu) {
    const requiredWatts = cpu.tdp + gpu.tdp + 100
    const headroom = psu.wattage - requiredWatts
    if (headroom < 50) {
      warnings.push(
        `PSU headroom is tight (${headroom}W). ` +
        `Consider a higher wattage PSU.`
      )
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

// ================================
// CANDIDATE POOL BUILDER
// Fetches catalog from Supabase,
// filters for compatible options,
// then hands the shortlist to AI.
// ================================

export async function buildCandidatePool(useCase, budget) {
  const { data, error } = await supabase
    .from('components')
    .select('id, slot, name, brand, price, specs')
  if (error) throw new Error('Failed to fetch components: ' + error.message)

  const all = data.map(flattenComponent)

  const pool = {}

  // ---- CPUs ----
  pool.cpus = all.filter(c =>
    c.slot === 'cpu' &&
    c.useCases.includes(useCase) &&
    c.price <= budget
  )

  // ---- Motherboards ----
  pool.motherboards = all.filter(mb =>
    mb.slot === 'motherboard' &&
    mb.useCases.includes(useCase) &&
    mb.price <= budget
  )

  // ---- Filter motherboards by sockets available in CPU pool ----
  const availableSockets = [...new Set(pool.cpus.map(c => c.socket))]
  pool.motherboards = pool.motherboards.filter(mb =>
    availableSockets.includes(mb.socket)
  )

  // ---- Filter RAMs compatible with remaining motherboards ----
  const availableRamTypes = [...new Set(pool.motherboards.map(mb => mb.ramType))]
  pool.rams = all.filter(r =>
    r.slot === 'ram' &&
    r.useCases.includes(useCase) &&
    r.price <= budget &&
    availableRamTypes.includes(r.type)
  )

  // ---- GPUs ----
  pool.gpus = all.filter(g =>
    g.slot === 'gpu' &&
    g.useCases.includes(useCase) &&
    g.price <= budget
  )

  // ---- Storage ----
  pool.storage = all.filter(s =>
    s.slot === 'storage' &&
    s.useCases.includes(useCase) &&
    s.price <= budget
  )

  // ---- PSUs (must cover worst-case TDP in the pool) ----
  const maxCpuTdp = Math.max(...pool.cpus.map(c => c.tdp ?? 0), 0)
  const maxGpuTdp = Math.max(...pool.gpus.map(g => g.tdp ?? 0), 0)
  const minWatts  = maxCpuTdp + maxGpuTdp + 100

  pool.psus = all.filter(p =>
    p.slot === 'psu' &&
    p.useCases.includes(useCase) &&
    p.price <= budget &&
    p.wattage >= minWatts
  )

  // ---- Cases ----
  pool.cases = all.filter(c =>
    c.slot === 'case' &&
    c.useCases.includes(useCase) &&
    c.price <= budget
  )

  return pool
}

// ================================
// POOL SUMMARY
// Checks if pool has enough
// components to build something
// ================================

export function validatePool(pool) {
  const issues = []

  if (!pool.cpus?.length)         issues.push('No compatible CPUs found')
  if (!pool.motherboards?.length) issues.push('No compatible motherboards found')
  if (!pool.rams?.length)         issues.push('No compatible RAM found')
  if (!pool.gpus?.length)         issues.push('No compatible GPUs found')
  if (!pool.storage?.length)      issues.push('No compatible storage found')
  if (!pool.psus?.length)         issues.push('No compatible PSUs found')
  if (!pool.cases?.length)        issues.push('No compatible cases found')

  return {
    valid: issues.length === 0,
    issues,
  }
}
