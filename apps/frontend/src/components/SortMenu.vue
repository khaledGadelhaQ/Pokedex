<script setup lang="ts">
import { ref, computed } from 'vue'
import { FunnelIcon, ArrowsUpDownIcon } from '@heroicons/vue/24/outline'
import { useClickOutside } from '../composables/useClickOutside'

// Props
interface Props {
  sortBy?: 'number' | 'name'
  sortOrder?: 'asc' | 'desc'
}

const props = withDefaults(defineProps<Props>(), {
  sortBy: 'number',
  sortOrder: 'asc'
})

// Emits
const emit = defineEmits<{
  sort: [by: 'number' | 'name', order: 'asc' | 'desc']
  clear: []
}>()

// Local state
const showMenu = ref(false)
const menuContainer = ref<HTMLElement | null>(null)

// Check if current sort is default
const isDefaultSort = computed(() => props.sortBy === 'number' && props.sortOrder === 'asc')

// Toggle menu
const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

// Set sort option
const setSortOption = (by: 'number' | 'name', order: 'asc' | 'desc') => {
  emit('sort', by, order)
  showMenu.value = false
}

// Clear sort
const handleClear = () => {
  emit('clear')
  showMenu.value = false
}

// Close menu when clicking outside
useClickOutside(menuContainer, () => {
  showMenu.value = false
})
</script>

<template>
  <div ref="menuContainer" class="flex items-center gap-2 md:gap-3 relative">
    <!-- Clear Sort Button -->
    <button 
      @click="handleClear"
      :class="[
        'p-1 rounded-lg transition-colors',
        isDefaultSort ? 'opacity-40 cursor-default' : 'hover:bg-gray-100'
      ]"
      :disabled="isDefaultSort"
      title="Clear Sort"
    >
      <FunnelIcon class="w-5 h-5 text-dark-1" />
    </button>
    
    <!-- Sort Menu Button -->
    <button 
      @click="toggleMenu"
      class="p-1 hover:bg-gray-100 rounded-lg transition-colors relative"
      title="Sort Options"
    >
      <ArrowsUpDownIcon class="w-5 h-5 text-dark-1" />
    </button>
    
    <!-- Sort Dropdown Menu -->
    <div 
      v-if="showMenu"
      class="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden"
    >
      <button
        @click="setSortOption('name', 'asc')"
        :class="[
          'w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors',
          sortBy === 'name' && sortOrder === 'asc' ? 'bg-gray-100 font-medium' : ''
        ]"
      >
        Alphabetical A-Z
      </button>
      <button
        @click="setSortOption('name', 'desc')"
        :class="[
          'w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors',
          sortBy === 'name' && sortOrder === 'desc' ? 'bg-gray-100 font-medium' : ''
        ]"
      >
        Alphabetical Z-A
      </button>
      <button
        @click="setSortOption('number', 'asc')"
        :class="[
          'w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors',
          sortBy === 'number' && sortOrder === 'asc' ? 'bg-gray-100 font-medium' : ''
        ]"
      >
        Number Low to High
      </button>
      <button
        @click="setSortOption('number', 'desc')"
        :class="[
          'w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors',
          sortBy === 'number' && sortOrder === 'desc' ? 'bg-gray-100 font-medium' : ''
        ]"
      >
        Number High to Low
      </button>
    </div>
  </div>
</template>
