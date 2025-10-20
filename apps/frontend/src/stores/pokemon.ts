import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Pokemon } from '../types/pokemon'

export const usePokemonStore = defineStore('pokemon', () => {
  const selectedPokemon = ref<Pokemon | null>(null)

  const selectPokemon = (pokemon: Pokemon) => {
    selectedPokemon.value = pokemon
  }

  const clearSelection = () => {
    selectedPokemon.value = null
  }

  return {
    selectedPokemon,
    selectPokemon,
    clearSelection,
  }
})
