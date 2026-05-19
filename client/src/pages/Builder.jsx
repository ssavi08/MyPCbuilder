import Navbar from '../components/ui/Navbar'
import PCScene from '../components/three/PCScene'
import BuildSidebar from '../components/builder/BuildSidebar'
import ComponentDetails from '../components/builder/ComponentDetails'
import './Builder.css'

export default function Builder() {
  return (
    <div className="builder-page">
      <Navbar />
      <div className="builder-container">

        {/* Left Panel - Component Selection */}
        <aside className="builder-sidebar">
          <BuildSidebar />
        </aside>

        {/* Center - 3D Scene */}
        <main className="builder-scene">
          <PCScene />
        </main>

        {/* Right Panel - Build Summary */}
        <aside className="builder-details">
          <ComponentDetails />
        </aside>

      </div>
    </div>
  )
}