import { create } from 'zustand'
import componentsData from '../data/components.json'

const useStore = create((set, get) => ({

  // ================================
  // RAW DATA
  // ================================
  allComponents: componentsData,

  // ================================
  // USER SELECTIONS (filters)
  // ================================
  useCase: 'gaming',      // 'school' | 'work' | 'gaming'
  budget: 1500,           // in USD

  // ================================
  // SELECTED BUILD COMPONENTS
  // ================================
  selectedComponents: {
    cpu: null,
    motherboard: null,
    ram: null,
    gpu: null,
    storage: null,
    psu: null,
    case: null,
  },

  // ================================
  // UI STATE
  // ================================
  activeComponent: null,    // which component is clicked in 3D
  activeCategory: 'cpu',    // which category tab is open in sidebar

  // ================================
  // ACTIONS: Filters
  // ================================
  setUseCase: (useCase) => set({ useCase }),
  setBudget: (budget) => set({ budget }),

  // ================================
  // ACTIONS: Component Selection
  // ================================
  selectComponent: (category, component) =>
    set((state) => ({
      selectedComponents: {
        ...state.selectedComponents,
        [category]: component,
      }
    })),

  clearComponent: (category) =>
    set((state) => ({
      selectedComponents: {
        ...state.selectedComponents,
        [category]: null,
      }
    })),

  clearAllComponents: () =>
    set({
      selectedComponents: {
        cpu: null,
        motherboard: null,
        ram: null,
        gpu: null,
        storage: null,
        psu: null,
        case: null,
      }
    }),

  // ================================
  // ACTIONS: UI
  // ================================
  setActiveComponent: (name) => set({ activeComponent: name }),
  setActiveCategory: (category) => set({ activeCategory: category }),

  // ================================
  // COMPUTED: Total Price
  // ================================
  getTotalPrice: () => {
    const { selectedComponents } = get()
    return Object.values(selectedComponents)
      .filter(Boolean)
      .reduce((total, component) => total + component.price, 0)
  },

  // ================================
  // COMPUTED: Filtered Components
  // ================================
  getFilteredComponents: (category) => {
    const { allComponents, useCase, budget } = get()

    // Map category names to JSON keys
    const categoryMap = {
      cpu: 'cpus',
      motherboard: 'motherboards',
      ram: 'rams',
      gpu: 'gpus',
      storage: 'storage',
      psu: 'psus',
      case: 'cases',
    }

    const key = categoryMap[category]
    if (!allComponents[key]) return []

    return allComponents[key].filter((component) => {
      const matchesUseCase = component.useCases.includes(useCase)
      const withinBudget = component.price <= budget * 0.5
      return matchesUseCase && withinBudget
    })
  },

  // ================================
  // COMPUTED: Build Summary
  // ================================
  getBuildSummary: () => {
    const { selectedComponents, getTotalPrice } = get()
    const selected = Object.entries(selectedComponents)
      .filter(([, component]) => component !== null)

    return {
      components: selected,
      totalPrice: getTotalPrice(),
      completionPercent: Math.round((selected.length / 7) * 100),
      isComplete: selected.length === 7,
    }
  },

}))

export default useStore