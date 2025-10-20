<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { HeartIcon } from '@heroicons/vue/24/solid'
import { HeartIcon as HeartIconOutline } from '@heroicons/vue/24/outline'
import { usePokemonStore } from '../stores/pokemon'
import { useFavoritesStore } from '../stores/favorites'
import { pokemonService } from '../services/api'

const route = useRoute()
const router = useRouter()
const pokemonStore = usePokemonStore()
const favoritesStore = useFavoritesStore()
const loading = ref(false)
const error = ref<string | null>(null)

const selectedPokemon = computed(() => pokemonStore.selectedPokemon)

const capitalizedName = computed(() => {
  if (!selectedPokemon.value) return ''
  return selectedPokemon.value.name.charAt(0).toUpperCase() + selectedPokemon.value.name.slice(1)
})

// Check if current Pokemon is favorited
const isFavorite = computed(() => {
  if (!selectedPokemon.value) return false
  return favoritesStore.isFavorite(selectedPokemon.value.id)
})

// Toggle favorite
const toggleFavorite = () => {
  if (selectedPokemon.value) {
    favoritesStore.toggleFavorite(selectedPokemon.value.id)
  }
}

// Fetch Pokemon if store is empty but we have a route param
onMounted(async () => {
  const pokemonId = route.params.id
  
  // If we have a route param but no selected Pokemon in store, fetch it
  if (pokemonId && !selectedPokemon.value) {
    const id = Number(pokemonId)
    
    // Validate Pokemon ID (must be between 1 and 151)
    if (isNaN(id) || id < 1 || id > 151) {
      // Redirect to 404 page for invalid IDs
      router.push({ name: 'not-found' })
      return
    }
    
    try {
      loading.value = true
      error.value = null
      const pokemon = await pokemonService.getById(id)
      pokemonStore.selectPokemon(pokemon)
    } catch (err: any) {
      console.error('Error fetching Pokemon by ID:', err)
      
      // If it's a 404 error, redirect to not found page
      if (err.response?.status === 404) {
        router.push({ name: 'not-found' })
      } else {
        error.value = `Failed to load Pokémon: ${err.message}`
      }
    } finally {
      loading.value = false
    }
  }
})
</script>

<template>
  <div class="w-full h-full flex items-center justify-center">
    <!-- Loading State -->
    <div v-if="loading" class="text-center px-4">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-white"></div>
      <p class="text-white mt-4">Loading Pokémon...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center px-4">
      <p class="text-2xl font-bold mb-2 text-white">Error</p>
      <p class="text-lg text-white">{{ error }}</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!selectedPokemon" class="text-center px-4">
      <p class="text-2xl font-bold mb-2 text-white">Select a Pokémon</p>
      <p class="text-lg text-white">Click on a Pokémon from the list to view details</p>
    </div>

    <!-- Pokemon Detail -->
    <div v-else class="relative text-center px-4">
      <!-- Favorite Button (Top Right) -->
      <button
        @click="toggleFavorite"
        class="absolute top-0 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
        :aria-label="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
      >
        <HeartIcon 
          v-if="isFavorite" 
          class="w-8 h-8 text-red-500"
        />
        <HeartIconOutline 
          v-else 
          class="w-8 h-8 text-white"
        />
      </button>

      <h1 class="text-4xl font-bold text-white mb-4">
        {{ capitalizedName }}
      </h1>
      <p class="text-white text-lg">ID: {{ selectedPokemon.id }}</p>
      <p class="text-white text-lg">Weight: {{ selectedPokemon.weight }}</p>
      <p class="text-white text-lg">Height: {{ selectedPokemon.height }}</p>
    </div>
  </div>
</template>