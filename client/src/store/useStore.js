import { create } from 'zustand'
import componentsData from '../data/components.json'

// Default case shown before AI generates anything
const DEFAULT_CASE = {
  id:         'pc-default',
  name:       'Default PC',
  brand:      'Default',
  price:      0,
  formFactor: 'ATX',
  modelPath:  '/models/case/compressed_test_pc_4th.glb',
  useCases:   ['school', 'work', 'gaming'],
  color:      '#333333',
}


const useStore = create((set, get) => ({

  // ================================
  // RAW DATA
  // ================================
  allComponents: componentsData,

  // ================================
  // USER SELECTIONS (filters)
  // ================================
  useCase: 'gaming',
  budget:  1500,

  // ================================
  // SELECTED BUILD COMPONENTS
  // ================================
  selectedComponents: {
    cpu:         null,
    motherboard: null,
    ram:         null,
    gpu:         null,
    storage:     null,
    psu:         null,
    case:        DEFAULT_CASE,  // ← shows on load
  },

  // ================================
  // UI STATE
  // ================================
  activeComponent:     null,
  activeCategory:      'cpu',
  theme:               'light',
  aiExplanation:       null,
  aiPerformanceRating: null,
  aiSource:            null,

  // ================================
  // ACTIONS: Filters
  // ================================
  setUseCase: (useCase) => set({ useCase }),
  setBudget:  (budget)  => set({ budget }),

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
        // If clearing the case, go back to default
        // instead of null so scene stays populated
        [category]: category === 'case' ? DEFAULT_CASE : null,
      }
    })),

  clearAllComponents: () =>
    set({
      selectedComponents: {
        cpu:         null,
        motherboard: null,
        ram:         null,
        gpu:         null,
        storage:     null,
        psu:         null,
        case:        DEFAULT_CASE,  // ← keep default case on reset
      }
    }),

  // ================================
  // ACTIONS: UI
  // ================================
  setActiveComponent: (name)     => set({ activeComponent: name }),
  setActiveCategory:  (category) => set({ activeCategory: category }),
  toggleTheme: () => set((state) => ({
    theme: state.theme === 'light' ? 'dark' : 'light'
  })),
  
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

    const categoryMap = {
      cpu:         'cpus',
      motherboard: 'motherboards',
      ram:         'rams',
      gpu:         'gpus',
      storage:     'storage',
      psu:         'psus',
      case:        'cases',
    }

    const key = categoryMap[category]
    if (!allComponents[key]) return []

    return allComponents[key].filter((component) => {
      const matchesUseCase = component.useCases.includes(useCase)
      const withinBudget   = component.price <= budget * 0.5
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
      components:        selected,
      totalPrice:        getTotalPrice(),
      completionPercent: Math.round((selected.length / 7) * 100),
      isComplete:        selected.length === 7,
    }
  },

}))

export default useStore