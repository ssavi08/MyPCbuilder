import Navbar from '../components/ui/Navbar'
import PCScene from '../components/three/PCScene'
import './Builder.css'

export default function Builder() {
  return (
    <div className="builder-page">
      <Navbar />
      <div className="builder-container">

        {/* Left Panel */}
        <aside className="builder-sidebar">
          <h2>Configure Your PC</h2>
          <p className="sidebar-subtitle">
            Select purpose and budget to get started
          </p>

          <div className="placeholder-section">
            <div className="placeholder-block">
              <span>🎯</span>
              <p>Purpose selector — Day 4</p>
            </div>
            <div className="placeholder-block">
              <span>💰</span>
              <p>Budget input — Day 4</p>
            </div>
            <div className="placeholder-block">
              <span>🤖</span>
              <p>AI recommendations — Day 8</p>
            </div>
          </div>
        </aside>

        {/* Center - 3D Scene */}
        <main className="builder-scene">
          <PCScene />
        </main>

        {/* Right Panel */}
        <aside className="builder-details">
          <h2>Component Details</h2>
          <p className="sidebar-subtitle">
            Click a component in the 3D scene to see details
          </p>

          <div className="placeholder-section">
            <div className="placeholder-block">
              <span>📋</span>
              <p>Click any component in the 3D scene</p>
            </div>
          </div>
        </aside>

      </div>
    </div>
  )
}