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
      throw new Error(data.error || `Request failed: ${response.status}`)
    }

    return data

  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error(
        'Cannot connect to backend. Is the server running on port 3001?'
      )
    }
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

export const healthAPI = {
  check: () => request('/health'),
}