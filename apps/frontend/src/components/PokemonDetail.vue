<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { HeartIcon } from '@heroicons/vue/24/solid'
import { HeartIcon as HeartIconOutline } from '@heroicons/vue/24/outline'
import { UsersIcon } from '@heroicons/vue/24/solid'
import { UsersIcon as UsersIconOutline } from '@heroicons/vue/24/outline'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import { usePokemonStore } from '../stores/pokemon'
import { useFavoritesStore } from '../stores/favorites'
import { useTeamStore } from '../stores/team'
import { pokemonService } from '../services/api'
import { capitalize } from '../utils/string'
import LoadingSpinner from './LoadingSpinner.vue'
import EmptyState from './EmptyState.vue'
import InfoCard from './InfoCard.vue'
import StatsCard from './StatsCard.vue'
import MovesCard from './MovesCard.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const pokemonStore = usePokemonStore()
const favoritesStore = useFavoritesStore()
const teamStore = useTeamStore()
const loading = ref(false)
const error = ref<string | null>(null)

const selectedPokemon = computed(() => pokemonStore.selectedPokemon)

// Navigate back to list
const goBack = () => {
  router.push('/')
}

const capitalizedName = computed(() => {
  if (!selectedPokemon.value) return ''
  return capitalize(selectedPokemon.value.name)
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

// Get background gradient based on primary type using Tailwind config
const getBackgroundGradient = (): string => {
  if (!selectedPokemon.value?.types || selectedPokemon.value.types.length === 0) {
    return 'bg-type-gradient-normal'
  }
  
  const primaryType = selectedPokemon.value.types[0]?.type?.name?.toLowerCase() || 'normal'
  return `bg-type-gradient-${primaryType}`
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
    <!-- Back Button (Mobile Only - Top Left) -->
    <div v-if="selectedPokemon" class="absolute top-6 left-6 z-20 md:hidden">
      <button
        @click="goBack"
        class="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-lg transition-all hover:scale-110"
        aria-label="Go back to list"
      >
        <ArrowLeftIcon class="w-7 h-7 text-gray-700" />
      </button>
    </div>

    <!-- Action Buttons (Top Left on desktop, Top Right on mobile) - Fixed position -->
    <div v-if="selectedPokemon" class="absolute top-6 right-6 md:left-6 md:right-auto z-10 flex gap-4">
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
    <LoadingSpinner v-if="loading" message="Loading Pokémon..." />

    <!-- Error State -->
    <div v-else-if="error" class="w-full h-full flex items-center justify-center">
      <div class="text-center px-4">
        <p class="text-2xl font-bold mb-2 text-white">Error</p>
        <p class="text-lg text-white">{{ error }}</p>
      </div>
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else-if="!selectedPokemon"
      title="Select a Pokémon"
      message="Click on a Pokémon from the list to view details"
    />

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

        <!-- Cards Section -->
        <div class="px-6 pb-8 space-y-6">
          <!-- Info Card -->
          <InfoCard :pokemon="selectedPokemon" />

          <!-- Stats and Moves Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatsCard :pokemon="selectedPokemon" />
            <MovesCard :pokemon="selectedPokemon" />
          </div>
        </div>
      </div>
  </div>
</template>