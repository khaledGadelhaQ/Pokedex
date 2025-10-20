<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { FunnelIcon, ArrowsUpDownIcon } from '@heroicons/vue/24/outline'
import { pokemonService } from '../services/api'
import { usePokemonStore } from '../stores/pokemon'
import { useFavoritesStore } from '../stores/favorites'
import { useTeamStore } from '../stores/team'
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
const showSortMenu = ref(false)
const sortBy = ref<'number' | 'name'>('number')
const sortOrder = ref<'asc' | 'desc'>('asc')
const pokemonStore = usePokemonStore()
const favoritesStore = useFavoritesStore()
const teamStore = useTeamStore()
const router = useRouter()
const route = useRoute()
let searchTimeout: ReturnType<typeof setTimeout> | null = null

// Check if we should show only favorites. We accept either the route meta (direct /pokemons/favorites)
// or a query param (favorites=1) so the mode persists when navigating to detail routes.
const showFavoritesOnly = computed(() => {
  return route.meta.showFavoritesOnly === true || route.query.favorites === '1'
})

// Check if we should show only team members
const showTeamOnly = computed(() => {
  return route.meta.showTeamOnly === true || route.query.team === '1'
})

// Computed: Show search results if searching, otherwise show all/filtered pokemons
const displayedPokemons = computed(() => {
  let pokemonList = searchQuery.value.trim() ? searchResults.value : pokemons.value
  
  // Filter by favorites if in favorites mode
  if (showFavoritesOnly.value) {
    pokemonList = pokemonList.filter(p => favoritesStore.isFavorite(p.id))
  }
  
  // Filter by team if in team mode
  if (showTeamOnly.value) {
    pokemonList = pokemonList.filter(p => teamStore.isInTeam(p.id))
  }
  
  // Sort Pokemon
  const sorted = [...pokemonList].sort((a, b) => {
    let comparison = 0
    
    if (sortBy.value === 'number') {
      comparison = a.id - b.id
    } else {
      comparison = a.name.localeCompare(b.name)
    }
    
    return sortOrder.value === 'asc' ? comparison : -comparison
  })
  
  return sorted
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
    // Preserve favorites or team mode if currently in those views (check both meta and query)
    const preserveFavorites = route.meta.showFavoritesOnly === true || route.query.favorites === '1'
    const preserveTeam = route.meta.showTeamOnly === true || route.query.team === '1'
    
    const query: Record<string, string> = {}
    if (preserveFavorites) query.favorites = '1'
    if (preserveTeam) query.team = '1'
    
    await router.push({
      name: 'pokemon-detail',
      params: { id: String(pokemon.id) },
      query,
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

// Toggle sort menu
const toggleSortMenu = () => {
  showSortMenu.value = !showSortMenu.value
}

// Set sort option
const setSortOption = (by: 'number' | 'name', order: 'asc' | 'desc') => {
  sortBy.value = by
  sortOrder.value = order
  showSortMenu.value = false
}

// Clear sort (reset to default)
const clearSort = () => {
  sortBy.value = 'number'
  sortOrder.value = 'asc'
  showSortMenu.value = false
}

// Check if current sort is default
const isDefaultSort = computed(() => sortBy.value === 'number' && sortOrder.value === 'asc')

// Close sort menu when clicking outside
const closeSortMenu = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.sort-menu-container')) {
    showSortMenu.value = false
  }
}

// Fetch on component mount
onMounted(() => {
  fetchPokemons()
  document.addEventListener('click', closeSortMenu)
})

// Cleanup on unmount
onBeforeUnmount(() => {
  document.removeEventListener('click', closeSortMenu)
})
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Header -->
    <div class="px-4 pt-6 md:pt-8 pb-4">
      <div class="flex items-center justify-between mb-4 md:mb-6">
        <h1 
          @click="router.push({ name: 'home' })"
          class="font-bold text-2xl md:text-[34px] leading-tight md:leading-[41px] tracking-[0.374px] text-dark-1 cursor-pointer hover:opacity-80 transition-opacity"
        >
          {{ showTeamOnly ? 'My Team' : showFavoritesOnly ? 'Favorites' : 'Pokédex' }}
        </h1>
        <!-- Filter/Sort Icons -->
        <div class="flex items-center gap-2 md:gap-3 relative sort-menu-container">
          <!-- Clear Sort Button -->
          <button 
            @click="clearSort"
            :class="[
              'p-1 rounded-lg transition-colors',
              isDefaultSort ? 'opacity-40 cursor-default' : 'hover:bg-gray-100'
            ]"
            :disabled="isDefaultSort"
          >
            <FunnelIcon class="w-5 h-5 text-dark-1" />
          </button>
          
          <!-- Sort Menu Button -->
          <button 
            @click="toggleSortMenu"
            class="p-1 hover:bg-gray-100 rounded-lg transition-colors relative"
          >
            <ArrowsUpDownIcon class="w-5 h-5 text-dark-1" />
          </button>
          
          <!-- Sort Dropdown Menu -->
          <div 
            v-if="showSortMenu"
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
          {{ showTeamOnly ? 'No Team Members Yet' : showFavoritesOnly ? 'No Favorites Yet' : 'No Pokémon Found' }}
        </p>
        <p class="text-grey-1">
          {{ showTeamOnly 
            ? 'Click the purple team icon on any Pokémon to add it to your team (max 6)' 
            : showFavoritesOnly 
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

