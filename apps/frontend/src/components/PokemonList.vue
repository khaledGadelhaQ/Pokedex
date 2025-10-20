<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'
import PokemonCard from './PokemonCard.vue'
import type { Pokemon } from '../types/pokemon'

interface Props {
  pokemons: Pokemon[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  selectPokemon: [pokemon: Pokemon]
}>()

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

const totalPages = computed(() => {
  return Math.ceil(props.pokemons.length / itemsPerPage)
})

const paginatedPokemons = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return props.pokemons.slice(start, end)
})

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const handlePokemonClick = (pokemon: Pokemon) => {
  emit('selectPokemon', pokemon)
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Pokemon Cards List -->
    <div class="flex-1 px-4 space-y-2.5">
      <PokemonCard
        v-for="pokemon in paginatedPokemons"
        :key="pokemon.id"
        :pokemon="pokemon"
        @click="handlePokemonClick(pokemon)"
      />
    </div>

    <!-- Pagination Controls -->
    <div class="flex items-center justify-center gap-4 py-6 px-4">
      <!-- Previous Button -->
      <button
        @click="goToPreviousPage"
        :disabled="currentPage === 1"
        :class="currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-80'"
        class="w-[30px] h-[30px] flex items-center justify-center bg-white rounded-full transition-opacity"
      >
        <ChevronLeftIcon class="w-5 h-5 text-dark-1" />
      </button>

      <!-- Page Info -->
      <div class="text-[15px] text-dark-1 font-medium">
        Page {{ currentPage }} of {{ totalPages }}
      </div>

      <!-- Next Button -->
      <button
        @click="goToNextPage"
        :disabled="currentPage === totalPages"
        :class="currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-80'"
        class="w-[30px] h-[30px] flex items-center justify-center bg-white rounded-full transition-opacity"
      >
        <ChevronRightIcon class="w-5 h-5 text-dark-1" />
      </button>
    </div>
  </div>
</template>
