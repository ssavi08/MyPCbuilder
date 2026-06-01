import OpenAI from 'openai'
import dotenv from 'dotenv'
import { supabase } from '../lib/supabase.js'
import { validateBuild } from './compatibilityService.js'

dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// ================================
// BUILD THE PROMPT
// ================================

function buildPrompt(useCase, budget, pool, retryErrors = null) {
  const useCaseDescriptions = {
    school: 'studying, online classes, document editing, light multitasking',
    work:   'professional productivity, video calls, multitasking, ' +
            'office software, light creative work',
    gaming: 'gaming at high settings, streaming, fast load times, ' +
            'high frame rates',
  }

  const retryBlock = retryErrors
    ? `\nYOUR PREVIOUS SELECTION WAS INVALID:\n${retryErrors.map(e => `- ${e}`).join('\n')}\nFix these errors. Pick different components that satisfy ALL rules.\n`
    : ''

  return `
You are an expert PC builder. Select the BEST combination of components
from the lists below for the user's needs.

USER REQUIREMENTS:
- Purpose: ${useCase} (${useCaseDescriptions[useCase]})
- Budget: $${budget}
- Priority: MAXIMIZE performance for the stated purpose. Spend as close to $${budget} as possible.
  Do NOT pick cheap components when better ones are available within budget.
  A build that costs $${Math.round(budget * 0.85)}–$${budget} is ideal; leaving more than 20% unspent is wrong.
${retryBlock}
AVAILABLE COMPONENTS (pre-filtered for compatibility and budget):

CPUs:
${pool.cpus.map(c =>
  `  - [${c.id}] ${c.name} | $${c.price} | Socket: ${c.socket} | ` +
  `${c.cores} cores | ${c.boostClockGhz}GHz | ${c.tdp}W TDP`
).join('\n')}

Motherboards:
${pool.motherboards.map(m =>
  `  - [${m.id}] ${m.name} | $${m.price} | ` +
  `Socket: ${m.socket} | ${m.ramType} | ${m.formFactor}`
).join('\n')}

RAM (type must match motherboard ramType):
${pool.rams.map(r =>
  `  - [${r.id}] ${r.name} | $${r.price} | ` +
  `${r.capacityGb}GB ${r.type} ${r.speedMhz}MHz`
).join('\n')}

GPUs:
${pool.gpus.map(g =>
  `  - [${g.id}] ${g.name} | $${g.price} | ` +
  `${g.vramGb}GB VRAM | ${g.tdp}W TDP`
).join('\n')}

Storage:
${pool.storage.map(s =>
  `  - [${s.id}] ${s.name} | $${s.price} | ` +
  `${s.capacityGb}GB ${s.type}`
).join('\n')}

PSUs:
${pool.psus.map(p =>
  `  - [${p.id}] ${p.name} | $${p.price} | ` +
  `${p.wattage}W | ${p.efficiency}`
).join('\n')}

Cases:
${pool.cases.map(c =>
  `  - [${c.id}] ${c.name} | $${c.price} | ` +
  `Fits: ${Array.isArray(c.formFactorSupport) ? c.formFactorSupport.join('/') : c.formFactor}`
).join('\n')}

HARD RULES (violations are not acceptable):
1. CPU socket MUST exactly match motherboard socket (e.g. AM5 CPU → AM5 motherboard)
2. RAM type MUST match motherboard ramType (e.g. DDR5 motherboard → DDR5 RAM)
3. PSU wattage MUST be > CPU TDP + GPU TDP + 100W
4. Total price MUST NOT exceed $${budget}
5. Maximize performance for ${useCase} — spend as much of $${budget} as possible on the best available parts

Respond ONLY with valid JSON — no markdown, no extra text:
{
  "selectedIds": {
    "cpu": "cpu-id-here",
    "motherboard": "mb-id-here",
    "ram": "ram-id-here",
    "gpu": "gpu-id-here",
    "storage": "ssd-id-here",
    "psu": "psu-id-here",
    "case": "case-id-here"
  },
  "explanation": {
    "summary": "2-3 sentence overview of this build and why it suits the stated purpose",
    "tradeoffs": "2-3 sentences on budget allocation decisions — what was prioritized and why, what was de-prioritized and the cost of that choice, and the overall philosophy of this build for the given use case",
    "cpu": "1 sentence: why this CPU over the other CPU options listed",
    "motherboard": "1 sentence: why this motherboard over the others",
    "ram": "1 sentence: why this RAM over the others",
    "gpu": "1 sentence: why this GPU over the other GPU options listed",
    "storage": "1 sentence: why this storage over the others",
    "psu": "1 sentence: why this PSU over the others",
    "case": "1 sentence: why this case over the others"
  },
  "performanceRating": {
    "overall": 8,
    "gaming": 7,
    "productivity": 9,
    "value": 8
  }
}
`
}

