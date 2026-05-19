import useStore from '../../store/useStore'
import './AIExplanation.css'

const RATING_LABELS = {
  overall:      '⭐ Overall',
  gaming:       '🎮 Gaming',
  productivity: '💼 Productivity',
  value:        '💰 Value',
}

export default function AIExplanation() {
  const { aiExplanation, aiPerformanceRating, aiSource } = useStore()

  if (!aiExplanation) return null

  return (
    <div className="ai-explanation">

      {/* Header */}
      <div className="ai-explanation-header">
        <span className="ai-badge">🤖 AI Build</span>
        {aiSource === 'fallback' && (
          <span className="fallback-badge">Fallback</span>
        )}
      </div>

      {/* Summary */}
      {aiExplanation.summary && (
        <p className="ai-summary">{aiExplanation.summary}</p>
      )}

      {/* Performance Ratings */}
      {aiPerformanceRating && (
        <div className="performance-ratings">
          {Object.entries(aiPerformanceRating).map(([key, value]) => (
            <div key={key} className="rating-row">
              <span className="rating-label">
                {RATING_LABELS[key] || key}
              </span>
              <div className="rating-bar">
                <div
                  className="rating-fill"
                  style={{ width: `${value * 10}%` }}
                />
              </div>
              <span className="rating-value">{value}/10</span>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}