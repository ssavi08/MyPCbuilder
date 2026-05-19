const BASE_URL = 'http://localhost:3001/api'

// ================================
// HELPER
// ================================

async function request(path, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Request failed')
    }

    return data

  } catch (error) {
    console.error(`API Error [${path}]:`, error.message)
    throw error
  }
}

// ================================
// COMPONENT ENDPOINTS
// ================================

export const componentAPI = {
  getAll: () =>
    request('/components'),

  getByType: (type, filters = {}) => {
    const params = new URLSearchParams({ type, ...filters })
    return request(`/components?${params}`)
  },
}

// ================================
// BUILD ENDPOINTS
// ================================

export const buildAPI = {
  generate: (useCase, budget) =>
    request('/generate-build', {
      method: 'POST',
      body: JSON.stringify({ useCase, budget }),
    }),

  validate: (build) =>
    request('/validate-build', {
      method: 'POST',
      body: JSON.stringify({ build }),
    }),
}

// ================================
// HEALTH CHECK
// ================================

export const healthAPI = {
  check: () => request('/health'),
}