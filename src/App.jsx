import React, { Suspense, useState, useEffect } from 'react'
import { useProgress } from '@react-three/drei'
import Scene from './components/canvas/Scene'
import Sidebar from './components/ui/Sidebar'
import TimeController from './components/ui/TimeController'

function CustomLoader() {
  const { progress, active } = useProgress()
  const [show, setShow] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // 8s maximum loading safety cap — user will NEVER be stuck on loading screen
    const maxTimeout = setTimeout(() => {
      setFadeOut(true)
      setTimeout(() => setShow(false), 500)
    }, 8000)

    // Fade out ONLY when 100% of planet textures & assets are preloaded in GPU memory
    if (progress >= 100 || !active) {
      const quickTimer = setTimeout(() => {
        setFadeOut(true)
        const hideTimer = setTimeout(() => {
          setShow(false)
        }, 500)
        return () => clearTimeout(hideTimer)
      }, 300)
      return () => {
        clearTimeout(quickTimer)
        clearTimeout(maxTimeout)
      }
    }

    return () => clearTimeout(maxTimeout)
  }, [progress, active])

  if (!show) return null

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#02030a] text-white transition-opacity duration-700 pointer-events-none ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      dir="rtl"
    >
      {/* Animated Orbit Loader Icon */}
      <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping" />
        <div className="absolute inset-2 rounded-full border-t-2 border-r-2 border-cyan-400 animate-spin" />
        <div className="w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_15px_#00e5ff]" />
      </div>

      {/* Progress Bar Container */}
      <div className="w-72 h-1.5 bg-white/10 rounded-full overflow-hidden mb-4 p-0.5 border border-white/5">
        <div 
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300 shadow-[0_0_10px_#00e5ff]"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {/* Status Text */}
      <div className="flex flex-col items-center space-y-1">
        <span className="text-sm font-bold tracking-widest text-cyan-400 animate-pulse">
          در حال بارگذاری منظومه شمسی... {Math.round(progress)}%
        </span>
        <span className="text-xs text-gray-500">
          آماده‌سازی متریال‌ها و پردازش گرافیکی
        </span>
      </div>
    </div>
  )
}

import PlanetComparisonModal from './components/ui/PlanetComparisonModal'
import SpacecraftInfoModal from './components/ui/SpacecraftInfoModal'
import QuizModal from './components/ui/QuizModal'

export default function App() {
  return (
    <div className="w-full h-full bg-[#02030a]" dir="rtl">
      <CustomLoader />
      <QuizModal />
      <PlanetComparisonModal />
      <SpacecraftInfoModal />
      <Suspense fallback={null}>
        <Scene />
        <Sidebar />
        <TimeController />
      </Suspense>
    </div>
  )
}
