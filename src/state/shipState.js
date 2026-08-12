import * as THREE from 'three'

// ─── Shared mutable ship state ────────────────────────────────────────────────
// Accessed directly inside useFrame loops — no re-render overhead.
// Prompt 4 (GSAP navigation) will update targetPosition to drive flight.

export const shipState = {
  // Live world position (updated every frame by Spaceship.jsx)
  position: new THREE.Vector3(0, 250, 850),

  // Current orientation quaternion
  quaternion: new THREE.Quaternion(),

  // GSAP navigation target (set by UI in Prompt 4)
  targetPosition: new THREE.Vector3(0, 0, 0),

  // Forward direction vector (nose of the ship)
  forward: new THREE.Vector3(0, 0, -1),

  // Flight state flags
  isMoving: false,
  followCamera: false,   // when true → CameraRig overrides OrbitControls
  flightProgress: 0,     // 0 to 1 GSAP animation progress

  // Thrust intensity 0–1 (drives ThrusterGlow pulse amplitude)
  thrustLevel: 0.4,

  // Registry for absolute world positions (populated by Planet.jsx)
  planetMeshes: {},
}
