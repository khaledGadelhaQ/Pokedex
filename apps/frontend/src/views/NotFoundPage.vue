<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="fixed inset-0 flex flex-col items-center justify-center bg-pokedex-bg px-4">
    <div class="text-center">
      <!-- 404 Text -->
      <h1 class="text-[120px] md:text-[180px] font-bold text-grey-2 leading-none mb-4">
        404
      </h1>
      
      <!-- Message -->
      <h2 class="text-2xl md:text-4xl font-bold text-dark-1 mb-4">
        Oops! Page Not Found
      </h2>
      
      <p class="text-lg text-grey-1 mb-8 max-w-md">
        The page you're looking for doesn't exist. It might have been moved or deleted.
      </p>
      
      <!-- Go Home Button -->
      <button
        @click="goHome"
        class="px-8 py-3 bg-detail-gradient text-white font-bold rounded-lg hover:opacity-90 transition-opacity shadow-card"
      >
        Go Back Home
      </button>
    </div>
  </div>
</template>
