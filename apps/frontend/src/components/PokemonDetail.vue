<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { HeartIcon } from '@heroicons/vue/24/solid'
import { HeartIcon as HeartIconOutline } from '@heroicons/vue/24/outline'
import { UsersIcon } from '@heroicons/vue/24/solid'
import { UsersIcon as UsersIconOutline } from '@heroicons/vue/24/outline'
import { usePokemonStore } from '../stores/pokemon'
import { useFavoritesStore } from '../stores/favorites'
import { useTeamStore } from '../stores/team'
import { pokemonService } from '../services/api'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const pokemonStore = usePokemonStore()
const favoritesStore = useFavoritesStore()
const teamStore = useTeamStore()
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

// Check if current Pokemon is in team
const isInTeam = computed(() => {
  if (!selectedPokemon.value) return false
  return teamStore.isInTeam(selectedPokemon.value.id)
})

// Toggle favorite
const toggleFavorite = () => {
  if (selectedPokemon.value) {
    const result = favoritesStore.toggleFavorite(selectedPokemon.value.id)
    
    // Show toast notification
    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }
}

// Toggle team
const toggleTeam = () => {
  if (selectedPokemon.value) {
    const result = teamStore.toggleTeam(selectedPokemon.value.id)
    
    // Show toast notification
    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }
}

// Helper function to get type color
const getTypeColor = (typeName: string): string => {
  if (!typeName) return 'bg-gray-400'
  const typeColors: Record<string, string> = {
    normal: 'bg-gray-400',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-400',
    grass: 'bg-green-500',
    ice: 'bg-cyan-400',
    fighting: 'bg-red-700',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-600',
    flying: 'bg-indigo-400',
    psychic: 'bg-pink-500',
    bug: 'bg-lime-500',
    rock: 'bg-yellow-700',
    ghost: 'bg-purple-700',
    dragon: 'bg-indigo-700',
    dark: 'bg-gray-800',
    steel: 'bg-gray-500',
    fairy: 'bg-pink-300'
  }
  return typeColors[typeName.toLowerCase()] || 'bg-gray-400'
}

// Get background gradient based on primary type
const getBackgroundGradient = (): string => {
  if (!selectedPokemon.value?.types || selectedPokemon.value.types.length === 0) {
    return 'bg-gradient-to-b from-gray-400 to-gray-500'
  }
  
  const primaryType = selectedPokemon.value.types[0]?.type?.name?.toLowerCase() || 'normal'
  
  const gradients: Record<string, string> = {
    normal: 'bg-gradient-to-b from-gray-400 to-gray-500',
    fire: 'bg-gradient-to-b from-red-400 to-red-600',
    water: 'bg-gradient-to-b from-blue-400 to-blue-600',
    electric: 'bg-gradient-to-b from-yellow-300 to-yellow-500',
    grass: 'bg-gradient-to-b from-green-400 to-green-600',
    ice: 'bg-gradient-to-b from-cyan-300 to-cyan-500',
    fighting: 'bg-gradient-to-b from-red-600 to-red-800',
    poison: 'bg-gradient-to-b from-purple-400 to-purple-600',
    ground: 'bg-gradient-to-b from-yellow-500 to-yellow-700',
    flying: 'bg-gradient-to-b from-indigo-300 to-indigo-500',
    psychic: 'bg-gradient-to-b from-pink-400 to-pink-600',
    bug: 'bg-gradient-to-b from-lime-400 to-lime-600',
    rock: 'bg-gradient-to-b from-yellow-600 to-yellow-800',
    ghost: 'bg-gradient-to-b from-purple-600 to-purple-800',
    dragon: 'bg-gradient-to-b from-indigo-600 to-indigo-800',
    dark: 'bg-gradient-to-b from-gray-700 to-gray-900',
    steel: 'bg-gradient-to-b from-gray-400 to-gray-600',
    fairy: 'bg-gradient-to-b from-pink-200 to-pink-400'
  }
  
  return gradients[primaryType] || 'bg-gradient-to-b from-gray-400 to-gray-500'
}

// Helper function to format stat names
const formatStatName = (statName: string): string => {
  if (!statName) return ''
  const statMap: Record<string, string> = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    'special-attack': 'Sp. Atk',
    'special_attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    'special_defense': 'Sp. Def',
    speed: 'Speed'
  }
  return statMap[statName.toLowerCase()] || statName
}

