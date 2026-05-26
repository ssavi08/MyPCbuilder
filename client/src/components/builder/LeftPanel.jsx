import useStore      from '../../store/useStore'
import AIBuildButton from './AIBuildButton'
import './LeftPanel.css'

const USE_CASES = [
  { key: 'school',  label: 'School',  icon: '🎓',
    desc: 'Studying & everyday use' },
  { key: 'work',    label: 'Work',    icon: '💼',
    desc: 'Productivity & professional' },
  { key: 'gaming',  label: 'Gaming',  icon: '🎮',
    desc: 'High performance gaming' },
]

export default function LeftPanel() {
  const {
    useCase,    setUseCase,
    budget,     setBudget,
    selectedComponents,
    getBuildSummary,
    clearAllComponents,
  } = useStore()

  const summary  = getBuildSummary()
  const used     = summary.totalPrice
  const remaining = budget - used
  const usedPct  = Math.min(Math.round((used / budget) * 100), 100)

  const handleUseCaseChange = (key) => {
    setUseCase(key)
    clearAllComponents()
  }

  const selectedCount = Object.values(selectedComponents)
    .filter(Boolean).length

  return (
    <div className="left-panel">

      {/* ── Purpose ── */}
      <section className="panel-section">
        <p className="panel-label">Purpose</p>
        <div className="use-case-grid">
          {USE_CASES.map((uc) => (
            <button
              key={uc.key}
              className={`uc-btn ${useCase === uc.key ? 'uc-btn--active' : ''}`}
              onClick={() => handleUseCaseChange(uc.key)}
            >
              <span className="uc-icon">{uc.icon}</span>
              <span className="uc-label">{uc.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Budget ── */}
      <section className="panel-section">
        <div className="panel-label-row">
          <p className="panel-label">Budget</p>
          <p className="panel-value">${budget.toLocaleString()}</p>
        </div>
        <input
          type="range"
          min="300"
          max="5000"
          step="50"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="budget-range"
        />
        <div className="budget-markers">
          <span>$300</span>
          <span>$5,000</span>
        </div>
      </section>

      {/* ── Generate Button ── */}
      <section className="panel-section">
        <AIBuildButton />
      </section>

      {/* ── Build Summary (only shown after build) ── */}
      {selectedCount > 1 && (
        <section className="panel-section">
          <p className="panel-label">Build Summary</p>

          {/* Progress bar */}
          <div className="summary-progress">
            <div className="summary-progress-header">
              <span className="summary-progress-label">
                Components
              </span>
              <span className="summary-progress-count">
                {selectedCount} / 7
              </span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.round((selectedCount / 7) * 100)}%`
                }}
              />
            </div>
          </div>

          {/* Budget breakdown */}
          <div className="summary-budget">
            <div className="summary-row">
              <span>Budget</span>
              <span>${budget.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Total</span>
              <span>${used.toLocaleString()}</span>
            </div>

            {/* Budget used bar */}
            <div className="budget-used-bar">
              <div
                className="budget-used-fill"
                style={{
                  width:      `${usedPct}%`,
                  background: usedPct > 95
                    ? '#ef4444'
                    : 'var(--accent)',
                }}
              />
            </div>

            <div className="summary-row summary-row--remaining">
              <span>Remaining</span>
              <span style={{
                color: remaining < 0
                  ? '#ef4444'
                  : 'var(--accent-dark)'
              }}>
                {remaining < 0 ? '-' : ''}
                ${Math.abs(remaining).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Component list */}
          <div className="summary-components">
            {Object.entries(selectedComponents)
              .filter(([, c]) => c !== null)
              .map(([category, component]) => (
                <div key={category} className="summary-item">
                  <span className="summary-item-category">
                    {category.toUpperCase()}
                  </span>
                  <span className="summary-item-name">
                    {component.name}
                  </span>
                  <span className="summary-item-price">
                    ${component.price}
                  </span>
                </div>
              ))
            }
          </div>

          {summary.isComplete && (
            <div className="summary-complete">
              ✦ Build Complete
            </div>
          )}
        </section>
      )}

    </div>
  )
}