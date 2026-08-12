import { create } from 'zustand'

export const TIME_MODES = {
  PAUSED: 0,
  REALTIME: 1,
  ONE_DAY: 86400, // 1 day per real-world second
  ONE_MONTH: 2592000, // 30 days per real-world second
}

export const useSolarStore = create((set, get) => ({
  // Navigation & UI
  selectedPlanet: null,
  isTraveling: false,
  travelProgress: 0,
  cameraMode: 'SYSTEM_VIEW',
  hideOrbits: false,
  isFreeCamera: false,
  isScaleComparisonMode: false,
  showTrajectories: false,
  isEclipseMode: false,
  selectedSpacecraft: null,

  setSelectedSpacecraft: (craft) => set({ selectedSpacecraft: craft }),

  toggleScaleComparisonMode: () => set(state => ({ 
    isScaleComparisonMode: !state.isScaleComparisonMode,
    showTrajectories: false
  })),
  toggleTrajectories: () => set(state => ({ showTrajectories: !state.showTrajectories })),
  toggleEclipseMode: () => set(state => ({ isEclipseMode: !state.isEclipseMode })),

  // Time Engine
  timeMode: TIME_MODES.REALTIME,
  simulationTime: Date.now() / 1000, // Unix timestamp in seconds

  selectPlanet: (planetData) => {
    const current = get().selectedPlanet
    if (current && current.name === planetData.name) {
      set({ isFreeCamera: false, isTraveling: false })
      return
    }
    set({ 
      selectedPlanet: planetData, 
      isTraveling: true, 
      cameraMode: 'FOLLOW_SHIP',
      isFreeCamera: false,
      travelProgress: 0
    })
  },

  resetToSystemView: () => set({ 
    selectedPlanet: null, 
    isTraveling: false, 
    cameraMode: 'SYSTEM_VIEW',
    isFreeCamera: false,
    travelProgress: 0
  }),

  setFreeCamera: (free) => set({ isFreeCamera: free }),
  toggleFreeCamera: () => set(state => ({ isFreeCamera: !state.isFreeCamera })),

  setTraveling: (isTraveling) => set({ isTraveling }),
  setTravelProgress: (progress) => set({ travelProgress: progress }),
  setCameraMode: (mode) => set({ cameraMode: mode }),
  
  setHideOrbits: (hide) => set({ hideOrbits: hide }),
  setTimeMode: (mode) => {
    // If returning to REALTIME, snap back to "right now"
    if (mode === TIME_MODES.REALTIME) {
      set({ timeMode: mode, simulationTime: Date.now() / 1000 })
    } else {
      set({ timeMode: mode })
    }
  },
  
  // This is called on every frame by the time controller
  advanceSimulationTime: (delta) => {
    const { timeMode, simulationTime } = get()
    if (timeMode === TIME_MODES.REALTIME) {
      // In Real-Time mode, always sync exactly to Date.now() to prevent drift
      set({ simulationTime: Date.now() / 1000 })
    } else if (timeMode !== TIME_MODES.PAUSED) {
      // In accelerated modes, add the scaled delta to the virtual time
      set({ simulationTime: simulationTime + delta * timeMode })
    }
  }
}))
