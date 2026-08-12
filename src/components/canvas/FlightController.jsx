import { useEffect, useRef } from 'react'
import { useSolarStore } from '../../store/useSolarStore'
import { shipState } from '../../state/shipState'
import gsap from 'gsap'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'

export default function FlightController({ orbitControlsRef }) {
  const { selectedPlanet, setTraveling } = useSolarStore()
  const tlRef = useRef(null)

  useEffect(() => {
    if (!selectedPlanet) {
      if (tlRef.current) tlRef.current.kill()

      // Return trip to outer system view if previously attached to a planet
      if (shipState.targetPlanet) {
        shipState.targetPlanet = null
        shipState.targetPosition.set(0, 250, 850)
        shipState.isMoving = true
        shipState.followCamera = true
        shipState.flightProgress = 0

        const tl = gsap.timeline({
          onComplete: () => {
            shipState.isMoving = false
            shipState.followCamera = false
            if (orbitControlsRef?.current) {
              gsap.to(orbitControlsRef.current.target, {
                x: 0,
                y: 0,
                z: 0,
                duration: 1.5,
                ease: 'power2.out'
              })
            }
          }
        })
        tlRef.current = tl

        tl.to(shipState, { thrustLevel: 1.0, duration: 0.8, ease: 'power2.inOut' })
        tl.to(shipState, { flightProgress: 1, duration: 3.0, ease: 'power3.inOut' }, "<0.1")
        tl.to(shipState, { thrustLevel: 0.4, duration: 1.2, ease: 'power2.out' }, "-=1.0")
      } else {
        shipState.isMoving = false
        shipState.followCamera = false
        shipState.targetPlanet = null
      }
      return
    }

    // A planet was selected. Start flight sequence.
    if (tlRef.current) tlRef.current.kill()

    shipState.isMoving = true
    shipState.followCamera = true
    shipState.targetPlanet = selectedPlanet
    shipState.flightProgress = 0

    // Dynamic Duration Calculation for a slow, majestic, cinematic flight (40% slower)
    const currentDist = shipState.position.length()
    const targetDist = selectedPlanet.distance || 0
    const distanceDelta = Math.abs(currentDist - targetDist)
    
    // Reduced speed by 40%: Minimum 7.5s for close planets, up to 15.0s for distant planets
    const isAlreadyAtTarget = shipState.targetPlanet?.name === selectedPlanet.name
    const flightDuration = isAlreadyAtTarget ? 2.0 : Math.min(15.0, Math.max(7.5, distanceDelta * 0.009))

    const tl = gsap.timeline({
      onComplete: () => {
        shipState.isMoving = false
        // Smooth 1.5s pause after arrival before opening the information panel
        setTimeout(() => {
          setTraveling(false)
        }, 1500)
        
        // As soon as we arrive, smoothly re-center the orbit controls onto the newly arrived planet
        if (orbitControlsRef?.current) {
          const targetMesh = shipState.planetMeshes[selectedPlanet.name]
          if (targetMesh) {
            const exactPos = new THREE.Vector3()
            targetMesh.getWorldPosition(exactPos)
            orbitControlsRef.current.target.copy(exactPos)
          }
        }
      }
    })
    tlRef.current = tl

    // Phase 1: Power up thrusters smoothly
    tl.to(shipState, { thrustLevel: 1.0, duration: 1.6, ease: 'sine.inOut' })

    // Phase 2: Majestic space cruise over smooth S-curve
    tl.to(shipState, {
      flightProgress: 1,
      duration: flightDuration,
      ease: 'sine.inOut'
    }, "<0.1")

    // Phase 3: Gentle deceleration as we arrive
    tl.to(shipState, { thrustLevel: 0.4, duration: 2.2, ease: 'sine.out' }, "-=2.2")

    return () => {
      if (tlRef.current) tlRef.current.kill()
    }
  }, [selectedPlanet, setTraveling, orbitControlsRef])

  return null
}
