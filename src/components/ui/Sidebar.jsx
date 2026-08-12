import React, { useState } from 'react'
import { useSolarStore } from '../../store/useSolarStore'
import { planetsData } from '../../config/planetsData'

export default function Sidebar() {
  const { 
    selectedPlanet, selectPlanet, resetToSystemView, 
    hideOrbits, setHideOrbits, isTraveling,
    isFreeCamera, setFreeCamera, toggleFreeCamera,
    isScaleComparisonMode, toggleScaleComparisonMode,
    showTrajectories, toggleTrajectories,
    isEclipseMode, toggleEclipseMode
  } = useSolarStore()
  
  const [activeTab, setActiveTab] = useState('specs')

  const showInfo = selectedPlanet && !isTraveling && !isFreeCamera

  const handleCloseInfo = () => {
    setFreeCamera(true)
  }

  return (
    <div className="fixed right-6 top-6 bottom-6 z-30 pointer-events-none flex gap-4 justify-start">
      
      {/* RIGHT PANEL: Navigation List */}
      <div className="pointer-events-auto w-[320px] h-full flex flex-col rounded-2xl bg-[#080b12]/90 border border-[#0d2a33] backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden shrink-0">
        
        {/* Header */}
        <div className="p-5 shrink-0 text-center border-b border-[#0d2a33]/50">
          <h2 className="text-xl font-bold text-[#00e5ff] tracking-wide" style={{ textShadow: '0 0 10px rgba(0, 229, 255, 0.4)' }}>
            منظومه شمسی
          </h2>
        </div>

        {/* Planet List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-2.5">
          {planetsData.flatMap(p => p.moons ? [p, ...p.moons] : [p]).map((planet) => {
            const isActive = selectedPlanet?.name === planet.name
            return (
              <button
                key={planet.name}
                onClick={() => selectPlanet(planet)}
                className={`
                  w-full py-2.5 rounded-lg transition-all duration-300 text-sm font-bold tracking-wide border
                  ${isActive 
                    ? 'bg-[#002f3a] text-white border-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.2)]' 
                    : 'bg-[#0a121c] text-slate-300 hover:bg-[#0f1d2b] hover:text-white border-[#152738]'}
                `}
              >
                {planet.name}
              </button>
            )
          })}
        </div>

        {/* Bottom Toggles & Educational Tools */}
        <div className="p-4 shrink-0 flex flex-col gap-2 border-t border-[#0d2a33]/50 overflow-y-auto max-h-[220px] custom-scrollbar">
          <button
            onClick={toggleScaleComparisonMode}
            className={`w-full py-2.5 rounded-lg text-xs font-semibold transition-all border ${
              isScaleComparisonMode 
                ? 'bg-[#3a2000] text-[#ffaa00] border-[#ffaa00] shadow-[0_0_15px_rgba(255,170,0,0.3)]' 
                : 'bg-[#0a121c] text-slate-300 hover:bg-[#0f1d2b] hover:text-white border-[#152738]'
            }`}
          >
            {isScaleComparisonMode ? 'خروج از مقایسه مقیاس' : '📊 مقایسه مقیاس سیارات'}
          </button>

          <button
            onClick={toggleTrajectories}
            className={`w-full py-2.5 rounded-lg text-xs font-semibold transition-all border ${
              showTrajectories 
                ? 'bg-[#002f3a] text-[#00e5ff] border-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.3)]' 
                : 'bg-[#0a121c] text-slate-300 hover:bg-[#0f1d2b] hover:text-white border-[#152738]'
            }`}
          >
            {showTrajectories ? 'مخفی‌کردن کاوشگرها' : '🚀 مسیر کاوشگرهای فضایی'}
          </button>

          <button
            onClick={() => setHideOrbits(!hideOrbits)}
            className="w-full py-2.5 rounded-lg text-xs font-semibold transition-all border border-[#152738] bg-[#0a121c] text-slate-300 hover:bg-[#0f1d2b] hover:text-white"
          >
            {hideOrbits ? 'نمایش مدارها' : 'مخفی‌کردن مدارها'}
          </button>
          
          <button 
            onClick={toggleFreeCamera}
            className={`w-full py-2.5 rounded-lg text-xs font-semibold transition-all border ${
              isFreeCamera 
                ? 'bg-[#002f3a] text-[#00e5ff] border-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.2)]' 
                : 'bg-[#0a121c] text-slate-300 hover:bg-[#0f1d2b] hover:text-white border-[#152738]'
            }`}
          >
            {isFreeCamera ? '📷 دوربین آزاد (حرکت با WASD): روشن' : '📷 دوربین آزاد (حرکت با WASD)'}
          </button>

          <button
            onClick={resetToSystemView}
            className="w-full py-2.5 rounded-lg text-xs font-semibold transition-all border border-[#152738] bg-[#0a121c] text-slate-300 hover:bg-[#0f1d2b] hover:text-white"
          >
            🌌 نمای کلی منظومه
          </button>
        </div>

      </div>

      {/* LEFT PANEL: Planet Info (Only visible when a planet is selected and arrived, Second in RTL = Leftmost) */}
      <div 
        className={`
          w-[360px] h-full flex flex-col overflow-hidden transition-all duration-500
          ${showInfo ? 'pointer-events-auto translate-x-0 opacity-100' : 'pointer-events-none translate-x-[110%] opacity-0'}
        `}
      >
        <div className="flex-1 rounded-2xl bg-[#080b12]/90 border border-[#0d1e2d] backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden">
          
          {/* Header */}
          <div className="p-6 shrink-0 border-b border-[#0d1e2d]">
            <div className="flex justify-between items-start">
              <button 
                onClick={handleCloseInfo}
                className="text-[#8ba2b8] hover:text-white transition-colors text-sm"
              >
                بستن
              </button>
              <div className="text-right">
                <h1 className="text-3xl font-bold text-white mb-1" style={{ textShadow: `0 0 20px ${selectedPlanet?.atmosphereColor || '#ffffff'}60` }}>
                  {selectedPlanet?.name}
                </h1>
                <p className="text-[#00e5ff] font-semibold text-sm tracking-widest uppercase">
                  {selectedPlanet?.enName}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex px-4 pt-4 shrink-0 gap-2">
            <TabButton active={activeTab === 'specs'} onClick={() => setActiveTab('specs')} label="مشخصات" />
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="درباره" />
            <TabButton active={activeTab === 'facts'} onClick={() => setActiveTab('facts')} label="حقایق" />
          </div>

          {/* Scrollable Content */}
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1 min-h-0" dir="rtl">
            
            {/* Tab: Specs */}
            {activeTab === 'specs' && selectedPlanet && (
              <div className="flex flex-col gap-5 text-sm font-medium animate-in fade-in duration-300">
                <SpecRow label="شعاع" value={selectedPlanet.metrics.radius} />
                <SpecRow label="فاصله از خورشید" value={selectedPlanet.metrics.distanceFromSun} />
                <SpecRow label="جرم" value={selectedPlanet.metrics.mass} dir="ltr" />
                <SpecRow label="دما" value={selectedPlanet.metrics.temperature} />
                <SpecRow label="مدت یک سال" value={selectedPlanet.metrics.yearLength} />
                <SpecRow label="مدت یک شبانه‌روز" value={selectedPlanet.metrics.dayLength} />
                <SpecRow label="تعداد قمرها" value={selectedPlanet.metrics.moonsCount} />
              </div>
            )}

            {/* Tab: Overview */}
            {activeTab === 'overview' && selectedPlanet && (
              <div className="animate-in fade-in duration-300 text-sm leading-loose text-slate-300 text-justify">
                {selectedPlanet.overview}
              </div>
            )}

            {/* Tab: Facts */}
            {activeTab === 'facts' && selectedPlanet && (
              <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                {selectedPlanet.facts?.map((fact, idx) => (
                  <div key={idx} className="bg-[#0b1420] p-4 rounded-xl border border-[#1a2c3f] text-sm text-slate-300 leading-relaxed">
                    {fact}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}

// ─── Subcomponents ───

function TabButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 py-2 rounded-t-lg transition-all duration-300 text-sm font-bold
        ${active 
          ? 'bg-[#1a202c] text-white border-t border-l border-r border-[#2d3748]' 
          : 'bg-transparent text-[#64748b] hover:text-white hover:bg-white/5 border-transparent'}
      `}
    >
      {label}
    </button>
  )
}

function SpecRow({ label, value, dir = "rtl" }) {
  return (
    <div className="flex gap-2">
      <span className="text-[#8ba2b8]">{label}:</span>
      <span className="text-white" dir={dir}>{value}</span>
    </div>
  )
}
