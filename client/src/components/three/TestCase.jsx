import { Canvas }        from '@react-three/fiber'
import { OrbitControls, Environment, Grid, Stats } from '@react-three/drei'
import { Suspense, useState } from 'react'
import { useGLTF }       from '@react-three/drei'

// ================================
// THE MODEL ITSELF
// ================================

function CaseModel() {
  const { scene } = useGLTF(
    '/models/case/Case_NZXT_H5_Flow_464x215x424.glb'
  )

  return (
    <primitive
      object={scene}
      position={[0, 0, 0]}
      scale={0.01}          // ← start small, we'll adjust
      rotation={[0, 0, 0]}
    />
  )
}

// ================================
// TEST SCENE
// ================================

export default function TestCase() {
  const [scale, setScale]    = useState(0.01)
  const [posY,  setPosY]     = useState(0)
  const [rotY,  setRotY]     = useState(0)

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0f0f13' }}>

      {/* Controls overlay */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 100,
        background: 'rgba(0,0,0,0.8)',
        padding: 20,
        borderRadius: 8,
        color: 'white',
        fontFamily: 'monospace',
        fontSize: 13,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        minWidth: 250,
      }}>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>
          🔧 Model Calibration
        </div>

        <label>
          Scale: {scale.toFixed(4)}
          <input
            type="range"
            min="0.001"
            max="0.1"
            step="0.001"
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </label>

        <label>
          Position Y: {posY.toFixed(2)}
          <input
            type="range"
            min="-5"
            max="5"
            step="0.1"
            value={posY}
            onChange={(e) => setPosY(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </label>

        <label>
          Rotation Y: {rotY.toFixed(2)}
          <input
            type="range"
            min="0"
            max={Math.PI * 2}
            step="0.1"
            value={rotY}
            onChange={(e) => setRotY(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </label>

        <div style={{
          marginTop: 8,
          padding: 8,
          background: 'rgba(102,126,234,0.2)',
          borderRadius: 4,
          fontSize: 11,
          lineHeight: 1.8,
        }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>
            Copy these values:
          </div>
          <div>scale={scale.toFixed(4)}</div>
          <div>posY={posY.toFixed(2)}</div>
          <div>rotY={rotY.toFixed(2)}</div>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [3, 2, 3], fov: 45 }}>
        <Suspense fallback={null}>

          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Environment preset="city" />

          <Grid
            args={[20, 20]}
            position={[0, -0.01, 0]}
            cellColor="#2a2a4a"
            sectionColor="#667eea"
            infiniteGrid
            fadeDistance={15}
          />

          <primitive
            object={useGLTF(
              '/models/case/Case_NZXT_H5_Flow_464x215x424.glb'
            ).scene}
            position={[0, posY, 0]}
            scale={scale}
            rotation={[0, rotY, 0]}
          />

          <OrbitControls enableDamping dampingFactor={0.05} />
          <Stats />  {/* Shows FPS - remove for production */}

        </Suspense>
      </Canvas>
    </div>
  )
}