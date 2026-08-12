import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import Sun from './Sun'
import Environment from './Environment'
import Planet from './Planet'
import OrbitLine from './OrbitLine'
import Spaceship from './Spaceship'
import CameraRig from './CameraRig'
import FlightController from './FlightController'
import { planetsData } from '../../config/planetsData'
import { useSolarStore } from '../../store/useSolarStore'

function SimulationTicker() {
  const advance = useSolarStore(state => state.advanceSimulationTime)
  useFrame((state, delta) => {
    advance(delta)
  })
  return null
}

import SpacecraftTrajectories from './SpacecraftTrajectories'
import AsteroidBelt from './AsteroidBelt'

export default function Scene() {
  const orbitControlsRef = useRef()
  const hideOrbits = useSolarStore(state => state.hideOrbits)

  return (
    <Canvas
      style={{ width: '100vw', height: '100vh' }}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        outputColorSpace: THREE.SRGBColorSpace,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.5,
        logarithmicDepthBuffer: true,
      }}
      shadows={{ type: THREE.PCFSoftShadowMap }}
      dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.5)]}
    >
      <PerspectiveCamera
        makeDefault
        fov={45}
        near={1}
        far={20000}
        position={[0, 250, 850]}
      />

      <SimulationTicker />

      {/* OrbitControls — CameraRig disables this in follow-ship mode */}
      <OrbitControls
        ref={orbitControlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.05}
        maxDistance={4000}
        minDistance={8}
        target={[0, 0, 0]}
        rotateSpeed={0.35}
        zoomSpeed={1.8}
        panSpeed={0.8}
        enablePan={true}
      />

      {/* Camera rig follows the ship when shipState.followCamera=true */}
      <CameraRig orbitControlsRef={orbitControlsRef} />
      
      {/* Flight controller handles GSAP sequencing */}
      <FlightController orbitControlsRef={orbitControlsRef} />

      <ambientLight intensity={0.25} color="#111827" />

      {/* ── Static environment ── */}
      <Suspense fallback={null}>
        <Environment />
        <SpacecraftTrajectories />
      </Suspense>

      {/* ── Sun & Planets & Orbits & Asteroid Belt ── */}
      <Suspense fallback={null}>
        <Sun />
        <AsteroidBelt />
        {planetsData.map((data, i) => (
          <React.Fragment key={i}>
            {!hideOrbits && !data.isMoon && <OrbitLine distance={data.distance} />}
            <Planet data={data} />
          </React.Fragment>
        ))}
      </Suspense>

      {/* ── Spaceship with thrusters ── */}
      <Suspense fallback={null}>
        <Spaceship />
      </Suspense>
    </Canvas>
  )
}
