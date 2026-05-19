import useStore from '../../store/useStore'
import './ComponentDetails.css'

const CATEGORY_ICONS = {
  cpu: '🔲',
  motherboard: '🟩',
  ram: '🔵',
  gpu: '🎮',
  storage: '💾',
  psu: '⚡',
  case: '🖥️',
}

export default function ComponentDetails() {
  const { selectedComponents, getBuildSummary, clearComponent } = useStore()
  const summary = getBuildSummary()

  const selectedList = Object.entries(selectedComponents)
    .filter(([, component]) => component !== null)

  return (
    <div className="component-details">
      <h2 className="details-title">Build Summary</h2>

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
            <div key={category} className="selected-item">
              <div className="selected-item-header">
                <span className="selected-item-icon">
                  {CATEGORY_ICONS[category]}
                </span>
                <span className="selected-item-category">
                  {category.toUpperCase()}
                </span>
                <button
                  className="remove-btn"
                  onClick={() => clearComponent(category)}
                >
                  ✕
                </button>
              </div>
              <div className="selected-item-name">{component.name}</div>
              <div className="selected-item-price">${component.price}</div>
            </div>
          ))
        )}
      </div>

      {/* ============================
          TOTAL
          ============================ */}
      {selectedList.length > 0 && (
        <div className="build-total">
          <div className="build-total-row">
            <span>Components</span>
            <span>{selectedList.length} / 7</span>
          </div>
          <div className="build-total-row total">
            <span>Total Price</span>
            <span>${summary.totalPrice}</span>
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