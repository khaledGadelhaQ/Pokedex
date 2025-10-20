<script setup lang="ts">
import { computed } from 'vue'
import type { Pokemon } from '../types/pokemon'

// Props
interface Props {
  pokemon: Pokemon
}

const props = defineProps<Props>()

// Get the main sprite image
const spriteUrl = computed(() => {
  return props.pokemon.sprites.front_default || '/vite.svg'
})

// Get formatted Pokemon number (e.g., #001)
const formattedNumber = computed(() => {
  return `#${props.pokemon.id.toString().padStart(3, '0')}`
})

// Capitalize Pokemon name
const capitalizedName = computed(() => {
  return props.pokemon.name.charAt(0).toUpperCase() + props.pokemon.name.slice(1)
})

// Type colors for badges
const typeColors: Record<string, string> = {
  normal: 'bg-gray-400',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-blue-200',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-600',
  flying: 'bg-indigo-400',
  psychic: 'bg-pink-500',
  bug: 'bg-green-400',
  rock: 'bg-yellow-800',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-700',
  dark: 'bg-gray-800',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-300',
}

const getTypeColor = (type: string) => {
  return typeColors[type.toLowerCase()] || 'bg-gray-400'
}
</script>

<template>
  <div
    class="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer overflow-hidden"
  >
    <!-- Pokemon Image -->
    <div class="bg-gray-100 p-6 flex items-center justify-center h-48">
      <img
        :src="spriteUrl"
        :alt="pokemon.name"
        class="w-32 h-32 object-contain hover:scale-110 transition-transform duration-300"
      />
    </div>

    <!-- Pokemon Info -->
    <div class="p-4">
      <!-- Number -->
      <p class="text-gray-500 text-sm font-semibold mb-1">
        {{ formattedNumber }}
      </p>

      <!-- Name -->
      <h3 class="text-xl font-bold text-gray-800 mb-3">
        {{ capitalizedName }}
      </h3>

      <!-- Types -->
      <div class="flex gap-2 flex-wrap">
        <span
          v-for="typeObj in pokemon.types"
          :key="typeObj.slot"
          :class="getTypeColor(typeObj.type)"
          class="px-3 py-1 rounded-full text-white text-xs font-semibold uppercase"
        >
          {{ typeObj.type }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Component-specific styles if needed */
</style>
