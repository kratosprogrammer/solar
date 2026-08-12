import React, { useState, useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useSolarStore } from '../../store/useSolarStore'

const CELESTIAL_BODIES = [
  {
    name: 'زمین',
    enName: 'EARTH',
    type: 'PLANET',
    typeFa: 'سیاره',
    radiusKm: '6,371 کیلومتر',
    relativeRatio: '1.0 × زمین',
    realRadius: 6,
    texture: '/assets/textures/earth_daymap.jpg',
    color: '#4fc3f7',
  },
  {
    name: 'ماه',
    enName: 'MOON',
    type: 'MOON',
    typeFa: 'قمر',
    radiusKm: '1,737 کیلومتر',
    relativeRatio: '0.27 × زمین',
    realRadius: 1.6,
    texture: '/assets/textures/moon.jpg',
    color: '#cccccc',
  },
  {
    name: 'خورشید',
    enName: 'SUN',
    type: 'STAR',
    typeFa: 'ستاره',
    radiusKm: '696,340 کیلومتر',
    relativeRatio: '109 × زمین',
    realRadius: 20, // Scaled for comfortable 3D viewport comparison
    texture: '/assets/textures/sun.jpg',
    color: '#ffaa00',
    isSun: true,
  },
  {
    name: 'عطارد (تیر)',
    enName: 'MERCURY',
    type: 'PLANET',
    typeFa: 'سیاره',
    radiusKm: '2,439 کیلومتر',
    relativeRatio: '0.38 × زمین',
    realRadius: 2.4,
    texture: '/assets/textures/mercury.jpg',
    color: '#a0a0a0',
  },
  {
    name: 'زهره (ناهید)',
    enName: 'VENUS',
    type: 'PLANET',
    typeFa: 'سیاره',
    radiusKm: '6,051 کیلومتر',
    relativeRatio: '0.95 × زمین',
    realRadius: 5.5,
    texture: '/assets/textures/venus_surface.jpg',
    color: '#ffcc66',
  },
  {
    name: 'مریخ (بهرام)',
    enName: 'MARS',
    type: 'PLANET',
    typeFa: 'سیاره',
    radiusKm: '3,389 کیلومتر',
    relativeRatio: '0.53 × زمین',
    realRadius: 3.5,
    texture: '/assets/textures/mars.jpg',
    color: '#ff7043',
  },
  {
    name: 'مشتری (برجیس)',
    enName: 'JUPITER',
    type: 'PLANET',
    typeFa: 'سیاره',
    radiusKm: '69,911 کیلومتر',
    relativeRatio: '11.0 × زمین',
    realRadius: 14,
    texture: '/assets/textures/jupiter.jpg',
    color: '#e8c49a',
  },
  {
    name: 'زحل (کیوان)',
    enName: 'SATURN',
    type: 'PLANET',
    typeFa: 'سیاره',
    radiusKm: '58,232 کیلومتر',
    relativeRatio: '9.1 × زمین',
    realRadius: 11,
    texture: '/assets/textures/saturn.jpg',
    ringTexture: '/assets/textures/saturn_ring_alpha.png',
    hasRing: true,
    color: '#c8a96e',
  },
  {
    name: 'اورانوس',
    enName: 'URANUS',
    type: 'PLANET',
    typeFa: 'سیاره',
    radiusKm: '25,362 کیلومتر',
    relativeRatio: '4.0 × زمین',
    realRadius: 8,
    texture: '/assets/textures/uranus.jpg',
    color: '#7de8e8',
  },
  {
    name: 'نپتون',
    enName: 'NEPTUNE',
    type: 'PLANET',
    typeFa: 'سیاره',
    radiusKm: '24,622 کیلومتر',
    relativeRatio: '3.88 × زمین',
    realRadius: 7.5,
    texture: '/assets/textures/neptune.jpg',
    color: '#3f8ef5',
  },
]

function PlanetPreviewMesh({ body }) {
  const meshRef = useRef()
  const texture = useTexture(body.texture)
  const ringTex = useTexture(body.ringTexture || '/assets/textures/saturn_ring_alpha.png')

  useMemo(() => {
    if (texture) texture.colorSpace = THREE.SRGBColorSpace
    if (ringTex) {
      ringTex.colorSpace = THREE.SRGBColorSpace
      ringTex.center.set(0.5, 0.5)
      ringTex.rotation = Math.PI / 2
    }
  }, [texture, ringTex])

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
    }
  })

  // Scale relative to reference body (Earth = 6)
  const displayScale = (body.realRadius / 6) * 1.8

  return (
    <group scale={[displayScale, displayScale, displayScale]} rotation={[0.2, 0.5, 0]}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          emissive={body.isSun ? '#ff5500' : '#000000'}
          emissiveMap={body.isSun ? texture : null}
          emissiveIntensity={body.isSun ? 0.4 : 0}
          roughness={body.isSun ? 0.5 : 0.85}
          metalness={0.0}
        />
      </mesh>

      {body.hasRing && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.3, 2.3, 64]} />
          <meshStandardMaterial
            map={ringTex}
            emissive="#e0c28d"
            emissiveMap={ringTex}
            emissiveIntensity={0.8}
            transparent
            alphaTest={0.01}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  )
}

