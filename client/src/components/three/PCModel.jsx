import { Suspense, useRef, useState, useMemo, useEffect } from 'react'
import { useFrame }                             from '@react-three/fiber'
import { RoundedBox, Box, Html, useGLTF }       from '@react-three/drei'
import useStore                                 from '../../store/useStore'

// ================================
// COMPONENT SLOT DEFINITIONS
// ================================

const COMPONENT_SLOTS = [
  {
    id:           'motherboard',
    label:        'Motherboard',
    category:     'motherboard',
    position:     [0.2, -0.3, 0],
    size:         [2.8, 0.08, 1.6],
    defaultColor: '#2d5a1b',
  },
  {
    id:           'cpu',
    label:        'CPU',
    category:     'cpu',
    position:     [0.5, -0.15, 0.1],
    size:         [0.6, 0.08, 0.6],
    defaultColor: '#8b7355',
  },
  {
    id:           'cpu-cooler',
    label:        'CPU Cooler',
    category:     null,
    position:     [0.5, 0.35, 0.1],
    size:         [0.65, 0.7, 0.65],
    defaultColor: '#4a4a6a',
  },
  {
    id:           'ram-1',
    label:        'RAM Slot 1',
    category:     'ram',
    position:     [-0.1, 0.05, 0.1],
    size:         [0.14, 0.55, 1.0],
    defaultColor: '#1a3a5c',
  },
  {
    id:           'ram-2',
    label:        'RAM Slot 2',
    category:     'ram',
    position:     [-0.3, 0.05, 0.1],
    size:         [0.14, 0.55, 1.0],
    defaultColor: '#1a3a5c',
  },
  {
    id:           'gpu',
    label:        'GPU',
    category:     'gpu',
    position:     [0.2, -0.9, 0.3],
    size:         [2.2, 0.22, 0.8],
    defaultColor: '#1a1a3a',
  },
  {
    id:           'gpu-fan',
    label:        'GPU Fan',
    category:     null,
    position:     [-0.3, -0.8, 0.72],
    size:         [0.58, 0.58, 0.04],
    defaultColor: '#2a2a5a',
  },
  {
    id:           'storage',
    label:        'Storage',
    category:     'storage',
    position:     [-0.8, -1.5, 0],
    size:         [0.8, 0.07, 0.5],
    defaultColor: '#3a1a5c',
  },
  {
    id:           'psu',
    label:        'PSU',
    category:     'psu',
    position:     [0, -1.85, 0],
    size:         [2.4, 0.45, 1.4],
    defaultColor: '#2a2a2a',
  },
]

const SELECTED_COLORS = {
  cpu:         '#f59e0b',
  motherboard: '#10b981',
  ram:         '#3b82f6',
  gpu:         '#8b5cf6',
  storage:     '#ec4899',
  psu:         '#ef4444',
  case:        '#6b7280',
}

// ================================
// FULL PC GLB MODEL
// Shown before AI generates a build
// ================================

function FullPCModel({ modelPath }) {
  const { scene } = useGLTF(modelPath)
  const cloned    = useMemo(() => scene.clone(true), [scene])

  // DEBUG - print all mesh names
  useEffect(() => {
    console.log('=== GLB Object Tree ===')
    scene.traverse((child) => {
      console.log(
        child.type,
        '|',
        child.name,
        '|',
        child.visible
      )
    })
  }, [scene])

  return (
    <primitive
      object={cloned}
      position={[0, 0, 0]}
      scale={0.01}
      rotation={[0, Math.PI, 0]}
    />
  )
}

// ================================
// REAL CASE GLB
// Shown after AI generates a build
// ================================

function RealCase({ modelPath }) {
  const { scene } = useGLTF(modelPath)
  const cloned    = useMemo(() => scene.clone(true), [scene])

  return (
    <primitive
      object={cloned}
      position={[0, 0, 0]}
      scale={0.01}
      rotation={[0, Math.PI, 0]}
    />
  )
}

// ================================
// PLACEHOLDER CASE (wireframe)
// Fallback if no model available
// ================================

function PlaceholderCase() {
  return (
    <group>
      <Box args={[3.5, 5, 2]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.12}
        />
      </Box>
      {[
        { args: [3.5, 0.04, 2], position: [0,   2.5, 0] },
        { args: [3.5, 0.04, 2], position: [0,  -2.5, 0] },
        { args: [0.04, 5,   2], position: [-1.75, 0, 0] },
        { args: [0.04, 5,   2], position: [ 1.75, 0, 0] },
      ].map((edge, i) => (
        <Box key={i} args={edge.args} position={edge.position}>
          <meshStandardMaterial
            color="#667eea"
            emissive="#667eea"
            emissiveIntensity={0.3}
            metalness={0.9}
            roughness={0.1}
          />
        </Box>
      ))}
    </group>
  )
}

