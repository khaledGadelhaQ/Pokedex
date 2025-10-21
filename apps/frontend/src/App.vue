<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

// Check if we're viewing a Pokemon detail on mobile
const isDetailView = computed(() => {
  return route.name === 'pokemon-detail' && route.params.id
})
</script>

<template>
  <div id="app" class="flex flex-col md:flex-row h-screen overflow-hidden bg-pokedex-bg font-sf-pro-text">
    <!-- Check if we're on a full-page route (like 404) -->
    <template v-if="$route.meta.fullPage">
      <RouterView />
    </template>
    
    <!-- Normal two-panel layout for other routes -->
    <template v-else>
      <!-- Left Panel: Pokemon List (hidden on mobile when detail is shown) -->
      <div 
        :class="[
          'w-full md:w-[450px] h-full flex-shrink-0 bg-pokedex-bg overflow-y-auto',
          { 'hidden md:block': isDetailView }
        ]"
      >
        <RouterView />
      </div>

      <!-- Divider (hidden on mobile) -->
      <div class="hidden md:block w-px bg-grey-border flex-shrink-0"></div>

      <!-- Right Panel: Pokemon Detail (full screen on mobile when detail shown) -->
      <div 
        :class="[
          'md:flex md:flex-1 h-full bg-detail-gradient overflow-y-auto',
          { 'flex flex-1': isDetailView, 'hidden': !isDetailView }
        ]"
      >
        <RouterView name="detail" />
      </div>
    </template>
  </div>
</template>
