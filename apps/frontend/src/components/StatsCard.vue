<script setup lang="ts">
import type { Pokemon } from '../types/pokemon'
import { formatStatName, getStatColor } from '../utils/formatting'

interface Props {
  pokemon: Pokemon
}

const props = defineProps<Props>()

// Calculate total stats
const getTotalStats = (): number => {
  if (!props.pokemon.stats) return 0
  return props.pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)
}
</script>

<template>
  <div v-if="pokemon.stats && pokemon.stats.length > 0" class="bg-white rounded-2xl p-6">
    <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">STATISTICS</h2>
    <div class="space-y-4">
      <div v-for="(stat, index) in pokemon.stats" :key="stat.stat || index" class="flex items-center gap-3">
        <span class="text-gray-400 text-sm w-20">{{ formatStatName(stat.stat || '') }}</span>
        <span class="font-semibold text-gray-900 w-10 text-right">{{ stat.base_stat || 0 }}</span>
        <div class="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            :class="[
              'h-full rounded-full transition-all duration-500',
              getStatColor(stat.base_stat || 0)
            ]"
            :style="{ width: `${Math.min(((stat.base_stat || 0) / 200) * 100, 100)}%` }"
          ></div>
        </div>
      </div>
      <!-- Total Stats -->
      <div class="flex items-center gap-3 pt-2 border-t border-gray-200">
        <span class="text-gray-400 text-sm w-20">Total</span>
        <span class="font-semibold text-gray-900 w-10 text-right">{{ getTotalStats() }}</span>
        <div class="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            :class="[
              'h-full rounded-full transition-all duration-500',
              getStatColor(getTotalStats())
            ]"
            :style="{ width: `${Math.min((getTotalStats() / 800) * 100, 100)}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
