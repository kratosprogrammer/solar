import React, { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { shipState } from '../../state/shipState'
import { useSolarStore } from '../../store/useSolarStore'

const _camTarget  = new THREE.Vector3()
const _camPos     = new THREE.Vector3()
const _shipFwd    = new THREE.Vector3()
const _offset     = new THREE.Vector3()
const _moveDir    = new THREE.Vector3()
const _camFwd     = new THREE.Vector3()
const _camRight   = new THREE.Vector3()

export default function CameraRig({ orbitControlsRef }) {
  const { camera } = useThree()
  const isFreeCamera = useSolarStore(state => state.isFreeCamera)
  const selectedPlanet = useSolarStore(state => state.selectedPlanet)

  const keys = useRef({ w: false, a: false, s: false, d: false })

  useEffect(() => {
    const handleKeyDown = (e) => {
      const k = e.key.toLowerCase()
      if (e.code === 'KeyW' || k === 'w' || k === 'ص') keys.current.w = true
      if (e.code === 'KeyS' || k === 's' || k === 'س') keys.current.s = true
      if (e.code === 'KeyA' || k === 'a' || k === 'ش') keys.current.a = true
      if (e.code === 'KeyD' || k === 'd' || k === 'ی') keys.current.d = true
    }

    const handleKeyUp = (e) => {
      const k = e.key.toLowerCase()
      if (e.code === 'KeyW' || k === 'w' || k === 'ص') keys.current.w = false
      if (e.code === 'KeyS' || k === 's' || k === 'س') keys.current.s = false
      if (e.code === 'KeyA' || k === 'a' || k === 'ش') keys.current.a = false
      if (e.code === 'KeyD' || k === 'd' || k === 'ی') keys.current.d = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useFrame((state, delta) => {
    // ── Free Camera Mode (WASD Movement) ──
    if (isFreeCamera) {
      if (orbitControlsRef?.current && !orbitControlsRef.current.enabled) {
        orbitControlsRef.current.enabled = true
      }

      _moveDir.set(0, 0, 0)
      camera.getWorldDirection(_camFwd)
      _camRight.crossVectors(_camFwd, camera.up).normalize()

      if (keys.current.w) _moveDir.add(_camFwd)
      if (keys.current.s) _moveDir.sub(_camFwd)
      if (keys.current.d) _moveDir.add(_camRight)
      if (keys.current.a) _moveDir.sub(_camRight)

      if (_moveDir.lengthSq() > 0) {
        _moveDir.normalize()
        const flySpeed = 270 * delta
        _moveDir.multiplyScalar(flySpeed)

        camera.position.add(_moveDir)
        if (orbitControlsRef?.current) {
          orbitControlsRef.current.target.add(_moveDir)
          orbitControlsRef.current.update()
        }
      }

      return
    }

    // ── Ship Follow Mode ──
    if (shipState.followCamera) {
      if (orbitControlsRef?.current) {
        orbitControlsRef.current.enabled = false
      }

      const shipPos = shipState.position
      _shipFwd.set(0, 0, -1).applyQuaternion(shipState.quaternion)

      // Smooth cinematic follow offset behind ship
      _offset.set(0, 3.0, 10).applyQuaternion(shipState.quaternion)

      _camPos.copy(shipPos).add(_offset)
      // Tight camera tracking during flight so camera NEVER loses sight of the ship
      const lerpSpeed = shipState.isMoving ? 0.35 : 0.08
      camera.position.lerp(_camPos, lerpSpeed)

      _camTarget.copy(shipPos).addScaledVector(_shipFwd, 6)
      camera.lookAt(_camTarget)

      // Subtle, elegant FOV Warp Effect during cruise (45 to 50 degrees)
      const speedPulse = shipState.isMoving ? Math.sin(shipState.flightProgress * Math.PI) : 0
      const targetFov = 45 + (speedPulse * 5)
      if (Math.abs(camera.fov - targetFov) > 0.05) {
        camera.fov += (targetFov - camera.fov) * 0.05
        camera.updateProjectionMatrix()
      }
    } else {
      // ── System Orbit View ── Re-enable OrbitControls and smoothly lock target to selected planet ──
      if (orbitControlsRef?.current) {
        if (!orbitControlsRef.current.enabled) {
          orbitControlsRef.current.enabled = true
        }

        if (selectedPlanet) {
          if (selectedPlanet.name === 'کمربند سیارکی') {
            _camTarget.set(280, 18, 0)
            orbitControlsRef.current.target.lerp(_camTarget, 0.08)
            orbitControlsRef.current.update()
          } else {
            const targetMesh = shipState.planetMeshes[selectedPlanet.name]
            if (targetMesh) {
              targetMesh.getWorldPosition(_camTarget)
              orbitControlsRef.current.target.lerp(_camTarget, 0.08)
              orbitControlsRef.current.update()
            }
          }
        }
      }
    }
  })

  return null
}
