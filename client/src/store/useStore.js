import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { flattenComponent } from '../lib/flattenComponent'
import { buildAPI } from '../services/api'

const DEFAULT_CASE = {
  id:         'pc-default',
  name:       'Default PC',
  brand:      'Default',
  price:      0,
  formFactor: 'ATX',
  modelPath:  '/models/case/compressed_test_pc_4th.glb',
  useCases:   ['school', 'work', 'gaming'],
  color:      '#b61717',
}

const useStore = create((set, get) => ({

  // ================================
  // COMPONENT CATALOG (from Supabase)
  // ================================
  components:        [],
  componentsLoading: false,
  componentsError:   null,

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
    case:        DEFAULT_CASE,
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
  buildLoading:        false,
  buildError:          null,

  // ================================
  // ACTIONS: AI Build Generation
  // ================================
  generateBuild: async () => {
    const { useCase, budget } = get()
    set({ buildLoading: true, buildError: null })
    try {
      const result = await buildAPI.generate(useCase, budget)
      if (!result.success) throw new Error(result.error || 'Build generation failed')

      set({
        selectedComponents: {
          cpu:         result.build.cpu         ?? null,
          motherboard: result.build.motherboard ?? null,
          ram:         result.build.ram         ?? null,
          gpu:         result.build.gpu         ?? null,
          storage:     result.build.storage     ?? null,
          psu:         result.build.psu         ?? null,
          case:        result.build.case        ?? DEFAULT_CASE,
        },
        aiExplanation:       result.explanation,
        aiPerformanceRating: result.performanceRating,
        aiSource:            result.source,
        buildLoading:        false,
      })
    } catch (err) {
      set({ buildError: err.message, buildLoading: false })
    }
  },

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
        case:        DEFAULT_CASE,
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
    const { components, useCase, budget } = get()
    return components.filter(c =>
      c.slot === category &&
      c.useCases.includes(useCase) &&
      c.price <= budget * 0.5
    )
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
