import React from 'react'
import { X, Rocket, Compass, Radio, Award } from 'lucide-react'
import { useSolarStore } from '../../store/useSolarStore'

export default function SpacecraftInfoModal() {
  const { selectedSpacecraft, setSelectedSpacecraft } = useSolarStore()

  if (!selectedSpacecraft) return null

  return (
    <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none" dir="rtl">
      
      <div className="w-full max-w-xl bg-[#080b12]/95 border border-[#00e5ff]/40 rounded-2xl p-6 shadow-[0_0_40px_rgba(0,229,255,0.25)] flex flex-col gap-5 text-white">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-white/10 pb-4">
          <div>
            <h2 className="text-2xl font-black text-[#00e5ff] tracking-wide mb-1" style={{ textShadow: '0 0 12px rgba(0, 229, 255, 0.4)' }}>
              {selectedSpacecraft.name}
            </h2>
            <p className="text-xs text-gray-400 font-mono tracking-widest uppercase">
              {selectedSpacecraft.enName} | {selectedSpacecraft.agency}
            </p>
          </div>

          <button
            onClick={() => setSelectedSpacecraft(null)}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
          >
            <X size={22} />
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-[#0a121c] p-3 rounded-lg border border-white/5 flex items-center gap-3">
            <Rocket className="text-cyan-400 shrink-0" size={18} />
            <div>
              <p className="text-gray-400">تاریخ پرتاب</p>
              <p className="font-bold text-white mt-0.5">{selectedSpacecraft.launchDate}</p>
            </div>
          </div>

          <div className="bg-[#0a121c] p-3 rounded-lg border border-white/5 flex items-center gap-3">
            <Compass className="text-amber-400 shrink-0" size={18} />
            <div>
              <p className="text-gray-400">سرعت کنونی</p>
              <p className="font-bold text-white mt-0.5">{selectedSpacecraft.speed}</p>
            </div>
          </div>

          <div className="bg-[#0a121c] p-3 rounded-lg border border-white/5 flex items-center gap-3 col-span-2">
            <Radio className="text-emerald-400 shrink-0" size={18} />
            <div>
              <p className="text-gray-400">وضعیت و فاصله کنونی</p>
              <p className="font-bold text-emerald-300 mt-0.5">{selectedSpacecraft.status}</p>
              <p className="text-gray-300 text-[11px] mt-0.5">{selectedSpacecraft.distance}</p>
            </div>
          </div>
        </div>

        {/* Objective */}
        <div className="bg-[#0a121c]/80 p-4 rounded-xl border border-white/5">
          <h4 className="text-xs font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
            🎯 هدف اصلی مأموریت
          </h4>
          <p className="text-xs text-gray-200 leading-relaxed">
            {selectedSpacecraft.objective}
          </p>
        </div>

        {/* Achievements */}
        <div className="bg-[#0a121c]/80 p-4 rounded-xl border border-white/5">
          <h4 className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
            <Award size={16} /> دستاوردهای کلیدی علمی
          </h4>
          <ul className="space-y-1.5 text-xs text-gray-300 list-disc list-inside">
            {selectedSpacecraft.achievements.map((item, idx) => (
              <li key={idx} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        </div>

        {/* Footer Button */}
        <button
          onClick={() => setSelectedSpacecraft(null)}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs hover:from-cyan-500 hover:to-blue-500 transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)]"
        >
          متوجه شدم
        </button>

      </div>

    </div>
  )
}