// ================================
// COMPONENT SLOT MESH
// Only shown after AI build
// ================================

function ComponentSlot({ slot, isSelected, isHovered, onHover, onClick }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    if (isSelected) {
      meshRef.current.position.y =
        slot.position[1] +
        Math.sin(state.clock.elapsedTime * 2.5) * 0.04
    } else {
      meshRef.current.position.y +=
        (slot.position[1] - meshRef.current.position.y) * 0.1
    }
  })

  const selectedColor    = slot.category
    ? SELECTED_COLORS[slot.category]
    : slot.defaultColor

  const color            = isSelected
    ? selectedColor
    : isHovered
    ? '#8888cc'
    : slot.defaultColor

  const emissiveColor    = isSelected
    ? selectedColor
    : isHovered
    ? '#444466'
    : '#000000'

  const emissiveIntensity = isSelected ? 0.4 : isHovered ? 0.15 : 0
  const opacity           = slot.category ? 1 : 0.7

  return (
    <group>
      <RoundedBox
        ref={meshRef}
        args={slot.size}
        radius={0.03}
        smoothness={4}
        position={slot.position}
        onClick={(e) => {
          e.stopPropagation()
          if (slot.category) onClick(slot.category)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          onHover(slot.id)
          if (slot.category) document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          onHover(null)
          document.body.style.cursor = 'default'
        }}
      >
        <meshStandardMaterial
          color={color}
          metalness={0.7}
          roughness={0.3}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
          transparent={opacity < 1}
          opacity={opacity}
        />
      </RoundedBox>

      {(isHovered || isSelected) && (
        <Html
          position={[
            slot.position[0],
            slot.position[1] + slot.size[1] / 2 + 0.25,
            slot.position[2],
          ]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <div style={{
            background:   'rgba(0,0,0,0.85)',
            border:       `1px solid ${isSelected ? selectedColor : '#667eea'}`,
            borderRadius: '6px',
            padding:      '4px 10px',
            color:        'white',
            fontSize:     '11px',
            fontWeight:   '600',
            whiteSpace:   'nowrap',
            fontFamily:   'sans-serif',
          }}>
            {slot.label}
          </div>
        </Html>
      )}
    </group>
  )
}

// ================================
// MAIN PC MODEL
// ================================

export default function PCModel() {
  const [hoveredSlot, setHoveredSlot] = useState(null)

  const {
    selectedComponents,
    setActiveCategory,
  } = useStore()

  // Count how many non-case components are selected
  // If > 0 an AI build has been generated
  const nonCaseComponents = Object.entries(selectedComponents)
    .filter(([category, c]) => category !== 'case' && c !== null)

  const hasBuild    = true
  const selectedCase = selectedComponents.case

  const handleSlotClick = (category) => {
    setActiveCategory(category)
  }

  return (
    <group>

      {/* ── Before AI build: show full assembled PC model ── */}
      {!hasBuild && selectedCase?.modelPath && (
        <Suspense fallback={null}>
          <FullPCModel modelPath={selectedCase.modelPath} />
        </Suspense>
      )}

      {/* ── After AI build: show case + component boxes ── */}
      {hasBuild && (
        <>
          {/* Case */}
          <Suspense fallback={<PlaceholderCase />}>
            {selectedCase?.modelPath
              ? <RealCase modelPath={selectedCase.modelPath} />
              : <PlaceholderCase />
            }
          </Suspense>

          {/* Component slots */}
          {COMPONENT_SLOTS.map((slot) => {
            const isSelected = slot.category
              ? selectedComponents[slot.category] !== null
              : false
            const isHovered  = hoveredSlot === slot.id

            return (
              <ComponentSlot
                key={slot.id}
                slot={slot}
                isSelected={isSelected}
                isHovered={isHovered}
                onHover={setHoveredSlot}
                onClick={handleSlotClick}
              />
            )
          })}

          {/* Build complete glow */}
          {Object.values(selectedComponents).filter(Boolean).length >= 6 && (
            <pointLight
              position={[0, 0, 0]}
              intensity={0.8}
              color="#00b4d8"
              distance={8}
            />
          )}
        </>
      )}

    </group>
  )
}

// Preload both models
useGLTF.preload('/models/case/compressed_test_pc_4th.glb')