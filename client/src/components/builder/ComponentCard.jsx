import useStore from '../../store/useStore'
import './ComponentCard.css'

export default function ComponentCard({ component, category }) {
  const { selectedComponents, selectComponent, clearComponent } = useStore()

  const isSelected = selectedComponents[category]?.id === component.id

  const handleClick = () => {
    if (isSelected) {
      clearComponent(category)
    } else {
      selectComponent(category, component)
    }
  }

  // Get relevant spec to show per category
  const getKeySpec = () => {
    switch (category) {
      case 'cpu':
        return `${component.cores} cores / ${component.boostClockGHz}GHz`
      case 'motherboard':
        return `${component.socket} / ${component.ramType}`
      case 'ram':
        return `${component.capacityGB}GB ${component.type} ${component.speedMHz}MHz`
      case 'gpu':
        return `${component.vramGB}GB VRAM / ${component.tdpW}W`
      case 'storage':
        return `${component.capacityGB}GB ${component.type}`
      case 'psu':
        return `${component.wattage}W / ${component.efficiency}`
      case 'case':
        return `${component.formFactor}`
      default:
        return ''
    }
  }

  return (
    <div
      className={`component-card ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
    >
      <div className="component-card-header">
        <span className="component-brand">{component.brand}</span>
        {isSelected && <span className="selected-badge">✓ Selected</span>}
      </div>

      <div className="component-name">{component.name}</div>

      <div className="component-spec">{getKeySpec()}</div>

      <div className="component-footer">
        <span className="component-price">${component.price}</span>
        <button className={`select-btn ${isSelected ? 'deselect' : ''}`}>
          {isSelected ? 'Remove' : 'Select'}
        </button>
      </div>
    </div>
  )
}