// Helper function to get stat color based on value
const getStatColor = (value: number): string => {
  if (value >= 150) return 'bg-green-500'
  if (value >= 100) return 'bg-green-400'
  if (value >= 80) return 'bg-yellow-400'
  if (value >= 50) return 'bg-orange-400'
  return 'bg-red-400'
}

// Calculate total stats
const getTotalStats = (): number => {
  if (!selectedPokemon.value?.stats) return 0
  return selectedPokemon.value.stats.reduce((sum, stat) => sum + stat.base_stat, 0)
}

// Get abilities text
const getAbilitiesText = (): string => {
  if (!selectedPokemon.value?.abilities || selectedPokemon.value.abilities.length === 0) {
    return 'Unknown'
  }
  return selectedPokemon.value.abilities
    .slice(0, 2)
    .map(a => a.ability.replace(/-/g, ' '))
    .join(', ')
}

// Get Pokemon description
const getPokemonDescription = (): string => {
  if (!selectedPokemon.value) return ''
  
  const types = selectedPokemon.value.types.map(t => t.type.name).join(' and ')
  const name = capitalizedName.value
  
  // Generate a simple description based on available data
  return `${name} is a ${types}-type Pokémon. It weighs ${(selectedPokemon.value.weight! / 10).toFixed(1)} kg and stands ${(selectedPokemon.value.height! / 10).toFixed(1)}m tall.`
}

// Get displayed moves (limit to 10 for better UX)
const getDisplayedMoves = () => {
  if (!selectedPokemon.value?.moves) return []
  // Filter out moves learned at level 0 (evolution/egg moves), sort by level, and take first 10
  return [...selectedPokemon.value.moves]
    .filter(move => {
      const level = move.version_group_details?.[0]?.level_learned_at || 0
      return level > 0 // Only show moves with actual levels
    })
    .sort((a, b) => {
      const levelA = a.version_group_details?.[0]?.level_learned_at || 0
      const levelB = b.version_group_details?.[0]?.level_learned_at || 0
      return levelA - levelB
    })
    .slice(0, 10)
}

// Format move name
const formatMoveName = (moveName: string): string => {
  if (!moveName) return ''
  return moveName.replace(/-/g, ' ')
}

