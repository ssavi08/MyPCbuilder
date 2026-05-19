import AIExplanation from './AIExplanation'
import useStore from '../../store/useStore'
import './ComponentDetails.css'

const CATEGORY_ICONS = {
  cpu:         '🔲',
  motherboard: '🟩',
  ram:         '🔵',
  gpu:         '🎮',
  storage:     '💾',
  psu:         '⚡',
  case:        '🖥️',
}

const CATEGORY_COLORS = {
  cpu:         '#f59e0b',
  motherboard: '#10b981',
  ram:         '#3b82f6',
  gpu:         '#8b5cf6',
  storage:     '#ec4899',
  psu:         '#ef4444',
  case:        '#6b7280',
}

export default function ComponentDetails() {
  const {
    selectedComponents,
    getBuildSummary,
    clearComponent,
    setActiveCategory,
    activeCategory,
    budget,
  } = useStore()

  const summary = getBuildSummary()

  const selectedList = Object.entries(selectedComponents)
    .filter(([, component]) => component !== null)

  const budgetUsedPercent = Math.min(
    Math.round((summary.totalPrice / budget) * 100),
    100
  )

  return (
    <div className="component-details">
      <h2 className="details-title">Build Summary</h2>
      <h2 className="details-title">Build Summary</h2>

      {/* AI Explanation */}
      <AIExplanation />
      {/* ============================
          BUDGET USAGE BAR
          ============================ */}
      {selectedList.length > 0 && (
        <div className="budget-usage">
          <div className="budget-usage-label">
            <span>Budget used</span>
            <span
              style={{
                color: budgetUsedPercent > 90
                  ? 'var(--color-error)'
                  : 'var(--color-primary)'
              }}
            >
              {budgetUsedPercent}%
            </span>
          </div>
          <div className="budget-usage-bar">
            <div
              className="budget-usage-fill"
              style={{
                width: `${budgetUsedPercent}%`,
                background: budgetUsedPercent > 90
                  ? 'var(--color-error)'
                  : 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
              }}
            />
          </div>
        </div>
      )}

      {/* ============================
          SELECTED COMPONENTS LIST
          ============================ */}
      <div className="selected-list">
        {selectedList.length === 0 ? (
          <div className="empty-build">
            <span>🖥️</span>
            <p>No components selected yet.</p>
            <p>Use the panel on the left to start building!</p>
          </div>
        ) : (
          selectedList.map(([category, component]) => (
            <div
              key={category}
              className={`selected-item ${activeCategory === category ? 'focused' : ''}`}
              onClick={() => setActiveCategory(category)}
              style={{
                borderColor: activeCategory === category
                  ? CATEGORY_COLORS[category]
                  : undefined
              }}
            >
              <div className="selected-item-header">
                <span className="selected-item-icon">
                  {CATEGORY_ICONS[category]}
                </span>
                <span
                  className="selected-item-category"
                  style={{ color: CATEGORY_COLORS[category] }}
                >
                  {category.toUpperCase()}
                </span>
                <button
                  className="remove-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    clearComponent(category)
                  }}
                  title="Remove component"
                >
                  ✕
                </button>
              </div>

              <div className="selected-item-name">
                {component.name}
              </div>

              <div className="selected-item-price">
                ${component.price}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ============================
          BUILD TOTAL
          ============================ */}
      {selectedList.length > 0 && (
        <div className="build-total">
          <div className="build-total-row">
            <span>Components</span>
            <span>{selectedList.length} / 7</span>
          </div>
          <div className="build-total-row">
            <span>Budget</span>
            <span>${budget}</span>
          </div>
          <div className="build-total-row total">
            <span>Total</span>
            <span>${summary.totalPrice}</span>
          </div>
          <div className="build-total-row remaining">
            <span>Remaining</span>
            <span
              style={{
                color: budget - summary.totalPrice < 0
                  ? 'var(--color-error)'
                  : 'var(--color-success)'
              }}
            >
              ${budget - summary.totalPrice}
            </span>
          </div>

          {summary.isComplete && (
            <div className="build-complete">
              🎉 Build Complete!
            </div>
          )}
        </div>
      )}
    </div>
  )
}