import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// ================================
// BUILD THE PROMPT
// Sends filtered pool to OpenAI
// ================================

function buildPrompt(useCase, budget, pool) {
  const useCaseDescriptions = {
    school: 'studying, online classes, document editing, light multitasking',
    work:   'professional productivity, video calls, multitasking, ' +
            'office software, light creative work',
    gaming: 'gaming at high settings, streaming, fast load times, ' +
            'high frame rates',
  }

  return `
You are an expert PC builder. Your job is to select the BEST combination
of components from the provided lists for the user's needs.

USER REQUIREMENTS:
- Purpose: ${useCase} (${useCaseDescriptions[useCase]})
- Budget: $${budget}
- Priority: Best performance within budget for the stated purpose

AVAILABLE COMPONENTS (pre-filtered for compatibility and budget):

CPUs:
${pool.cpus.map(c =>
  `  - [${c.id}] ${c.name} | $${c.price} | ` +
  `${c.cores} cores | ${c.boostClockGHz}GHz | ${c.tdpW}W TDP`
).join('\n')}

Motherboards:
${pool.motherboards.map(m =>
  `  - [${m.id}] ${m.name} | $${m.price} | ` +
  `Socket: ${m.socket} | ${m.ramType} | ${m.formFactor}`
).join('\n')}

RAM:
${pool.rams.map(r =>
  `  - [${r.id}] ${r.name} | $${r.price} | ` +
  `${r.capacityGB}GB ${r.type} ${r.speedMHz}MHz`
).join('\n')}

GPUs:
${pool.gpus.map(g =>
  `  - [${g.id}] ${g.name} | $${g.price} | ` +
  `${g.vramGB}GB VRAM | ${g.tdpW}W TDP`
).join('\n')}

Storage:
${pool.storage.map(s =>
  `  - [${s.id}] ${s.name} | $${s.price} | ` +
  `${s.capacityGB}GB ${s.type}`
).join('\n')}

PSUs:
${pool.psus.map(p =>
  `  - [${p.id}] ${p.name} | $${p.price} | ` +
  `${p.wattage}W | ${p.efficiency}`
).join('\n')}

Cases:
${pool.cases.map(c =>
  `  - [${c.id}] ${c.name} | $${c.price} | ${c.formFactor}`
).join('\n')}

RULES:
1. CPU socket MUST match motherboard socket
2. RAM type MUST match motherboard RAM type
3. PSU wattage MUST exceed CPU TDP + GPU TDP + 100W
4. Total price MUST NOT exceed $${budget}
5. Choose components that give best value for ${useCase}

Respond ONLY with a valid JSON object in this exact format:
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
    "summary": "2-3 sentence overview of this build",
    "cpu": "Why this CPU was chosen",
    "motherboard": "Why this motherboard was chosen",
    "ram": "Why this RAM was chosen",
    "gpu": "Why this GPU was chosen",
    "storage": "Why this storage was chosen",
    "psu": "Why this PSU was chosen",
    "case": "Why this case was chosen"
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
// Extract JSON from OpenAI reply
// ================================

function parseAIResponse(content) {
  try {
    // Try direct parse first
    return JSON.parse(content)
  } catch {
    // Extract JSON from markdown code blocks
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1])
    }

    // Extract raw JSON object
    const objectMatch = content.match(/\{[\s\S]*\}/)
    if (objectMatch) {
      return JSON.parse(objectMatch[0])
    }

    throw new Error('Could not parse AI response as JSON')
  }
}

// ================================
// RESOLVE IDs TO FULL OBJECTS
// AI returns IDs, we return full data
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
      throw new Error(
        `AI selected unknown component ID: ${id} for ${category}`
      )
    }
    resolved[category] = component
  }

  return resolved
}

// ================================
// MAIN AI BUILD GENERATOR
// ================================

export async function generateAIBuild(useCase, budget, pool) {
  console.log('🤖 Calling OpenAI API...')

  const prompt = buildPrompt(useCase, budget, pool)

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content:
          'You are a PC building expert. Always respond with valid JSON only. ' +
          'No markdown, no explanation outside the JSON.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.3,   // Low temp = consistent, logical choices
    max_tokens: 1000,
  })

  const rawContent = completion.choices[0].message.content
  console.log('✅ OpenAI responded')

  // Parse the JSON response
  const parsed = parseAIResponse(rawContent)

  // Resolve IDs to full component objects
  const resolvedBuild = resolveComponents(parsed.selectedIds, pool)

  return {
    build: resolvedBuild,
    explanation: parsed.explanation,
    performanceRating: parsed.performanceRating,
  }
}