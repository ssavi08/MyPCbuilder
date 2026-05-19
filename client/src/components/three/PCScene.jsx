import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Grid } from '@react-three/drei'
import { Suspense } from 'react'
import PCModel from './PCModel'
import './PCScene.css'

export default function PCScene() {
  return (
    <div className="pc-scene-container">
      <Canvas
        camera={{
          position: [8, 6, 8],
          fov: 45,
          near: 0.1,
          far: 1000
        }}
      >
        <Suspense fallback={null}>

          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
          />
          <directionalLight
            position={[-5, 5, -5]}
            intensity={0.3}
            color="#667eea"
          />
          <pointLight
            position={[0, 5, 0]}
            intensity={0.5}
            color="#764ba2"
          />

          {/* Environment */}
          <Environment preset="city" />

          {/* Grid floor */}
          <Grid
            args={[20, 20]}
            position={[0, -2.6, 0]}
            cellColor="#2a2a4a"
            sectionColor="#667eea"
            fadeDistance={15}
            infiniteGrid
          />

          {/* The PC Model */}
          <PCModel />

          {/* Camera Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={4}
            maxDistance={20}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2}
            target={[0, 0, 0]}
          />

        </Suspense>
      </Canvas>

      {/* Overlay hint */}
      <div className="scene-controls-hint">
        <span>🖱️ Drag to rotate</span>
        <span>🔍 Scroll to zoom</span>
        <span>👆 Click to select</span>
      </div>
    </div>
  )
}