import { Canvas }        from '@react-three/fiber'
import { OrbitControls, Environment, Grid } from '@react-three/drei'
import { Suspense }      from 'react'
import PCModel           from './PCModel'
import './PCScene.css'

export default function PCScene() {
  return (
    <div className="pc-scene-container">
      <Canvas
        camera={{
          position: [8, 6, 8],
          fov:      45,
          near:     0.1,
          far:      1000,
        }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>

          {/* Bright white-friendly lighting */}
          {/* Ambient - base fill light */}
          <ambientLight intensity={3.5} />

          {/* Key light - main light from top right */}
          <directionalLight
            position={[10, 10, 5]}
            intensity={3}
            color="#ffffff"
          />

          {/* Fill light - soften shadows from left */}
          <directionalLight
            position={[-8, 8, -5]}
            intensity={1.5}
            color="#e0f7ff"
          />

          {/* Rim light - subtle light from behind */}
          <directionalLight
            position={[0, 5, -10]}
            intensity={1}
            color="#ffffff"
          />

          {/* Bottom fill - remove harsh ground shadows */}
          <directionalLight
            position={[0, -5, 0]}
            intensity={0.5}
            color="#f0f9ff"
          />

          <PCModel />

          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={4}
            maxDistance={18}
            minPolarAngle={0.2}
            maxPolarAngle={Math.PI / 2.2}
            target={[0, 0, 0]}
            enableDamping
            dampingFactor={0.05}
          />

        </Suspense>
      </Canvas>
    </div>
  )
}