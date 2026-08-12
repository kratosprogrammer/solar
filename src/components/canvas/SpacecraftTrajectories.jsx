import React, { useMemo } from 'react'
import { Line, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useSolarStore } from '../../store/useSolarStore'

export const SPACECRAFT_DATA = {
  v1: {
    id: 'v1',
    name: 'کاوشگر وویجر ۱',
    enName: 'VOYAGER 1',
    agency: 'ناسا (NASA)',
    launchDate: '۵ سپتامبر ۱۹۷۷',
    status: 'در حال سفر در فضای بین‌ستاره‌ای',
    distance: '۲۴.۲ میلیارد کیلومتر از زمین (~۱۶۲ واحد نجومی)',
    speed: '۶۱,۰۰۰ کیلومتر بر ساعت',
    objective: 'بررسی منظومه شمسی بیرونی و عبور از مرز منظومه شمسی (هلیوپوز) به فضای بین‌ستاره‌ای.',
    achievements: [
      'دورترین شیء ساخته‌شده دست بشر در کیهان.',
      'اولین فضاپیما که وارد فضای بین‌ستاره‌ای شد (سال ۲۰۱۲).',
      'ثبت تصاویر تاریخی و ماندگار از مشتری، زحل و تصویر معروف "نقطه آبی کم‌رنگ" (Pale Blue Dot).',
      'حاوی لوح طلایی وویجر شامل صدای زمین، پیام‌های صوتی به ۵۵ زبان و موسیقی‌های بشر.'
    ]
  },
  v2: {
    id: 'v2',
    name: 'کاوشگر وویجر ۲',
    enName: 'VOYAGER 2',
    agency: 'ناسا (NASA)',
    launchDate: '۲۰ آگوست ۱۹۷۷',
    status: 'فعال در فضای بین‌ستاره‌ای',
    distance: '۲۰.۱ میلیارد کیلومتر از زمین (~۱۳۵ واحد نجومی)',
    speed: '۵۵,۰۰۰ کیلومتر بر ساعت',
    objective: 'ملاقات علمی و بررسی تمامی ۴ غول گازی منظومه شمسی (مشتری، زحل، اورانوس و نپتون).',
    achievements: [
      'تنها فضاپیمایی که تاکنون از اورانوس و نپتون بازدید کرده است.',
      'کشف ۱۴ قمر جدید و سیستم حلقه‌های باریک اورانوس و نپتون.',
      'دومین فضاپیمای دست بشر که وارد فضای بین‌ستاره‌ای شد (سال ۲۰۱۸).'
    ]
  },
  jwst: {
    id: 'jwst',
    name: 'تلسکوپ فضایی جیمز وب',
    enName: 'JAMES WEBB SPACE TELESCOPE',
    agency: 'ناسا / اسا / آژانس فضایی کانادا',
    launchDate: '۲۵ دسامبر ۲۰۲۱',
    status: 'فعال در نقطه لاگرانژی L2',
    distance: '۱.۵ میلیون کیلومتر از زمین',
    speed: 'مدار هاله دور نقطه L2',
    objective: 'مشاهده اولین کهکشان‌های متولدشده بعد از بیگ‌بنگ و تحلیل اتمسفر سیارات فراخورشیدی.',
    achievements: [
      'بزرگ‌ترین و قدرتمندترین تلسکوپ فروسرخ تاریخ بشر (آینه ۶.۵ متری با روکش طلا).',
      'عکس‌برداری عمیق از سحاب‌ها، کهکشان‌های اولیه با قدمت ۱۳.۵ میلیارد سال و جو سیارات خاکی خارج منظومه.',
      'استقرار در نقطه لاگرانژی L2 بدون تداخل حرارتی زمین و خورشید.'
    ]
  }
}

