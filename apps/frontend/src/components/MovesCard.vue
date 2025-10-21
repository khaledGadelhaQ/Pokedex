<script setup lang="ts">
import type { Pokemon } from '../types/pokemon'
import { capitalize } from '../utils/string'
import { formatMoveName, getLevelBadgeColor } from '../utils/formatting'

interface Props {
  pokemon: Pokemon
}

const props = defineProps<Props>()

// Get displayed moves (limit to 10 for better UX)
const getDisplayedMoves = () => {
  if (!props.pokemon.moves) return []
  
  // Filter out moves learned at level 0 (evolution/egg moves), sort by level, and take first 10
  return [...props.pokemon.moves]
    .filter(move => {
      const level = move.version_group_details?.[0]?.level_learned_at || 0
      return level > 0 // Only show moves with actual levels
    })
    .sort((a, b) => {
      const levelA = a.version_group_details?.[0]?.level_learned_at || 0
      const levelB = b.version_group_details?.[0]?.level_learned_at || 0
      return levelA - levelB
    })
    .slice(0, 10)
}
</script>

<template>
  <div v-if="pokemon.moves && pokemon.moves.length > 0" class="bg-white rounded-2xl p-6">
    <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">MOVESET</h2>
    <div class="space-y-2 max-h-[350px] overflow-y-auto">
      <div
        v-for="(move, index) in getDisplayedMoves()"
        :key="move.move || index"
        class="flex items-center gap-2"
      >
        <span 
          :class="[
            'px-2 py-1 rounded-md text-xs font-semibold text-white flex-shrink-0',
            getLevelBadgeColor(index)
          ]"
        >
          Level {{ move.version_group_details?.[0]?.level_learned_at || 1 }}
        </span>
        <span class="font-medium text-sm text-gray-900 capitalize">
          {{ capitalize(formatMoveName(move.move || '')) }}
        </span>
      </div>
    </div>
  </div>
</template>
