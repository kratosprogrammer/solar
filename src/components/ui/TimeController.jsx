import React from 'react'
import { useSolarStore, TIME_MODES } from '../../store/useSolarStore'
import { ChevronRight, ChevronLeft, Pause, Play, Clock, CalendarDays } from 'lucide-react'

const MODE_ORDER = [
  { value: TIME_MODES.PAUSED, label: 'توقف', icon: <Pause size={16} /> },
  { value: TIME_MODES.REALTIME, label: 'زمان واقعی', icon: <Play size={16} /> },
  { value: TIME_MODES.ONE_DAY, label: 'یک روز', icon: <Clock size={16} /> },
  { value: TIME_MODES.ONE_MONTH, label: 'یک ماه', icon: <CalendarDays size={16} /> },
]

export default function TimeController() {
  const { timeMode, setTimeMode, simulationTime } = useSolarStore()

  // Find current index
  const currentIndex = MODE_ORDER.findIndex(m => m.value === timeMode) || 0
  const currentMode = MODE_ORDER[currentIndex]

  const handlePrev = () => {
    if (currentIndex > 0) {
      setTimeMode(MODE_ORDER[currentIndex - 1].value)
    }
  }

  const handleNext = () => {
    if (currentIndex < MODE_ORDER.length - 1) {
      setTimeMode(MODE_ORDER[currentIndex + 1].value)
    }
  }

  // Convert Unix timestamp (seconds) to JS Date (milliseconds)
  const virtualDate = new Date(simulationTime * 1000)
  
  // Format to Jalali Calendar
  const farsiDate = new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(virtualDate)

  const farsiTime = new Intl.DateTimeFormat('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(virtualDate)

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-3 pointer-events-none">
      
      {/* Date Display */}
      <div className="pointer-events-auto backdrop-blur-xl bg-slate-950/70 border border-[#0d2a33] rounded-2xl p-4 shadow-[0_0_30px_rgba(0,0,0,0.8)] min-w-[220px]">
        <div className="flex justify-between items-center mb-2 border-b border-[#0d2a33] pb-2">
          <p className="text-[#00e5ff] text-[10px] font-bold tracking-widest uppercase">زمان شبیه‌سازی</p>
          <span className="text-white text-xs font-bold bg-[#002f3a] px-2 py-0.5 rounded-md" dir="rtl">{farsiTime}</span>
        </div>
        <p className="text-white font-semibold text-[15px] text-center mt-3" dir="rtl">{farsiDate}</p>
      </div>

      {/* Speed Controls (Left / Right Arrow design) */}
      {/* Speed Controls (Left / Right Arrow design in RTL layout) */}
      <div className="pointer-events-auto flex items-center justify-between backdrop-blur-xl bg-slate-950/70 border border-[#0d2a33] rounded-2xl p-2 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        
        {/* Right Button (First in RTL): Go Backwards to Paused / Realtime */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
          title="عقب‌رفتن در زمان"
        >
          <ChevronRight size={20} />
        </button>

        <div className="flex flex-col items-center justify-center min-w-[100px] gap-1 px-4 text-cyan-400">
          {currentMode.icon}
          <span className="text-xs font-bold" dir="rtl">{currentMode.label}</span>
        </div>

        {/* Left Button (Last in RTL): Go Forwards to 1 Day / 1 Month */}
        <button
          onClick={handleNext}
          disabled={currentIndex === MODE_ORDER.length - 1}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
          title="جلوبردن سرعت زمان"
        >
          <ChevronLeft size={20} />
        </button>
        
      </div>
    </div>
  )
}
