import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { shipState } from '../../state/shipState'
import { useSolarStore } from '../../store/useSolarStore'
import ThrusterGlow from './ThrusterGlow'

const MODEL_PATH = '/assets/models/Spaceship by Quaternius - uCeLfsdmNP.glb'

useGLTF.preload(MODEL_PATH)

// ─── Quaternion helpers ───────────────────────────────────────────────────────
const _targetQuat = new THREE.Quaternion()
const _targetDir  = new THREE.Vector3()
const _upVec      = new THREE.Vector3(0, 1, 0)
const _matrix     = new THREE.Matrix4()
const _bezierPos  = new THREE.Vector3()

export default function Spaceship() {
  const groupRef = useRef()
  const { scene: gltfScene } = useGLTF(MODEL_PATH)

  const startPos = useRef(new THREE.Vector3())
  const targetPos = useRef(new THREE.Vector3())
  const wasMoving = useRef(false)
  const idleOrbitAngle = useRef(0)

  useEffect(() => {
    if (!gltfScene) return

    gltfScene.traverse((child) => {
      if (!child.isMesh) return

      child.castShadow    = true
      child.receiveShadow = true

      if (child.material) {
        child.material = child.material.clone()
        child.material.metalness   = Math.max(child.material.metalness ?? 0.5, 0.75)
        child.material.roughness   = Math.min(child.material.roughness ?? 0.5, 0.35)
        child.material.envMapIntensity = 1.5
        child.material.needsUpdate = true
      }
    })
  }, [gltfScene])

  useFrame(() => {
    if (!groupRef.current) return
    const simTime = useSolarStore.getState().simulationTime
    const timeScale = useSolarStore.getState().timeScale

    if (shipState.isMoving) {
      if (!wasMoving.current) {
        startPos.current.copy(groupRef.current.position)
        wasMoving.current = true
      }

      if (shipState.targetPlanet) {
        const { name, radius } = shipState.targetPlanet
        
        if (name === 'کمربند سیارکی') {
          targetPos.current.set(280, 18, 0)
        } else {
          const targetMesh = shipState.planetMeshes[name]
          if (targetMesh) {
            targetMesh.getWorldPosition(targetPos.current)
            
            let offsetDist = radius * 3.5
            let sunlitDir = new THREE.Vector3(0, 0, 1)

            if (name === 'خورشید') {
              offsetDist = 100
              sunlitDir.set(0, 0.2, 1).normalize()
            } else {
              const toPlanet = targetPos.current.clone().normalize()
              sunlitDir = toPlanet.clone().negate()
              if (name === 'ماه' || radius < 3) offsetDist = 22
            }
            targetPos.current.addScaledVector(sunlitDir, offsetDist)
            targetPos.current.y += Math.max(radius * 0.8, 4)
          }
        }
      } else {
        targetPos.current.copy(shipState.targetPosition)
      }

      // Smooth direct linear flight trajectory without wild arcs or dizzying rolls
      const progress = shipState.flightProgress
      _bezierPos.lerpVectors(startPos.current, targetPos.current, progress)

      _targetDir.copy(targetPos.current).sub(groupRef.current.position).normalize()

      if (_targetDir.length() > 0.01) {
        _matrix.lookAt(groupRef.current.position, groupRef.current.position.clone().add(_targetDir), _upVec)
        _targetQuat.setFromRotationMatrix(_matrix)
        groupRef.current.quaternion.slerp(_targetQuat, 0.05)
      }

      groupRef.current.position.copy(_bezierPos)
      
    } else {
      wasMoving.current = false
      
      // ── Planet Attachment Docking Mode (Sunlit Face) ──
      if (shipState.targetPlanet) {
        const { name, radius } = shipState.targetPlanet
        
        if (name === 'کمربند سیارکی') {
          const beltCenter = new THREE.Vector3(364, 0, 0)
          targetPos.current.set(364, 15, 25)
          groupRef.current.position.copy(targetPos.current)
          _matrix.lookAt(groupRef.current.position, beltCenter, _upVec)
          _targetQuat.setFromRotationMatrix(_matrix)
          groupRef.current.quaternion.slerp(_targetQuat, 0.1)
        } else {
          const targetMesh = shipState.planetMeshes[name]
          if (targetMesh) {
            const planetPos = new THREE.Vector3()
            targetMesh.getWorldPosition(planetPos)

            let offsetDist = radius * 3.5
            let sunlitDir = new THREE.Vector3(0, 0, 1)

            if (name === 'خورشید') {
              offsetDist = 100 // Safe 100u distance away from Sun center (Sun radius is 20)
              sunlitDir.set(0, 0.2, 1).normalize()
            } else {
              const toPlanet = planetPos.clone().normalize()
              sunlitDir = toPlanet.clone().negate()
              
              idleOrbitAngle.current += 0.003
              const swingAngle = Math.sin(idleOrbitAngle.current) * 0.4
              sunlitDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), swingAngle)

              if (name === 'ماه' || radius < 3) {
                offsetDist = 22 // Safe distance so ship never clips inside Earth or Moon
              }
            }
            
            targetPos.current.copy(planetPos).addScaledVector(sunlitDir, offsetDist)
            targetPos.current.y += Math.max(radius * 0.8, 4)

            // Move ship directly to sunlit orbit position
            groupRef.current.position.copy(targetPos.current)

            // Ship looks directly at the illuminated planet center
            _matrix.lookAt(groupRef.current.position, planetPos, _upVec)
            _targetQuat.setFromRotationMatrix(_matrix)
            groupRef.current.quaternion.slerp(_targetQuat, 0.1)
          }
        }

      } else {
        // Deep space idle drift
        groupRef.current.position.y += Math.sin(performance.now() * 0.001) * 0.003
        groupRef.current.rotation.y += 0.0008
      }
    }

    // ── Sync shared state every frame ──
    groupRef.current.getWorldPosition(shipState.position)
    groupRef.current.getWorldQuaternion(shipState.quaternion)
  })

  return (
    <group
      ref={groupRef}
      position={[0, 250, 850]}
      scale={[0.16, 0.16, 0.16]}
    >
      <group rotation={[0, Math.PI, 0]}>
        <primitive object={gltfScene} />
        <ThrusterGlow offset={[0, -0.3, 1.2]} />
        <ThrusterGlow offset={[0.35, -0.3, 1.1]} />
        <ThrusterGlow offset={[-0.35, -0.3, 1.1]} />
      </group>
    </group>
  )
}
