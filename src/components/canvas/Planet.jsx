import React, { useRef, useMemo, Suspense } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { useSolarStore } from '../../store/useSolarStore'
import {
  atmosphereVertexShader,
  atmosphereFragmentShader,
  earthVertexShader,
  earthFragmentShader,
} from './AtmosphereShader'
import { shipState } from '../../state/shipState'

const SUN_POSITION = new THREE.Vector3(0, 0, 0)

// ─── Atmosphere Halo ──────────────────────────────────────────────────────────
function Atmosphere({ color, scale = 1.025 }) {
  const colorVec = useMemo(() => new THREE.Color(color), [color])
  const uniforms = useMemo(() => ({
    uAtmosphereColor: { value: colorVec },
    uIntensity: { value: 1.0 },
  }), [colorVec])

  return (
    <mesh scale={scale} renderOrder={5}>
      <sphereGeometry args={[1, 32, 32]} />
      <shaderMaterial
        vertexShader={atmosphereVertexShader}
        fragmentShader={atmosphereFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

function PlanetRing({ config, planetName }) {
  const { innerRadius, outerRadius } = config
  
  // Use the exact saturn_ring_alpha.png texture from reference project
  const ringTexture = useTexture('/assets/textures/saturn_ring_alpha.png')
  
  useMemo(() => {
    if (ringTexture) {
      ringTexture.colorSpace = THREE.SRGBColorSpace
      ringTexture.anisotropy = 16
    }
  }, [ringTexture])

  // Exact UV radial remapping algorithm from reference project solarSystem.js:
  // Maps buffer positions to UVs radially: inner radius -> U=0, outer radius -> U=1
  const ringGeometry = useMemo(() => {
    const geo = new THREE.RingGeometry(innerRadius, outerRadius, 128, 1)
    const pos = geo.attributes.position
    const uv = geo.attributes.uv
    const v3 = new THREE.Vector3()

    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i)
      const dist = v3.length()
      const u = (dist - innerRadius) / (outerRadius - innerRadius)
      uv.setXY(i, u, 1)
    }
    uv.needsUpdate = true
    return geo
  }, [innerRadius, outerRadius])

  const isUranus = planetName === 'اورانوس'

  if (isUranus) {
    return (
      <mesh geometry={ringGeometry} rotation={[Math.PI / 2, 0, 0]} renderOrder={2}>
        <meshBasicMaterial
          map={ringTexture}
          color="#38e8d8"
          transparent={true}
          side={THREE.DoubleSide}
          opacity={0.8}
        />
      </mesh>
    )
  }

  // Saturn: Clean bright ring — identical implementation to reference project!
  return (
    <mesh geometry={ringGeometry} rotation={[Math.PI / 2, 0, 0]} renderOrder={2}>
      <meshBasicMaterial
        map={ringTexture}
        color="#ffffff"
        transparent={true}
        side={THREE.DoubleSide}
        opacity={0.95}
      />
    </mesh>
  )
}

// ─── Earth Layers (Day/Night + Clouds + Atmosphere) ───────────────────────────
function EarthLayers({ textures, radius }) {
  const [dayMap, nightMap, cloudsMap] = useLoader(THREE.TextureLoader, [
    textures.map,
    textures.night,
    textures.clouds,
  ])

  useMemo(() => {
    if (dayMap) {
      dayMap.colorSpace = THREE.SRGBColorSpace;
      dayMap.anisotropy = 16;
    }
    if (nightMap) {
      nightMap.colorSpace = THREE.SRGBColorSpace;
      nightMap.anisotropy = 16;
    }
    if (cloudsMap) {
      cloudsMap.anisotropy = 16;
    }
  }, [dayMap, nightMap, cloudsMap])

  const cloudRef = useRef()

  const earthUniforms = useMemo(() => ({
    uDayMap:      { value: dayMap },
    uNightMap:    { value: nightMap },
    uSunPosition: { value: SUN_POSITION },
  }), [dayMap, nightMap])

  useFrame(() => {
    if (cloudRef.current) {
      const simTime = useSolarStore.getState().simulationTime
      cloudRef.current.rotation.y = simTime * 0.006
    }
  })

  return (
    <>
      <mesh renderOrder={1} castShadow receiveShadow>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          vertexShader={earthVertexShader}
          fragmentShader={earthFragmentShader}
          uniforms={earthUniforms}
        />
      </mesh>

      <mesh ref={cloudRef} scale={1.015} renderOrder={2}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent
          opacity={0.45}
          depthWrite={false}
          roughness={1}
          metalness={0}
          blending={THREE.NormalBlending}
        />
      </mesh>

      {/* Atmospheric halo - ONLY EARTH */}
      <Atmosphere color="#4fc3f7" scale={1.035} />
    </>
  )
}

// ─── Generic Planet Layers (Single Solid Mesh) ───────────────────────────────
function GenericPlanetLayers({ name, textures }) {
  const maps = useLoader(THREE.TextureLoader, [textures.map])
  const colorMap = maps[0]

  useMemo(() => {
    if (colorMap) {
      colorMap.colorSpace = THREE.SRGBColorSpace;
      colorMap.anisotropy = 16;
    }
  }, [colorMap])

  // PBR Matrix: Gas Giants vs Rocky Planets
  const isGasGiant = ['مشتری (برجیس)', 'زحل (کیوان)', 'اورانوس', 'نپتون'].includes(name)
  const roughness = isGasGiant ? 0.70 : 0.85
  const metalness = isGasGiant ? 0.02 : 0.0

  return (
    <mesh renderOrder={1} castShadow receiveShadow>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        map={colorMap}
        roughness={roughness}
        metalness={metalness}
      />
    </mesh>
  )
}

// ─── Master Planet Component ──────────────────────────────────────────────────
export default function Planet({ data }) {
  const {
    name, radius, distance, speed, rotationSpeed,
    axialTilt, textures,
    hasRings, isEarth, ringConfig,
  } = data

  const pivotRef  = useRef()
  const groupRef  = useRef()

  useFrame(() => {
    const t = useSolarStore.getState().simulationTime
    const virtualDays = t / 86400;

    if (pivotRef.current) {
      if (data.isMoon) {
        const earthMesh = shipState.planetMeshes['زمین']
        if (earthMesh) {
          const earthPos = new THREE.Vector3()
          earthMesh.getWorldPosition(earthPos)
          
          const moonAngle = virtualDays * 0.23
          const orbitDist = 20
          
          pivotRef.current.position.x = earthPos.x + Math.sin(moonAngle) * orbitDist
          pivotRef.current.position.z = earthPos.z + Math.cos(moonAngle) * orbitDist
          pivotRef.current.position.y = earthPos.y + Math.sin(moonAngle * 0.5) * 5
        }
      } else {
        pivotRef.current.position.x = Math.sin(virtualDays * speed) * distance
        pivotRef.current.position.z = Math.cos(virtualDays * speed) * distance
      }
    }

    if (groupRef.current) {
      groupRef.current.rotation.y = (virtualDays * rotationSpeed) % (Math.PI * 2)
      shipState.planetMeshes[name] = groupRef.current
    }
  })

  const selectPlanet = useSolarStore(state => state.selectPlanet)

  return (
    <group ref={pivotRef}>
      <group 
        ref={groupRef} 
        rotation={[0, 0, axialTilt]} 
        scale={[radius, radius, radius]}
        onClick={(e) => {
          e.stopPropagation()
          selectPlanet(data)
        }}
        onPointerOver={() => { document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { document.body.style.cursor = 'auto' }}
      >
        {name === 'خورشید' && (
          <mesh visible={false}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial />
          </mesh>
        )}

        {isEarth && name !== 'خورشید' && (
          <EarthLayers textures={textures} radius={radius} />
        )}

        {!isEarth && name !== 'خورشید' && (
          <GenericPlanetLayers
            name={name}
            textures={textures}
          />
        )}
      </group>

      {hasRings && ringConfig && (
        <group rotation={[0, 0, axialTilt]} scale={[radius, radius, radius]}>
          <PlanetRing
            planetName={name}
            config={{
              innerRadius: ringConfig.innerRadius,
              outerRadius: ringConfig.outerRadius,
              color: ringConfig.color,
              texturePath: ringConfig.texturePath || textures.ring,
            }}
          />
        </group>
      )}

      {data.moons && data.moons.map((moon, idx) => (
        <Planet key={idx} data={moon} />
      ))}
    </group>
  )
}