// ================================
// PARSE AI RESPONSE
// ================================

function parseAIResponse(content) {
  try {
    return JSON.parse(content)
  } catch {
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
    if (jsonMatch) return JSON.parse(jsonMatch[1])

    const objectMatch = content.match(/\{[\s\S]*\}/)
    if (objectMatch) return JSON.parse(objectMatch[0])

    throw new Error('Could not parse AI response as JSON')
  }
}

// ================================
// RESOLVE IDs TO FULL OBJECTS
// ================================

function resolveComponents(selectedIds, pool) {
  const allItems = [
    ...pool.cpus,
    ...pool.motherboards,
    ...pool.rams,
    ...pool.gpus,
    ...pool.storage,
    ...pool.psus,
    ...pool.cases,
  ]

  const resolved = {}
  for (const [category, id] of Object.entries(selectedIds)) {
    const component = allItems.find(item => item.id === id)
    if (!component) {
      throw new Error(`AI selected unknown component ID: ${id} for ${category}`)
    }
    resolved[category] = component
  }
  return resolved
}

// ================================
// CALL OPENAI
// ================================

async function callOpenAI(prompt) {
  const completion = await openai.chat.completions.create({
    model:       'gpt-4o-mini',
    messages: [
      {
        role:    'system',
        content: 'You are a PC building expert. Always respond with valid JSON only. ' +
                 'No markdown, no explanation outside the JSON.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.2,
    max_tokens:  1200,
  })
  return completion.choices[0].message.content
}

// ================================
// MAIN AI BUILD GENERATOR
// ================================

export async function generateAIBuild(useCase, budget, pool) {
  console.log('🤖 Calling OpenAI API...')

  // First attempt
  const raw = await callOpenAI(buildPrompt(useCase, budget, pool))
  console.log('✅ OpenAI responded')
  let parsed = parseAIResponse(raw)

  // Quick compatibility check — retry once with error feedback if it fails
  try {
    const firstBuild = resolveComponents(parsed.selectedIds, pool)
    const check = validateBuild(firstBuild)

    if (!check.valid) {
      console.warn('⚠️  First pick incompatible, retrying with errors:', check.errors)
      const retryRaw = await callOpenAI(buildPrompt(useCase, budget, pool, check.errors))
      console.log('✅ Retry responded')
      parsed = parseAIResponse(retryRaw)
    }
  } catch {
    // resolveComponents threw (unknown ID) — let controller's validateBuild handle it
  }

  // Resolve final IDs to full objects
  const resolvedBuild = resolveComponents(parsed.selectedIds, pool)

  // Re-fetch model_url for the 7 chosen parts only
  const chosenIds = Object.values(resolvedBuild).map(c => c.id)
  const { data: urlRows } = await supabase
    .from('components')
    .select('id, model_url')
    .in('id', chosenIds)

  if (urlRows) {
    const urlMap = Object.fromEntries(urlRows.map(r => [r.id, r.model_url ?? '']))
    for (const comp of Object.values(resolvedBuild)) {
      comp.model_url = urlMap[comp.id] ?? ''
    }
  }

  return {
    build:             resolvedBuild,
    explanation:       parsed.explanation,
    performanceRating: parsed.performanceRating,
  }
}
