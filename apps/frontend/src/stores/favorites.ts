import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFavoritesStore = defineStore('favorites', () => {
  // State: array of Pokemon IDs
  const favoriteIds = ref<number[]>([])

  // Load favorites from localStorage on initialization
  const loadFavorites = () => {
    try {
      const stored = localStorage.getItem('pokemon-favorites')
      if (stored) {
        favoriteIds.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error)
      favoriteIds.value = []
    }
  }

  // Save favorites to localStorage
  const saveFavorites = () => {
    try {
      localStorage.setItem('pokemon-favorites', JSON.stringify(favoriteIds.value))
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error)
    }
  }

  // Check if a Pokemon is in favorites
  const isFavorite = (pokemonId: number): boolean => {
    return favoriteIds.value.includes(pokemonId)
  }

  // Add a Pokemon to favorites
  const addFavorite = (pokemonId: number): { success: boolean; message: string } => {
    if (isFavorite(pokemonId)) {
      return { success: false, message: 'Pokémon is already in your favorites!' }
    }
    favoriteIds.value.push(pokemonId)
    saveFavorites()
    return { success: true, message: 'Pokémon added to favorites!' }
  }

  // Remove a Pokemon from favorites
  const removeFavorite = (pokemonId: number): { success: boolean; message: string } => {
    const index = favoriteIds.value.indexOf(pokemonId)
    if (index > -1) {
      favoriteIds.value.splice(index, 1)
      saveFavorites()
      return { success: true, message: 'Pokémon removed from favorites!' }
    }
    return { success: false, message: 'Pokémon not found in favorites.' }
  }

  // Toggle favorite status
  const toggleFavorite = (pokemonId: number): { success: boolean; message: string } => {
    if (isFavorite(pokemonId)) {
      return removeFavorite(pokemonId)
    } else {
      return addFavorite(pokemonId)
    }
  }

  // Get count of favorites
  const favoritesCount = computed(() => favoriteIds.value.length)

  // Initialize favorites from localStorage
  loadFavorites()

  return {
    favoriteIds,
    favoritesCount,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  }
})
