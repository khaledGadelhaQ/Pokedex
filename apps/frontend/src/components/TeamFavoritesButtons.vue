<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { UsersIcon, HeartIcon } from '@heroicons/vue/24/outline'
import { useFavoritesStore } from '../stores/favorites'

const router = useRouter()
const route = useRoute()
const favoritesStore = useFavoritesStore()

// Get live favorites count
const favoritesCount = computed(() => favoritesStore.favoritesCount)

// Format the subtitle text
const favoritesText = computed(() => {
  const count = favoritesCount.value
  return count === 1 ? '1 pokemon' : `${count} pokemons`
})

// Whether the favorites view is active (route name or meta)
const isFavoritesActive = computed(() => {
  return route.name === 'favorites' || route.meta.showFavoritesOnly === true || route.query.favorites === '1'
})

// Toggle favorites: navigate to favorites if not active, otherwise go home
const toggleFavorites = () => {
  if (isFavoritesActive.value) {
    router.push({ name: 'home' })
  } else {
    router.push({ name: 'favorites' })
  }
}
</script>

<template>
  <div class="buttons-container">
    <!-- My Team Button -->
    <button class="team-button">
      <UsersIcon class="button-icon" />
      <div class="button-content">
        <div class="button-title">My Team</div>
        <div class="button-subtitle">4 pokemons</div>
      </div>
    </button>

    <!-- Favorites Button -->
    <button :class="['favorites-button', isFavoritesActive ? 'favorites-active' : '']" @click="toggleFavorites">
      <HeartIcon class="button-icon" />
      <div class="button-content">
        <div class="button-title">Favorites</div>
        <div class="button-subtitle">{{ favoritesText }}</div>
      </div>
    </button>
  </div>
</template>

<style scoped>
.buttons-container {
  display: flex;
  gap: 12px;
  padding: 0 16px;
  margin-bottom: 20px;
}

button {
  position: relative;
  width: 167px;
  height: 100px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  overflow: hidden;
  transition: opacity 0.2s;
}

button:hover {
  opacity: 0.9;
}

/* My Team Button - Purple Gradient */
.team-button {
  background: linear-gradient(109.73deg, #46469C 0%, #7E32E0 100%);
}

.team-button .button-icon {
  position: absolute;
  left: 16px;
  top: 24px;
  width: 28px;
  height: 28px;
  color: rgba(70, 70, 156, 0.3);
}

/* Favorites Button - Green Gradient */
.favorites-button {
  background: linear-gradient(109.73deg, #65CB9A 0%, #15D0DC 100%);
}

.favorites-button .button-icon {
  position: absolute;
  left: 16px;
  top: 24px;
  width: 28px;
  height: 28px;
  color: rgba(101, 203, 154, 0.3);
}

/* Active state: darker / stronger opacity to show selection */
.favorites-active {
  filter: brightness(0.85);
  box-shadow: inset 0 0 0 1000px rgba(0,0,0,0.03);
}

/* Button Content */
.button-content {
  position: absolute;
  left: 16px;
  bottom: 28px;
  text-align: left;
}

.button-title {
  font-weight: 700;
  font-size: 18px;
  line-height: 22px;
  letter-spacing: -0.408px;
  color: #FFFFFF;
}

.button-subtitle {
  font-weight: 400;
  font-size: 15px;
  line-height: 22px;
  letter-spacing: -0.408px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 2px;
}
</style>
