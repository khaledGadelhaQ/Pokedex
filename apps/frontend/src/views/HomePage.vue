<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Temporary: We'll replace this with proper API service later
const pokemons = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    // For now, let's just create a placeholder
    loading.value = false
  } catch (error) {
    console.error('Error fetching Pokemon:', error)
    loading.value = false
  }
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-center mb-8">Pokédex</h1>
    
    <div v-if="loading" class="text-center">
      <p class="text-gray-600">Loading Pokémon...</p>
    </div>
    
    <div v-else class="text-center">
      <p class="text-gray-600">Ready to fetch Pokémon! 🎉</p>
      <p class="text-sm text-gray-500 mt-2">
        We'll implement the Pokémon list in the next step
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Component-specific styles will go here */
</style>
