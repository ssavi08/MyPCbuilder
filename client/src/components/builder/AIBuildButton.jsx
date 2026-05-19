import { useState } from 'react'
import { buildAPI } from '../../services/api'
import useStore from '../../store/useStore'
import './AIBuildButton.css'

export default function AIBuildButton() {
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const {
    useCase,
    budget,
    selectComponent,
    clearAllComponents,
  } = useStore()

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    clearAllComponents()

    try {
      const result = await buildAPI.generate(useCase, budget)

      if (!result.success) {
        throw new Error(result.error || 'Build generation failed')
      }

      // Apply each component to the store
      const categoryMap = {
        cpu:         'cpu',
        motherboard: 'motherboard',
        ram:         'ram',
        gpu:         'gpu',
        storage:     'storage',
        psu:         'psu',
        case:        'case',
      }

      Object.entries(result.build).forEach(([category, component]) => {
        if (component && categoryMap[category]) {
          selectComponent(categoryMap[category], component)
        }
      })

      // Store explanation in Zustand
      useStore.setState({
        aiExplanation:      result.explanation,
        aiPerformanceRating: result.performanceRating,
        aiSource:           result.source,
      })

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ai-build-section">
      <button
        className={`ai-build-btn ${loading ? 'loading' : ''}`}
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner" />
            Generating...
          </>
        ) : (
          <>
            <span>🤖</span>
            Generate AI Build
          </>
        )}
      </button>

      {loading && (
        <p className="ai-loading-text">
          AI is selecting the best components for your {useCase} build...
        </p>
      )}

      {error && (
        <div className="ai-error">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      )}
    </div>
  )
}