import Navbar from '../components/ui/Navbar'
import './Builder.css'

export default function Builder() {
  return (
    <div className="builder-page">
      <Navbar />
      <div className="builder-container">

        {/* Left Panel - Component Selection */}
        <aside className="builder-sidebar">
          <h2>Configure Your PC</h2>
          <p className="sidebar-subtitle">
            Select purpose and budget to get started
          </p>

          <div className="placeholder-section">
            <div className="placeholder-block">
              <span>🎯</span>
              <p>Purpose selector coming Day 4</p>
            </div>
            <div className="placeholder-block">
              <span>💰</span>
              <p>Budget input coming Day 4</p>
            </div>
            <div className="placeholder-block">
              <span>🤖</span>
              <p>AI recommendations coming Day 8</p>
            </div>
          </div>
        </aside>

        {/* Center - 3D Scene */}
        <main className="builder-scene">
          <div className="scene-placeholder">
            <span>🧊</span>
            <h3>3D Scene</h3>
            <p>Three.js scene coming Day 3</p>
          </div>
        </main>

        {/* Right Panel - Component Details */}
        <aside className="builder-details">
          <h2>Component Details</h2>
          <p className="sidebar-subtitle">
            Click a component to see details
          </p>

          <div className="placeholder-section">
            <div className="placeholder-block">
              <span>📋</span>
              <p>Component specs coming Day 4</p>
            </div>
          </div>
        </aside>

      </div>
    </div>
  )
}