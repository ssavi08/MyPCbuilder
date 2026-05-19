import AIBuildButton from './AIBuildButton'
import { useState } from 'react'
import useStore from '../../store/useStore'
import ComponentCard from './ComponentCard'
import './BuildSidebar.css'

const CATEGORIES = [
  { key: 'cpu',         label: 'CPU',         icon: '🔲' },
  { key: 'motherboard', label: 'Motherboard',  icon: '🟩' },
  { key: 'ram',         label: 'RAM',          icon: '🔵' },
  { key: 'gpu',         label: 'GPU',          icon: '🎮' },
  { key: 'storage',     label: 'Storage',      icon: '💾' },
  { key: 'psu',         label: 'PSU',          icon: '⚡' },
  { key: 'case',        label: 'Case',         icon: '🖥️' },
]

const USE_CASES = [
  { key: 'school',  label: 'School',  icon: '🎓' },
  { key: 'work',    label: 'Work',    icon: '💼' },
  { key: 'gaming',  label: 'Gaming',  icon: '🎮' },
]

export default function BuildSidebar() {
  const {
    useCase, setUseCase,
    budget, setBudget,
    activeCategory, setActiveCategory,
    getFilteredComponents,
    getBuildSummary,
    clearAllComponents,
  } = useStore()

  const summary = getBuildSummary()
  const filteredComponents = getFilteredComponents(activeCategory)

  return (
    <div className="build-sidebar">

      {/* ============================
          USE CASE SELECTOR
          ============================ */}
      <div className="sidebar-section">
        <label className="section-label">Purpose</label>
        <div className="use-case-buttons">
          {USE_CASES.map((uc) => (
            <button
              key={uc.key}
              className={`use-case-btn ${useCase === uc.key ? 'active' : ''}`}
              onClick={() => {
                setUseCase(uc.key)
                clearAllComponents()
              }}
            >
              <span>{uc.icon}</span>
              <span>{uc.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ============================
          BUDGET SLIDER
          ============================ */}
      <div className="sidebar-section">
        <label className="section-label">
          Budget: <span className="budget-value">${budget}</span>
        </label>
        <input
          type="range"
          min="300"
          max="5000"
          step="50"
          value={budget}
          onChange={(e) => {
            setBudget(Number(e.target.value))
            clearAllComponents()
          }}
          className="budget-slider"
        />
        <div className="budget-range-labels">
          <span>$300</span>
          <span>$5000</span>
        </div>
      </div>

      {/* ============================
          AI GENERATE BUTTON
          ============================ */}
      <div className="sidebar-section">
        <AIBuildButton />
      </div>
      
      {/* ============================
          BUILD PROGRESS
          ============================ */}
      <div className="sidebar-section">
        <label className="section-label">
          Build Progress ({summary.completionPercent}%)
        </label>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${summary.completionPercent}%` }}
          />
        </div>
        <div className="total-price">
          Total: <span>${summary.totalPrice}</span>
          <span className="budget-remaining">
            (${budget - summary.totalPrice} remaining)
          </span>
        </div>
      </div>

      {/* ============================
          CATEGORY TABS
          ============================ */}
      <div className="sidebar-section">
        <label className="section-label">Components</label>
        <div className="category-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              className={`category-tab ${activeCategory === cat.key ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.key)}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ============================
          COMPONENT LIST
          ============================ */}
      <div className="sidebar-section component-list">
        <label className="section-label">
          {CATEGORIES.find(c => c.key === activeCategory)?.label} Options
          <span className="component-count">
            ({filteredComponents.length} available)
          </span>
        </label>

        {filteredComponents.length === 0 ? (
          <div className="no-components">
            <p>No components match your filters.</p>
            <p>Try increasing your budget or changing purpose.</p>
          </div>
        ) : (
          filteredComponents.map((component) => (
            <ComponentCard
              key={component.id}
              component={component}
              category={activeCategory}
            />
          ))
        )}
      </div>

    </div>
  )
}