export default function PlanetComparisonModal() {
  const { isScaleComparisonMode, toggleScaleComparisonMode } = useSolarStore()

  const [leftIndex, setLeftIndex] = useState(0)  // Earth by default
  const [rightIndex, setRightIndex] = useState(1) // Moon by default

  if (!isScaleComparisonMode) return null

  const leftBody = CELESTIAL_BODIES[leftIndex]
  const rightBody = CELESTIAL_BODIES[rightIndex]

  const handlePrevLeft = () => {
    setLeftIndex((prev) => (prev > 0 ? prev - 1 : CELESTIAL_BODIES.length - 1))
  }

  const handleNextLeft = () => {
    setLeftIndex((prev) => (prev < CELESTIAL_BODIES.length - 1 ? prev + 1 : 0))
  }

  const handlePrevRight = () => {
    setRightIndex((prev) => (prev > 0 ? prev - 1 : CELESTIAL_BODIES.length - 1))
  }

  const handleNextRight = () => {
    setRightIndex((prev) => (prev < CELESTIAL_BODIES.length - 1 ? prev + 1 : 0))
  }

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 text-white flex flex-col font-sans select-none" dir="rtl">
      
      {/* Top Header (RTL Standard: Title on Right, Close X on Left) */}
      <div className="flex justify-between items-center px-8 py-5 border-b border-white/10 shrink-0">
        <h2 className="text-xl font-bold text-[#00e5ff] tracking-widest" style={{ textShadow: '0 0 10px rgba(0, 229, 255, 0.4)' }}>
          📊 حالت مقایسه اندازه و مقیاس سیارات
        </h2>

        <button
          onClick={toggleScaleComparisonMode}
          className="text-gray-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/15 flex items-center gap-2 text-xs font-bold"
          title="بستن مقایسه"
        >
          <span>خروج از مقایسه</span>
          <X size={20} />
        </button>
      </div>

      {/* Main Split Comparison Canvas Grid */}
      <div className="flex-1 grid grid-cols-2 divide-x divide-x-reverse divide-white/10 overflow-hidden">
        
        {/* RIGHT (FIRST IN RTL): FIRST SELECTED CELESTIAL BODY */}
        <div className="relative flex flex-col items-center justify-between p-8">
          
          {/* Arrow Left */}
          <button
            onClick={handlePrevRight}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all backdrop-blur-md"
            title="جرم بعدی"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Arrow Right */}
          <button
            onClick={handleNextRight}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all backdrop-blur-md"
            title="جرم قبلی"
          >
            <ChevronRight size={24} />
          </button>

          {/* 3D Planet View */}
          <div className="w-full flex-1 flex items-center justify-center cursor-grab active:cursor-grabbing">
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 10]} intensity={1.8} />
              <OrbitControls enableZoom={true} enablePan={false} autoRotate={false} />
              <Suspense fallback={null}>
                <PlanetPreviewMesh body={rightBody} />
              </Suspense>
            </Canvas>
          </div>

          {/* Planet Info Footer */}
          <div className="text-center mt-4">
            <h3 className="text-4xl font-extrabold mb-2 tracking-wide text-white">{rightBody.name}</h3>
            <p className="text-sm text-gray-300 font-medium tracking-wider">
              نوع: <span className="text-cyan-400 font-bold">{rightBody.typeFa} ({rightBody.enName})</span> &nbsp;|&nbsp; شعاع نسبی: <span className="text-cyan-400 font-bold">{rightBody.relativeRatio}</span>
            </p>
          </div>
        </div>

        {/* LEFT (SECOND IN RTL): SECOND SELECTED CELESTIAL BODY */}
        <div className="relative flex flex-col items-center justify-between p-8">
          
          {/* Arrow Left */}
          <button
            onClick={handlePrevLeft}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all backdrop-blur-md"
            title="جرم بعدی"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Arrow Right */}
          <button
            onClick={handleNextLeft}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all backdrop-blur-md"
            title="جرم قبلی"
          >
            <ChevronRight size={24} />
          </button>

          {/* 3D Planet View */}
          <div className="w-full flex-1 flex items-center justify-center cursor-grab active:cursor-grabbing">
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 10]} intensity={1.8} />
              <OrbitControls enableZoom={true} enablePan={false} autoRotate={false} />
              <Suspense fallback={null}>
                <PlanetPreviewMesh body={leftBody} />
              </Suspense>
            </Canvas>
          </div>

          {/* Planet Info Footer */}
          <div className="text-center mt-4">
            <h3 className="text-4xl font-extrabold mb-2 tracking-wide text-white">{leftBody.name}</h3>
            <p className="text-sm text-gray-300 font-medium tracking-wider">
              نوع: <span className="text-cyan-400 font-bold">{leftBody.typeFa} ({leftBody.enName})</span> &nbsp;|&nbsp; شعاع واقعی: <span className="text-cyan-400 font-bold">{leftBody.radiusKm}</span>
            </p>
          </div>
        </div>

      </div>

    </div>
  )
}
