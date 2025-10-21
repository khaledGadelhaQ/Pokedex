import { defineStore } from 'pinia'
import { ref } from 'vue'

export type FilterMode = 'all' | 'favorites' | 'team'

export const useUIStore = defineStore('ui', () => {
  // State
  const filterMode = ref<FilterMode>('all')

  // Actions
  function setFilterMode(mode: FilterMode) {
    filterMode.value = mode
  }

  function clearFilter() {
    filterMode.value = 'all'
  }

  return {
    filterMode,
    setFilterMode,
    clearFilter,
  }
})
