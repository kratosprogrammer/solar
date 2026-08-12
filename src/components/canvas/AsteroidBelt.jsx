import React, { useRef, useMemo } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { useSolarStore } from '../../store/useSolarStore'
import { asteroidBeltData } from '../../config/planetsData'

export default function AsteroidBelt() {
  const meshRoundRef  = useRef()
  const meshOvalRef   = useRef()
  const meshJaggedRef = useRef()

  const selectPlanet = useSolarStore(state => state.selectPlanet)

  // Re-use cached moon texture for surface details (0 extra download size!)
  const rockTexture = useLoader(THREE.TextureLoader, '/assets/textures/moon.jpg')

  useMemo(() => {
    if (rockTexture) {
      rockTexture.colorSpace = THREE.SRGBColorSpace
      rockTexture.wrapS = THREE.RepeatWrapping
      rockTexture.wrapT = THREE.RepeatWrapping
      rockTexture.repeat.set(2, 2)
    }
  }, [rockTexture])

  // Generate 1500 asteroids split into 3 distinct geometric shapes (Round, Oval, Jagged)
  // Positioned in expanded belt range 345 to 385 (between Mars @308 and Jupiter @420)
  const { roundData, ovalData, jaggedData } = useMemo(() => {
    const totalCount = 1500
    const dummy = new THREE.Object3D()

    const round = { count: 500, matrices: [] }
    const oval = { count: 500, matrices: [] }
    const jagged = { count: 500, matrices: [] }

    const groups = [round, oval, jagged]

    for (let i = 0; i < totalCount; i++) {
      const targetGroup = groups[i % 3]

      // Radius between 250 and 310 (centered ~280)
      const radius = 250 + Math.random() * 60
      const angle = Math.random() * Math.PI * 2

      // Position in orbital plane with slight inclination
      const x = Math.cos(angle) * radius
      const y = (Math.random() - 0.5) * 22
      const z = Math.sin(angle) * radius

      dummy.position.set(x, y, z)

      // Random non-uniform 3D scale variation (Oval, Spherical, Oblong) — 2x larger for easy clicking
      const isOblong = Math.random() > 0.5
      const baseScale = 0.54 + Math.random() * 1.44
      const scaleX = baseScale * (isOblong ? 0.6 + Math.random() * 1.3 : 1)
      const scaleY = baseScale * (isOblong ? 0.5 + Math.random() * 0.9 : 1)
      const scaleZ = baseScale * (isOblong ? 0.7 + Math.random() * 1.2 : 1)
      dummy.scale.set(scaleX, scaleY, scaleZ)

      // Random 3D orientation
      dummy.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      )

      dummy.updateMatrix()
      targetGroup.matrices.push(dummy.matrix.clone())
    }

    return { roundData: round, ovalData: oval, jaggedData: jagged }
  }, [])

  // Handle clicking on ANY asteroid in the belt
  const handleClick = (e) => {
    e.stopPropagation()
    selectPlanet(asteroidBeltData)
  }

  // Slow realistic orbital revolution around the Sun
  useFrame((state, delta) => {
    const rotSpeed = delta * 0.01
    if (meshRoundRef.current) meshRoundRef.current.rotation.y += rotSpeed
    if (meshOvalRef.current) meshOvalRef.current.rotation.y += rotSpeed
    if (meshJaggedRef.current) meshJaggedRef.current.rotation.y += rotSpeed
  })

  return (
    <group 
      onClick={handleClick}
      onPointerOver={() => { document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { document.body.style.cursor = 'auto' }}
    >
      {/* ── 1. Round Asteroids (Dodecahedron) ── */}
      <instancedMesh
        ref={(ref) => {
          meshRoundRef.current = ref
          if (ref) {
            for (let i = 0; i < roundData.count; i++) {
              ref.setMatrixAt(i, roundData.matrices[i])
            }
            ref.instanceMatrix.needsUpdate = true
          }
        }}
        args={[null, null, roundData.count]}
        castShadow={false}
        receiveShadow={false}
      >
        <dodecahedronGeometry args={[1.3, 1]} />
        <meshStandardMaterial
          map={rockTexture}
          color="#9e978e"
          roughness={0.85}
          metalness={0.15}
        />
      </instancedMesh>

      {/* ── 2. Oval/Potato Asteroids (Icosahedron) ── */}
      <instancedMesh
        ref={(ref) => {
          meshOvalRef.current = ref
          if (ref) {
            for (let i = 0; i < ovalData.count; i++) {
              ref.setMatrixAt(i, ovalData.matrices[i])
            }
            ref.instanceMatrix.needsUpdate = true
          }
        }}
        args={[null, null, ovalData.count]}
        castShadow={false}
        receiveShadow={false}
      >
        <icosahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial
          map={rockTexture}
          color="#b0a89e"
          roughness={0.8}
          metalness={0.2}
        />
      </instancedMesh>

      {/* ── 3. Jagged/Irregular Asteroids (Tetrahedron) ── */}
      <instancedMesh
        ref={(ref) => {
          meshJaggedRef.current = ref
          if (ref) {
            for (let i = 0; i < jaggedData.count; i++) {
              ref.setMatrixAt(i, jaggedData.matrices[i])
            }
            ref.instanceMatrix.needsUpdate = true
          }
        }}
        args={[null, null, jaggedData.count]}
        castShadow={false}
        receiveShadow={false}
      >
        <tetrahedronGeometry args={[1.4, 1]} />
        <meshStandardMaterial
          map={rockTexture}
          color="#8c857c"
          roughness={0.9}
          metalness={0.1}
        />
      </instancedMesh>
    </group>
  )
}
