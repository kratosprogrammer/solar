import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { shipState } from '../../state/shipState'

export default function ThrusterGlow({ offset = [0, 0, 0] }) {
  const coneRef    = useRef()
  const glowRef    = useRef()
  const lightRef   = useRef()
  const outerRef   = useRef()

  // Plasma cone material uniforms-like approach via direct mutation
  const coneColor  = useMemo(() => new THREE.Color('#00f3ff'), [])
  const innerColor = useMemo(() => new THREE.Color('#ffffff'), [])

  useFrame(({ clock }) => {
    const t  = clock.getElapsedTime()
    const thrust = shipState.thrustLevel

    // Violent plasma flicker: high-frequency noise
    const flicker  = Math.sin(t * 20)  * 0.25 +
                     Math.sin(t * 37)  * 0.12 +
                     Math.sin(t * 7.3) * 0.08 + 1.0

    const pulse = flicker * thrust

    // Scale the exhaust cone with thrust
    if (coneRef.current) {
      coneRef.current.scale.set(pulse * 0.9, pulse * 1.4, pulse * 0.9)
    }

    // Inner hot core — faster, tighter flicker
    if (glowRef.current) {
      const innerFlicker = Math.sin(t * 45) * 0.15 + 1.0
      glowRef.current.scale.setScalar(innerFlicker * thrust * 0.5)
      glowRef.current.material.emissiveIntensity = 8 * innerFlicker * thrust
    }

    // Outer soft glow
    if (outerRef.current) {
      outerRef.current.scale.setScalar(0.8 + Math.sin(t * 6) * 0.1)
      outerRef.current.material.opacity = 0.15 * thrust + Math.sin(t * 8) * 0.05
    }

    // Dynamic point light intensity
    if (lightRef.current) {
      lightRef.current.intensity = 3.5 * pulse * thrust
    }
  })

  return (
    <group position={offset}>
      {/* Dynamic blue engine point light */}
      <pointLight
        ref={lightRef}
        color="#00f3ff"
        intensity={3}
        distance={20}
        decay={2}
        castShadow={false}
      />

      {/* Main plasma exhaust cone */}
      <mesh ref={coneRef} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.18, 0.9, 12, 1, true]} />
        <meshStandardMaterial
          color={coneColor}
          emissive={coneColor}
          emissiveIntensity={5}
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner white-hot core */}
      <mesh ref={glowRef} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.07, 0.4, 8, 1, true]} />
        <meshStandardMaterial
          color={innerColor}
          emissive={innerColor}
          emissiveIntensity={8}
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer soft bloom halo — large sprite-like sphere */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[0.35, 8, 8]} />
        <meshBasicMaterial
          color="#00f3ff"
          transparent
          opacity={0.12}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}
