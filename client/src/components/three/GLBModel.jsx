import { useGLTF } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function GLBModel({ url, position, scale, rotation }) {
  const { scene } = useGLTF(url)
  const clonedScene = useRef()

  useEffect(() => {
    if (!scene) return

    // Clone so multiple instances don't share the same object
    clonedScene.current = scene.clone(true)

    // Make sure all materials render correctly
    clonedScene.current.traverse((child) => {
      if (child.isMesh) {
        child.castShadow    = false
        child.receiveShadow = false

        // Fix transparency issues common in downloaded models
        if (child.material) {
          child.material.side = THREE.FrontSide
        }
      }
    })
  }, [scene])

  return (
    <primitive
      object={scene}
      position={position  || [0, 0, 0]}
      scale={scale        || 1}
      rotation={rotation  || [0, 0, 0]}
    />
  )
}