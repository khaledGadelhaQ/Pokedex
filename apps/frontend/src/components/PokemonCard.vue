<script setup lang="ts">
import { computed } from 'vue'
import { ChevronRightIcon } from '@heroicons/vue/24/solid'
import type { Pokemon } from '../types/pokemon'
import { capitalize, formatPokemonNumber } from '../utils/string'
import { getTypeColorClass } from '../utils/pokemonHelpers'

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
  return props.pokemon.sprites.front_default || '/pokemon-placeholder.png'
})

// Get formatted Pokemon number (e.g., No. 001)
const formattedNumber = computed(() => {
  return `No. ${formatPokemonNumber(props.pokemon.id)}`
})

// Capitalize Pokemon name
const capitalizedName = computed(() => {
  return capitalize(props.pokemon.name)
})
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
        :class="getTypeColorClass(typeObj.type.name)"
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-white text-[12px] leading-[14px] tracking-[0.374px] font-normal"
      >
        {{ capitalize(typeObj.type.name) }}
      </span>
    </div>

    <!-- Chevron Icon -->
    <ChevronRightIcon class="w-6 h-6 text-grey-3 flex-shrink-0" />
  </div>
</template>

