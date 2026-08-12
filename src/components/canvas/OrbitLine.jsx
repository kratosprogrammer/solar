import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

export default function OrbitLine({ distance }) {
  const lineRef = useRef()

  // Build circle points on XZ plane
  const points = useMemo(() => {
    const segments = 128
    const pts = []
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      pts.push(new THREE.Vector3(
        Math.cos(angle) * distance,
        0,
        Math.sin(angle) * distance
      ))
    }
    return pts
  }, [distance])

  // Animate opacity — subtle breathing pulse
  useFrame(({ clock }) => {
    if (lineRef.current?.material) {
      lineRef.current.material.opacity =
        0.10 + 0.06 * Math.sin(clock.getElapsedTime() * 0.8 + distance * 0.01)
    }
  })

  return (
    <Line
      ref={lineRef}
      points={points}
      lineWidth={0.8}
      transparent
      opacity={0.12}
      color="#38bdf8"
      depthWrite={false}
      blending={THREE.AdditiveBlending}
    />
  )
}
