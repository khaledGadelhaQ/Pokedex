<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { pokemonService } from '../services/api'
import { usePokemonStore } from '../stores/pokemon'
import { useFavoritesStore } from '../stores/favorites'
import { useTeamStore } from '../stores/team'
import { useUIStore } from '../stores/ui'
import { useDebounceFn } from '../composables/useDebounce'
import type { Pokemon } from '../types/pokemon'
import SearchBar from '../components/SearchBar.vue'
import TeamFavoritesButtons from '../components/TeamFavoritesButtons.vue'
import PokemonList from '../components/PokemonList.vue'
import SortMenu from '../components/SortMenu.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import ErrorMessage from '../components/ErrorMessage.vue'
import EmptyState from '../components/EmptyState.vue'

// State
const pokemons = ref<Pokemon[]>([])
const searchQuery = ref('')
const searchResults = ref<Pokemon[]>([])
const isSearching = ref(false)
const loading = ref(true)
const error = ref<string | null>(null)
const sortBy = ref<'number' | 'name'>('number')
const sortOrder = ref<'asc' | 'desc'>('asc')

// Stores
const pokemonStore = usePokemonStore()
const favoritesStore = useFavoritesStore()
const teamStore = useTeamStore()
const uiStore = useUIStore()
const router = useRouter()

// Check filter mode from UI store
const showFavoritesOnly = computed(() => uiStore.filterMode === 'favorites')
const showTeamOnly = computed(() => uiStore.filterMode === 'team')

// Clear search when filter mode changes
watch(() => uiStore.filterMode, () => {
  searchQuery.value = ''
  searchResults.value = []
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
    await router.push({
      name: 'pokemon-detail',
      params: { id: String(pokemon.id) },
    })
  } catch (navErr) {
    console.error('Router navigation error:', navErr)
  }
}

// Handle search with debouncing
const performSearch = async (query: string) => {
  // If search query is empty, just show all pokemons
  if (!query.trim()) {
    searchResults.value = []
    return
  }

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
}

const debouncedSearch = useDebounceFn(performSearch, 300)

const handleSearch = (query: string) => {
  searchQuery.value = query
  debouncedSearch(query)
}

// Sort handlers
const handleSort = (by: 'number' | 'name', order: 'asc' | 'desc') => {
  sortBy.value = by
  sortOrder.value = order
}

const handleClearSort = () => {
  sortBy.value = 'number'
  sortOrder.value = 'asc'
}

// Fetch Pokemon on component mount
onMounted(() => {
  fetchPokemons()
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
        
        <!-- Sort Menu -->
        <SortMenu
          :sort-by="sortBy"
          :sort-order="sortOrder"
          @sort="handleSort"
          @clear="handleClearSort"
        />
      </div>

      <!-- Search Bar -->
      <div class="mb-4 md:mb-6">
        <SearchBar @search="handleSearch" />
      </div>

      <!-- Team & Favorites Buttons -->
      <TeamFavoritesButtons />
    </div>

    <!-- Loading State -->
    <LoadingSpinner v-if="loading" message="Loading Pokémon..." />

    <!-- Error State -->
    <ErrorMessage
      v-else-if="error"
      :message="error"
      show-retry
      @retry="fetchPokemons"
    />

    <!-- Searching State -->
    <LoadingSpinner v-else-if="isSearching" message="Searching..." />

    <!-- Pokemon List with Pagination -->
    <PokemonList
      v-else-if="displayedPokemons.length > 0"
      :pokemons="displayedPokemons"
      @select-pokemon="handleSelectPokemon"
    />

    <!-- No Results Message -->
    <EmptyState
      v-else
      :title="showTeamOnly ? 'No Team Members Yet' : showFavoritesOnly ? 'No Favorites Yet' : 'No Pokémon Found'"
      :message="showTeamOnly 
        ? 'Click the purple team icon on any Pokémon to add it to your team (max 6)' 
        : showFavoritesOnly 
        ? 'Click the heart icon on any Pokémon to add it to your favorites' 
        : 'Try searching with a different name or type'"
    />
  </div>
</template>