// Get level badge color (alternating colors)
const getLevelBadgeColor = (index: number): string => {
  const colors = [
    'bg-purple-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-cyan-500'
  ]
  return colors[index % colors.length] || 'bg-purple-500'
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
  <div class="relative w-full h-full">
    <!-- Action Buttons (Top Left) - Fixed position -->
    <div v-if="selectedPokemon" class="absolute top-6 left-6 z-10 flex gap-4">
      <!-- Team Button -->
      <button
        @click="toggleTeam"
        class="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-lg transition-all hover:scale-110"
        :aria-label="isInTeam ? 'Remove from team' : 'Add to team'"
      >
        <UsersIcon 
          v-if="isInTeam" 
          class="w-7 h-7 text-purple-500"
        />
        <UsersIconOutline 
          v-else 
          class="w-7 h-7 text-purple-500"
        />
      </button>

      <!-- Favorite Button -->
      <button
        @click="toggleFavorite"
        class="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-lg transition-all hover:scale-110"
        :aria-label="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
      >
        <HeartIcon 
          v-if="isFavorite" 
          class="w-7 h-7 text-red-500"
        />
        <HeartIconOutline 
          v-else 
          class="w-7 h-7 text-red-500"
        />
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="w-full h-full flex items-center justify-center">
      <div class="text-center px-4">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-white"></div>
        <p class="text-white mt-4">Loading Pokémon...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="w-full h-full flex items-center justify-center">
      <div class="text-center px-4">
        <p class="text-2xl font-bold mb-2 text-white">Error</p>
        <p class="text-lg text-white">{{ error }}</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!selectedPokemon" class="w-full h-full flex items-center justify-center">
      <div class="text-center px-4">
        <p class="text-2xl font-bold mb-2 text-white">Select a Pokémon</p>
        <p class="text-lg text-white">Click on a Pokémon from the list to view details</p>
      </div>
    </div>

    <!-- Pokemon Detail -->
    <div v-else :class="['w-full h-full overflow-y-auto', getBackgroundGradient()]">
        <!-- Pokemon Header with Image -->
        <div class="relative px-6 pt-16 pb-8">
          <!-- Pokemon Name -->
          <h1 class="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
            {{ capitalizedName }}
          </h1>
          
          <!-- Pokemon Image -->
          <div class="flex justify-center mb-6">
            <img 
              v-if="selectedPokemon.sprites?.front_default"
              :src="selectedPokemon.sprites.front_default" 
              :alt="selectedPokemon.name"
              class="w-72 h-72 md:w-96 md:h-96 object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        <!-- Cards Section - All on same green background -->
        <div class="px-6 pb-8 space-y-6">
          <!-- Info Card -->
          <div class="bg-white rounded-2xl p-6">
            <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">INFO</h2>
            
            <!-- Description -->
            <div class="mb-4">
              <p class="text-gray-700 leading-relaxed">
                {{ getPokemonDescription() }}
              </p>
            </div>
            
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-400">Type</span>
                <div class="flex gap-2">
                  <span
                    v-for="(type, index) in selectedPokemon.types"
                    :key="type.type?.name || index"
                    :class="[
                      'px-3 py-1 rounded-full text-white text-sm font-medium capitalize',
                      getTypeColor(type.type?.name || '')
                    ]"
                  >
                    {{ type.type?.name || 'unknown' }}
                  </span>
                </div>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Number</span>
                <span class="font-semibold text-gray-900">{{ String(selectedPokemon.id).padStart(3, '0') }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Weight</span>
                <span class="font-semibold text-gray-900">{{ (selectedPokemon.weight! / 10).toFixed(1) }} kg</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Height</span>
                <span class="font-semibold text-gray-900">{{ (selectedPokemon.height! / 10).toFixed(1) }}m</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Category</span>
                <span class="font-semibold text-gray-900 capitalize">{{ selectedPokemon.species || 'Seed' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Abilities</span>
                <span class="font-semibold text-gray-900 capitalize">{{ getAbilitiesText() }}</span>
              </div>
            </div>
          </div>

          <!-- Stats and Moves Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Stats Card -->
            <div v-if="selectedPokemon.stats && selectedPokemon.stats.length > 0" class="bg-white rounded-2xl p-6">
              <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">STATISTICS</h2>
              <div class="space-y-4">
                <div v-for="(stat, index) in selectedPokemon.stats" :key="stat.stat || index" class="flex items-center gap-3">
                  <span class="text-gray-400 text-sm w-20">{{ formatStatName(stat.stat || '') }}</span>
                  <span class="font-semibold text-gray-900 w-10 text-right">{{ stat.base_stat || 0 }}</span>
                  <div class="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      :class="[
                        'h-full rounded-full transition-all duration-500',
                        getStatColor(stat.base_stat || 0)
                      ]"
                      :style="{ width: `${Math.min(((stat.base_stat || 0) / 200) * 100, 100)}%` }"
                    ></div>
                  </div>
                </div>
                <!-- Total Stats -->
                <div class="flex items-center gap-3 pt-2 border-t border-gray-200">
                  <span class="text-gray-400 text-sm w-20">Total</span>
                  <span class="font-semibold text-gray-900 w-10 text-right">{{ getTotalStats() }}</span>
                  <div class="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      :class="[
                        'h-full rounded-full transition-all duration-500',
                        getStatColor(getTotalStats())
                      ]"
                      :style="{ width: `${Math.min((getTotalStats() / 800) * 100, 100)}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Moves Card -->
            <div v-if="selectedPokemon.moves && selectedPokemon.moves.length > 0" class="bg-white rounded-2xl p-6">
              <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">MOVESET</h2>
              <div class="space-y-2 max-h-[350px] overflow-y-auto">
                <div
                  v-for="(move, index) in getDisplayedMoves()"
                  :key="move.move || index"
                  class="flex items-center gap-2"
                >
                  <span 
                    :class="[
                      'px-2 py-1 rounded-md text-xs font-semibold text-white flex-shrink-0',
                      getLevelBadgeColor(index)
                    ]"
                  >
                    Level {{ move.version_group_details?.[0]?.level_learned_at || 1 }}
                  </span>
                  <span class="font-medium text-sm text-gray-900 capitalize">{{ formatMoveName(move.move || '') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>