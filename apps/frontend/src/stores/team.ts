import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTeamStore = defineStore('team', () => {
  // Constants
  const MAX_TEAM_SIZE = 6

  // State: array of Pokemon IDs
  const teamIds = ref<number[]>([])

  // Load team from localStorage on initialization
  const loadTeam = () => {
    try {
      const stored = localStorage.getItem('pokemon-team')
      if (stored) {
        teamIds.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Error loading team from localStorage:', error)
      teamIds.value = []
    }
  }

  // Save team to localStorage
  const saveTeam = () => {
    try {
      localStorage.setItem('pokemon-team', JSON.stringify(teamIds.value))
    } catch (error) {
      console.error('Error saving team to localStorage:', error)
    }
  }

  // Check if a Pokemon is in team
  const isInTeam = (pokemonId: number): boolean => {
    return teamIds.value.includes(pokemonId)
  }

  // Check if team is full
  const isTeamFull = computed(() => teamIds.value.length >= MAX_TEAM_SIZE)

  // Add a Pokemon to team
  const addToTeam = (pokemonId: number): { success: boolean; message: string } => {
    if (isInTeam(pokemonId)) {
      return { success: false, message: 'Pokémon is already in your team!' }
    }

    if (isTeamFull.value) {
      return { success: false, message: `Team is full! Maximum ${MAX_TEAM_SIZE} Pokémon allowed.` }
    }

    teamIds.value.push(pokemonId)
    saveTeam()
    return { success: true, message: 'Pokémon added to your team!' }
  }

  // Remove a Pokemon from team
  const removeFromTeam = (pokemonId: number): { success: boolean; message: string } => {
    const index = teamIds.value.indexOf(pokemonId)
    if (index > -1) {
      teamIds.value.splice(index, 1)
      saveTeam()
      return { success: true, message: 'Pokémon removed from your team!' }
    }
    return { success: false, message: 'Pokémon not found in team.' }
  }

  // Toggle team status
  const toggleTeam = (pokemonId: number): { success: boolean; message: string } => {
    if (isInTeam(pokemonId)) {
      return removeFromTeam(pokemonId)
    } else {
      return addToTeam(pokemonId)
    }
  }

  // Get count of team members
  const teamCount = computed(() => teamIds.value.length)

  // Get remaining slots
  const remainingSlots = computed(() => MAX_TEAM_SIZE - teamIds.value.length)

  // Initialize team from localStorage
  loadTeam()

  return {
    teamIds,
    teamCount,
    remainingSlots,
    isInTeam,
    isTeamFull,
    addToTeam,
    removeFromTeam,
    toggleTeam,
    MAX_TEAM_SIZE,
  }
})
