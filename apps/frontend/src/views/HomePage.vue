<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { pokemonService } from '../services/api'
import type { Pokemon } from '../types/pokemon'
import PokemonCard from '../components/PokemonCard.vue'

// State
const pokemons = ref<Pokemon[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Fetch Pokemon from backend
const fetchPokemons = async () => {
  try {
    loading.value = true
    error.value = null
    pokemons.value = await pokemonService.getAll()
  } catch (err) {
    console.error('Error fetching Pokemon:', err)
    error.value = 'Failed to load Pokémon. Please make sure the backend is running.'
  } finally {
    loading.value = false
  }
}

// Fetch on component mount
onMounted(() => {
  fetchPokemons()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-5xl font-bold text-gray-800 mb-2">Pokédex</h1>
      <p class="text-gray-600">Gotta catch 'em all!</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-500"></div>
      <p class="text-gray-600 mt-4">Loading Pokémon...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
        <p class="font-bold">Error</p>
        <p>{{ error }}</p>
        <button 
          @click="fetchPokemons"
          class="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Pokemon Grid -->
    <div v-else>
      <p class="text-gray-600 text-center mb-6">
        Showing {{ pokemons.length }} Pokémon
      </p>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <PokemonCard 
          v-for="pokemon in pokemons" 
          :key="pokemon.id" 
          :pokemon="pokemon"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Component-specific styles */
</style>
