<script setup lang="ts">
import { computed } from 'vue'
import { ChevronRightIcon } from '@heroicons/vue/24/solid'
import type { Pokemon } from '../types/pokemon'

// Props
interface Props {
  pokemon: Pokemon
}

const props = defineProps<Props>()

// Emit click event
const emit = defineEmits<{
  click: []
}>()

// Get the main sprite image
const spriteUrl = computed(() => {
  return props.pokemon.sprites.front_default || '/vite.svg'
})

// Get formatted Pokemon number (e.g., No. 001)
const formattedNumber = computed(() => {
  return `No. ${props.pokemon.id.toString().padStart(3, '0')}`
})

// Capitalize Pokemon name
const capitalizedName = computed(() => {
  return props.pokemon.name.charAt(0).toUpperCase() + props.pokemon.name.slice(1)
})

// Type colors for badges - using Tailwind classes
const typeColors: Record<string, string> = {
  normal: 'bg-type-normal',
  fire: 'bg-type-fire',
  water: 'bg-type-water',
  electric: 'bg-type-electric',
  grass: 'bg-type-grass',
  ice: 'bg-type-ice',
  fighting: 'bg-type-fighting',
  poison: 'bg-type-poison',
  ground: 'bg-type-ground',
  flying: 'bg-type-flying',
  psychic: 'bg-type-psychic',
  bug: 'bg-type-bug',
  rock: 'bg-type-rock',
  ghost: 'bg-type-ghost',
  dragon: 'bg-type-dragon',
  dark: 'bg-type-dark',
  steel: 'bg-type-steel',
  fairy: 'bg-type-fairy',
}

const getTypeColor = (typeName: string) => {
  return typeColors[typeName.toLowerCase()] || 'bg-type-normal'
}
</script>

<template>
  <div
    class="relative flex items-center h-[70px] bg-white shadow-card rounded-[10px] cursor-pointer hover:shadow-lg transition-shadow group px-4"
    @click="emit('click')"
  >
    <!-- Pokemon Sprite (50x50) -->
    <div class="w-[50px] h-[50px] flex-shrink-0 mr-4">
      <img
        :src="spriteUrl"
        :alt="pokemon.name"
        class="w-full h-full object-contain"
      />
    </div>

    <!-- Pokemon Info -->
    <div class="flex-1 min-w-0">
      <!-- Name -->
      <h3 class="font-bold text-[17px] leading-5 tracking-[0.374px] text-black mb-0.5">
        {{ capitalizedName }}
      </h3>

      <!-- Number -->
      <p class="font-normal text-[15px] leading-[18px] tracking-[0.374px] text-grey-1">
        {{ formattedNumber }}
      </p>
    </div>

    <!-- Types -->
    <div class="flex gap-1.5 items-center mr-3">
      <span
        v-for="typeObj in props.pokemon.types"
        :key="typeObj.slot"
        :class="getTypeColor(typeObj.type.name)"
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-white text-[12px] leading-[14px] tracking-[0.374px] font-normal"
      >
        {{ typeObj.type.name.charAt(0).toUpperCase() + typeObj.type.name.slice(1) }}
      </span>
    </div>

    <!-- Chevron Icon -->
    <ChevronRightIcon class="w-6 h-6 text-grey-3 flex-shrink-0" />
  </div>
</template>

