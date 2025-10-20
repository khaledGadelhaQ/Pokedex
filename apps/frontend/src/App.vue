<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div id="app" class="flex flex-col md:flex-row h-screen overflow-hidden bg-pokedex-bg font-sf-pro-text">
    <!-- Left Panel: Pokemon List (full width on mobile, 450px on tablet+) -->
    <div class="w-full md:w-[450px] flex-shrink-0 bg-pokedex-bg overflow-y-auto">
      <RouterView name="sidebar" />
      <RouterView />
    </div>

    <!-- Divider (hidden on mobile) -->
    <div class="hidden md:block w-px bg-grey-border flex-shrink-0"></div>

    <!-- Right Panel: Pokemon Detail (hidden on mobile, shown when Pokemon selected) -->
    <div class="hidden md:flex md:flex-1 bg-detail-gradient overflow-y-auto">
      <RouterView name="detail" />
    </div>
  </div>
</template>

<style>
/* Global app styles
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif;
} */
</style>

