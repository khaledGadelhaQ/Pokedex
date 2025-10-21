<script setup lang="ts">
import { computed } from 'vue'
import { UsersIcon, HeartIcon } from '@heroicons/vue/24/outline'
import { useFavoritesStore } from '../stores/favorites'
import { useTeamStore } from '../stores/team'
import { useUIStore } from '../stores/ui'

const favoritesStore = useFavoritesStore()
const teamStore = useTeamStore()
const uiStore = useUIStore()

// Get live team count
const teamCount = computed(() => teamStore.teamCount)

// Format the team subtitle text
const teamText = computed(() => {
  const count = teamCount.value
  return count === 1 ? '1 pokemon' : `${count} pokemons`
})

// Get live favorites count
const favoritesCount = computed(() => favoritesStore.favoritesCount)

// Format the subtitle text
const favoritesText = computed(() => {
  const count = favoritesCount.value
  return count === 1 ? '1 pokemon' : `${count} pokemons`
})

// Whether the team view is active
const isTeamActive = computed(() => uiStore.filterMode === 'team')

// Whether the favorites view is active
const isFavoritesActive = computed(() => uiStore.filterMode === 'favorites')

// Toggle team: switch filter mode
const toggleTeam = () => {
  if (isTeamActive.value) {
    uiStore.setFilterMode('all')
  } else {
    uiStore.setFilterMode('team')
  }
}

// Toggle favorites: switch filter mode
const toggleFavorites = () => {
  if (isFavoritesActive.value) {
    uiStore.setFilterMode('all')
  } else {
    uiStore.setFilterMode('favorites')
  }
}
</script>

<template>
  <div class="buttons-container">
    <!-- My Team Button -->
    <button :class="['team-button', isTeamActive ? 'team-active' : '']" @click="toggleTeam">
      <UsersIcon class="button-icon" />
      <div class="button-content">
        <div class="button-title">My Team</div>
        <div class="button-subtitle">{{ teamText }}</div>
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

/* Active state for team button */
.team-active {
  filter: brightness(0.85);
  box-shadow: inset 0 0 0 1000px rgba(0,0,0,0.03);
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
