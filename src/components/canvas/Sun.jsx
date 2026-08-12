import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

export default function Sun() {
  const sunMeshRef = useRef()
  const sunTexture = useTexture('/assets/textures/sun.jpg')

  useMemo(() => {
    if (sunTexture) {
      sunTexture.colorSpace = THREE.SRGBColorSpace
      sunTexture.anisotropy = 16
    }
  }, [sunTexture])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (sunMeshRef.current) {
      sunMeshRef.current.rotation.y = t * 0.02
    }
  })

  return (
    <group>
      {/* Central Sun Light Source — high shadow quality */}
      <pointLight 
        position={[0, 0, 0]} 
        intensity={3.0} 
        color="#fff5e8"
        decay={0} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={5} 
        shadow-camera-far={1500}
        shadow-bias={-0.0002}
        shadow-normalBias={0.04}
        shadow-radius={3}
      />

      {/* Single High-Res Solid Sun Sphere */}
      <mesh ref={sunMeshRef} renderOrder={1}>
        <sphereGeometry args={[15, 64, 64]} />
        <meshStandardMaterial
          map={sunTexture}
          emissive="#ffaa00"
          emissiveMap={sunTexture}
          emissiveIntensity={1.4}
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>
    </group>
  )
}
