import { components } from '../data/components.js'

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
    const requiredWatts = cpu.tdpW + gpu.tdpW + 100 // +100W headroom
    if (psu.wattage < requiredWatts) {
      errors.push(
        `PSU (${psu.wattage}W) is insufficient. ` +
        `CPU + GPU require ~${requiredWatts}W`
      )
    }
  }

  // ---- PSU wattage warning (headroom) ----
  if (psu && cpu && gpu) {
    const requiredWatts = cpu.tdpW + gpu.tdpW + 100
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
// Filters components for AI
// Only sends compatible options
// ================================

export function buildCandidatePool(useCase, budget) {

  // Budget allocation percentages per category
  const allocation = {
    cpu:         0.20,
    motherboard: 0.15,
    ram:         0.10,
    gpu:         0.30,
    storage:     0.08,
    psu:         0.08,
    case:        0.09,
  }

  const pool = {}

  // ---- CPUs ----
  pool.cpus = components.cpus.filter(c =>
    c.useCases.includes(useCase) &&
    c.price <= budget * allocation.cpu * 1.5
  )

  // ---- Motherboards ----
  pool.motherboards = components.motherboards.filter(mb =>
    mb.useCases.includes(useCase) &&
    mb.price <= budget * allocation.motherboard * 1.5
  )

  // ---- Now filter motherboards compatible with
  //      available CPUs (socket matching) ----
  const availableSockets = [...new Set(pool.cpus.map(c => c.socket))]
  pool.motherboards = pool.motherboards.filter(mb =>
    availableSockets.includes(mb.socket)
  )

  // ---- Filter RAMs compatible with motherboards ----
  const availableRamTypes = [...new Set(
    pool.motherboards.map(mb => mb.ramType)
  )]
  pool.rams = components.rams.filter(r =>
    r.useCases.includes(useCase) &&
    r.price <= budget * allocation.ram * 1.5 &&
    availableRamTypes.includes(r.type)
  )

  // ---- GPUs ----
  pool.gpus = components.gpus.filter(g =>
    g.useCases.includes(useCase) &&
    g.price <= budget * allocation.gpu * 1.5
  )

  // ---- Storage ----
  pool.storage = components.storage.filter(s =>
    s.useCases.includes(useCase) &&
    s.price <= budget * allocation.storage * 1.5
  )

  // ---- PSUs (must cover max possible TDP) ----
  const maxCpuTdp = Math.max(...pool.cpus.map(c => c.tdpW), 0)
  const maxGpuTdp = Math.max(...pool.gpus.map(g => g.tdpW), 0)
  const minWatts = maxCpuTdp + maxGpuTdp + 100

  pool.psus = components.psus.filter(p =>
    p.useCases.includes(useCase) &&
    p.price <= budget * allocation.psu * 1.5 &&
    p.wattage >= minWatts
  )

  // ---- Cases ----
  pool.cases = components.cases.filter(c =>
    c.useCases.includes(useCase) &&
    c.price <= budget * allocation.case * 1.5
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