export default function SpacecraftTrajectories() {
  const { showTrajectories, selectedSpacecraft, setSelectedSpacecraft } = useSolarStore()

  // Earth Orbit baseline starting point (~175, 0, 0)
  const earthOrbitRadius = 175

  // Voyager 1 Trajectory Curve starting from Earth Orbit
  const voyager1Points = useMemo(() => {
    const pts = []
    for (let t = 0; t <= 1; t += 0.01) {
      const x = earthOrbitRadius + t * 750
      const y = t * t * 380
      const z = Math.sin(t * Math.PI) * 150 - t * 300
      pts.push(new THREE.Vector3(x, y, z))
    }
    return pts
  }, [earthOrbitRadius])

  // Voyager 2 Trajectory Curve starting from Earth Orbit
  const voyager2Points = useMemo(() => {
    const pts = []
    for (let t = 0; t <= 1; t += 0.01) {
      const x = earthOrbitRadius - t * 800
      const y = -t * t * 320
      const z = t * 450
      pts.push(new THREE.Vector3(x, y, z))
    }
    return pts
  }, [earthOrbitRadius])

  // JWST Lagrange Point L2 Orbit Curve near Earth
  const jwstPoints = useMemo(() => {
    const pts = []
    const radius = earthOrbitRadius + 15 // L2 is slightly past Earth
    for (let t = 0; t <= 1; t += 0.02) {
      const angle = t * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle * 2) * 4, Math.sin(angle) * radius))
    }
    return pts
  }, [earthOrbitRadius])

  if (!showTrajectories || selectedSpacecraft) return null

  return (
    <group>
      {/* Voyager 1 Path */}
      <Line
        points={voyager1Points}
        color="#00e5ff"
        lineWidth={1.5}
        dashed
        dashScale={5}
        transparent
        opacity={0.7}
      />
      <Html position={voyager1Points[voyager1Points.length - 1]} center>
        <button 
          onClick={() => setSelectedSpacecraft(SPACECRAFT_DATA.v1)}
          className="bg-[#002f3a]/90 hover:bg-[#004d60] text-[#00e5ff] border border-[#00e5ff] px-2.5 py-1 rounded text-xs font-bold whitespace-nowrap shadow-[0_0_12px_#00e5ff] transition-all cursor-pointer transform hover:scale-105"
          dir="rtl"
        >
          🚀 کاوشگر وویجر ۱ (Voyager 1)
        </button>
      </Html>

      {/* Voyager 2 Path */}
      <Line
        points={voyager2Points}
        color="#ffcc00"
        lineWidth={1.5}
        dashed
        dashScale={5}
        transparent
        opacity={0.7}
      />
      <Html position={voyager2Points[voyager2Points.length - 1]} center>
        <button 
          onClick={() => setSelectedSpacecraft(SPACECRAFT_DATA.v2)}
          className="bg-[#3a2f00]/90 hover:bg-[#5e4c00] text-[#ffcc00] border border-[#ffcc00] px-2.5 py-1 rounded text-xs font-bold whitespace-nowrap shadow-[0_0_12px_#ffcc00] transition-all cursor-pointer transform hover:scale-105"
          dir="rtl"
        >
          🛰️ کاوشگر وویجر ۲ (Voyager 2)
        </button>
      </Html>

      {/* JWST Path */}
      <Line
        points={jwstPoints}
        color="#ff4081"
        lineWidth={1.5}
        transparent
        opacity={0.75}
      />
      <Html position={[earthOrbitRadius + 15, 10, 0]} center>
        <button 
          onClick={() => setSelectedSpacecraft(SPACECRAFT_DATA.jwst)}
          className="bg-[#3a0020]/90 hover:bg-[#600035] text-[#ff4081] border border-[#ff4081] px-2.5 py-1 rounded text-xs font-bold whitespace-nowrap shadow-[0_0_12px_#ff4081] transition-all cursor-pointer transform hover:scale-105"
          dir="rtl"
        >
          🔭 تلسکوپ جیمز وب (JWST)
        </button>
      </Html>
    </group>
  )
}
