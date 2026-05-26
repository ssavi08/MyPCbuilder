import Navbar        from '../components/ui/Navbar'
import PCScene       from '../components/three/PCScene'
import LeftPanel     from '../components/builder/LeftPanel'
import './Builder.css'

export default function Builder() {
  return (
    <div className="builder">
      <Navbar />

      {/* Full screen 3D scene */}
      <div className="builder-canvas">
        <PCScene />
      </div>

      {/* Floating left panel */}
      <div className="builder-panel-left">
        <LeftPanel />
      </div>
    </div>
  )
}