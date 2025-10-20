<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { FunnelIcon, ArrowsUpDownIcon } from '@heroicons/vue/24/outline'
import { pokemonService } from '../services/api'
import { usePokemonStore } from '../stores/pokemon'
import { useFavoritesStore } from '../stores/favorites'
import type { Pokemon } from '../types/pokemon'
import SearchBar from '../components/SearchBar.vue'
import TeamFavoritesButtons from '../components/TeamFavoritesButtons.vue'
import PokemonList from '../components/PokemonList.vue'

// State
const pokemons = ref<Pokemon[]>([])
const searchQuery = ref('')
const searchResults = ref<Pokemon[]>([])
const isSearching = ref(false)
const loading = ref(true)
const error = ref<string | null>(null)
const pokemonStore = usePokemonStore()
const favoritesStore = useFavoritesStore()
const router = useRouter()
const route = useRoute()
let searchTimeout: ReturnType<typeof setTimeout> | null = null

// Check if we should show only favorites. We accept either the route meta (direct /pokemons/favorites)
// or a query param (favorites=1) so the mode persists when navigating to detail routes.
const showFavoritesOnly = computed(() => {
  return route.meta.showFavoritesOnly === true || route.query.favorites === '1'
})

// Computed: Show search results if searching, otherwise show all/filtered pokemons
const displayedPokemons = computed(() => {
  let pokemonList = searchQuery.value.trim() ? searchResults.value : pokemons.value
  
  // Filter by favorites if in favorites mode
  if (showFavoritesOnly.value) {
    pokemonList = pokemonList.filter(p => favoritesStore.isFavorite(p.id))
  }
  
  return pokemonList
})

// Fetch Pokemon from backend
const fetchPokemons = async () => {
  try {
    loading.value = true
    error.value = null
    const data = await pokemonService.getAll()
    pokemons.value = data
  } catch (err: any) {
    console.error('Error fetching Pokemon:', err)
    error.value = `Failed to load Pokémon: ${err.message}`
  } finally {
    loading.value = false
  }
}

// Handle Pokemon selection
const handleSelectPokemon = async (pokemon: Pokemon) => {
  try {
    // Fetch full Pokemon data with stats, moves, abilities
    const fullPokemonData = await pokemonService.getById(pokemon.id)
    pokemonStore.selectPokemon(fullPokemonData)
  } catch (err: any) {
    console.error('Error fetching full Pokemon data:', err)
    // Fallback to the basic data if full fetch fails
    pokemonStore.selectPokemon(pokemon)
  }

  // Navigate to the detail URL so it's bookmarkable/shareable
  try {
    // Preserve favorites mode if currently in favorites view (check both meta and query)
    const preserveFavorites = route.meta.showFavoritesOnly === true || route.query.favorites === '1'
    await router.push({
      name: 'pokemon-detail',
      params: { id: String(pokemon.id) },
      // keep a state so the detail view can navigate back preserving filter
      query: preserveFavorites ? { favorites: '1' } : {},
    })
  } catch (navErr) {
    console.error('Router navigation error:', navErr)
  }
}

// Handle search
const handleSearch = async (query: string) => {
  searchQuery.value = query
  
  // Clear any existing timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  // If search query is empty, just show all pokemons
  if (!query.trim()) {
    searchResults.value = []
    return
  }
  
  // Debounce: wait 300ms before searching
  searchTimeout = setTimeout(async () => {
    try {
      isSearching.value = true
      const results = await pokemonService.search(query)
      searchResults.value = results
    } catch (err: any) {
      console.error('Error searching Pokemon:', err)
      searchResults.value = []
    } finally {
      isSearching.value = false
    }
  }, 300)
}

// Fetch on component mount
onMounted(() => {
  fetchPokemons()
})
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Header -->
    <div class="px-4 pt-16 md:pt-[90px] pb-4">
      <div class="flex items-center justify-between mb-4 md:mb-6">
        <h1 class="font-bold text-2xl md:text-[34px] leading-tight md:leading-[41px] tracking-[0.374px] text-dark-1">
          {{ showFavoritesOnly ? 'Favorites' : 'Pokédex' }}
        </h1>
        <!-- Filter/Sort Icons -->
        <div class="flex items-center gap-2 md:gap-3">
          <button class="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <FunnelIcon class="w-5 h-5 text-dark-1" />
          </button>
          <button class="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowsUpDownIcon class="w-5 h-5 text-dark-1" />
          </button>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="mb-4 md:mb-6">
        <SearchBar @search="handleSearch" />
      </div>

      <!-- Team & Favorites Buttons -->
      <TeamFavoritesButtons />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-500"></div>
        <p class="text-gray-600 mt-4">Loading Pokémon...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex-1 flex items-center justify-center px-4">
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
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

    <!-- Searching State -->
    <div v-else-if="isSearching" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-500"></div>
        <p class="text-gray-600 mt-4">Searching...</p>
      </div>
    </div>

    <!-- Pokemon List with Pagination -->
    <PokemonList
      v-else-if="displayedPokemons.length > 0"
      :pokemons="displayedPokemons"
      @select-pokemon="handleSelectPokemon"
    />

    <!-- No Results Message -->
    <div v-else class="flex-1 flex items-center justify-center px-4">
      <div class="text-center">
        <p class="text-xl font-bold text-dark-1 mb-2">
          {{ showFavoritesOnly ? 'No Favorites Yet' : 'No Pokémon Found' }}
        </p>
        <p class="text-grey-1">
          {{ showFavoritesOnly 
            ? 'Click the heart icon on any Pokémon to add it to your favorites' 
            : 'Try searching with a different name or type' 
          }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* h1 {
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
} */
</style>

