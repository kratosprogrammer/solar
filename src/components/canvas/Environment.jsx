import React, { useRef, useMemo } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

// ─── Milky Way background sphere ─────────────────────────────────────────────
function MilkyWay() {
  const texture = useLoader(THREE.TextureLoader, '/assets/textures/stars_milky_way.jpg')

  useMemo(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = 16
      texture.generateMipmaps = false
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
    }
  }, [texture])

  return (
    <mesh renderOrder={-1}>
      <sphereGeometry args={[15000, 64, 64]} />
      <meshBasicMaterial
        map={texture}
        side={THREE.BackSide}
        depthWrite={false}
        toneMapped={false}
        color="#ffffff"
      />
    </mesh>
  )
}

// ─── Ambient space dust ───────────────────────────────────────────────────────
function DustParticles() {
  const pointsRef = useRef()

  const positions = useMemo(() => {
    const count = 400
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 100 + Math.random() * 600
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = (r * Math.sin(phi) * Math.sin(theta)) * 0.3
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.003
    }
  })

  return (
    <points ref={pointsRef} renderOrder={0}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position"
          array={positions} count={positions.length / 3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.35} color="#b0c8ff" transparent opacity={0.4}
        sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

// ─── Post-processing ──────────────────────────────────────────────────────────
function PostProcessing() {
  return (
    <EffectComposer multisampling={2}>
      <Bloom
        resolutionScale={0.5}
        luminanceThreshold={0.7}
        luminanceSmoothing={0.85}
        height={300}
        intensity={1.0}
        mipmapBlur
        radius={0.7}
      />
      <Vignette eskil={false} offset={0.15} darkness={0.7} />
    </EffectComposer>
  )
}

// ─── Environment ──────────────────────────────────────────────────────────────
export default function Environment() {
  return (
    <>
      <MilkyWay />
      <Stars radius={600} depth={250} count={3000}
        factor={9} saturation={1.0} fade speed={0.3} />
      <DustParticles />
      <PostProcessing />
    </>
  )
}
