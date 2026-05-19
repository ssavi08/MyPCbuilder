import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, RoundedBox, Text } from '@react-three/drei'

// ================================
// INDIVIDUAL COMPONENT
// ================================

function PCComponent({
  name,
  position,
  size,
  color,
  selectedColor = '#f093fb',
  isSelected,
  onClick
}) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  // Gentle float animation on selected component
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05
    } else if (meshRef.current) {
      meshRef.current.position.y = position[1]
    }
  })

  const currentColor = isSelected
    ? selectedColor
    : hovered
    ? '#a0a0ff'
    : color

  return (
    <group>
      <RoundedBox
        ref={meshRef}
        args={size}
        radius={0.05}
        smoothness={4}
        position={position}
        onClick={(e) => {
          e.stopPropagation()
          onClick(name)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'default'
        }}
      >
        <meshStandardMaterial
          color={currentColor}
          metalness={0.6}
          roughness={0.4}
          emissive={isSelected ? selectedColor : hovered ? '#333388' : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : hovered ? 0.2 : 0}
        />
      </RoundedBox>

      {/* Label above component when hovered or selected */}
      {(hovered || isSelected) && (
        <Text
          position={[position[0], position[1] + size[1] / 2 + 0.3, position[2]]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
          renderOrder={1}
        >
          {name}
        </Text>
      )}
    </group>
  )
}

// ================================
// PC CASE (Transparent Box)
// ================================

function PCCase() {
  return (
    <group>
      {/* Main case body */}
      <Box args={[3.5, 5, 2]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.15}
          wireframe={false}
        />
      </Box>

      {/* Case frame edges - top */}
      <Box args={[3.5, 0.05, 2]} position={[0, 2.5, 0]}>
        <meshStandardMaterial color="#667eea" metalness={0.9} roughness={0.1} />
      </Box>

      {/* Case frame edges - bottom */}
      <Box args={[3.5, 0.05, 2]} position={[0, -2.5, 0]}>
        <meshStandardMaterial color="#667eea" metalness={0.9} roughness={0.1} />
      </Box>

      {/* Case frame edges - left */}
      <Box args={[0.05, 5, 2]} position={[-1.75, 0, 0]}>
        <meshStandardMaterial color="#667eea" metalness={0.9} roughness={0.1} />
      </Box>

      {/* Case frame edges - right */}
      <Box args={[0.05, 5, 2]} position={[1.75, 0, 0]}>
        <meshStandardMaterial color="#667eea" metalness={0.9} roughness={0.1} />
      </Box>
    </group>
  )
}

// ================================
// MAIN PC MODEL
// ================================

export default function PCModel() {
  const [selectedComponent, setSelectedComponent] = useState(null)

  const handleComponentClick = (name) => {
    // Toggle selection
    setSelectedComponent(prev => prev === name ? null : name)
  }

  // Click on empty space to deselect
  const handleBackgroundClick = () => {
    setSelectedComponent(null)
  }

  const components = [
    {
      name: 'Motherboard',
      position: [0, -0.5, 0],
      size: [2.8, 0.1, 1.6],
      color: '#2d5a1b'
    },
    {
      name: 'CPU',
      position: [0.3, -0.3, 0.1],
      size: [0.6, 0.1, 0.6],
      color: '#8b7355'
    },
    {
      name: 'CPU Cooler',
      position: [0.3, 0.1, 0.1],
      size: [0.7, 0.6, 0.7],
      color: '#4a4a6a'
    },
    {
      name: 'RAM Slot 1',
      position: [-0.3, -0.2, 0.1],
      size: [0.15, 0.5, 1.0],
      color: '#1a3a5c'
    },
    {
      name: 'RAM Slot 2',
      position: [-0.5, -0.2, 0.1],
      size: [0.15, 0.5, 1.0],
      color: '#1a3a5c'
    },
    {
      name: 'GPU',
      position: [0, -1.2, 0.3],
      size: [2.2, 0.25, 0.8],
      color: '#1a1a3a'
    },
    {
      name: 'GPU Fan',
      position: [-0.5, -1.1, 0.75],
      size: [0.6, 0.6, 0.05],
      color: '#2a2a5a'
    },
    {
      name: 'Storage (SSD)',
      position: [-1.0, -1.8, 0],
      size: [0.8, 0.08, 0.5],
      color: '#3a1a5c'
    },
    {
      name: 'PSU',
      position: [0, -2.1, 0],
      size: [2.4, 0.5, 1.4],
      color: '#2a2a2a'
    }
  ]

  return (
    <group onClick={handleBackgroundClick}>
      {/* PC Case */}
      <PCCase />

      {/* All PC Components */}
      {components.map((component) => (
        <PCComponent
          key={component.name}
          {...component}
          isSelected={selectedComponent === component.name}
          onClick={handleComponentClick}
        />
      ))}

      {/* Selected component name display */}
      {selectedComponent && (
        <Text
          position={[0, 3.2, 0]}
          fontSize={0.25}
          color="#667eea"
          anchorX="center"
          anchorY="middle"
        >
          {`Selected: ${selectedComponent}`}
        </Text>
      )}
    </group>
  )
}