<script setup lang="ts">
import type { Pokemon } from '../types/pokemon'
import { capitalize, formatPokemonNumber } from '../utils/string'
import { getTypeColorClass } from '../utils/pokemonHelpers'

interface Props {
  pokemon: Pokemon
}

const props = defineProps<Props>()

// Get Pokemon description
const getPokemonDescription = (): string => {
  const types = props.pokemon.types.map(t => capitalize(t.type.name)).join(' and ')
  const name = capitalize(props.pokemon.name)
  const weight = (props.pokemon.weight! / 10).toFixed(1)
  const height = (props.pokemon.height! / 10).toFixed(1)
  
  return `${name} is a ${types}-type Pokémon. It weighs ${weight} kg and stands ${height}m tall.`
}

// Get abilities text
const getAbilitiesText = (): string => {
  if (!props.pokemon.abilities || props.pokemon.abilities.length === 0) {
    return 'Unknown'
  }
  return props.pokemon.abilities
    .slice(0, 2)
    .map(a => a.ability.replace(/-/g, ' '))
    .join(', ')
}
</script>

<template>
  <div class="bg-white rounded-2xl p-6">
    <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">INFO</h2>
    
    <!-- Description -->
    <div class="mb-4">
      <p class="text-gray-700 leading-relaxed">
        {{ getPokemonDescription() }}
      </p>
    </div>
    
    <div class="space-y-3">
      <div class="flex justify-between">
        <span class="text-gray-400">Type</span>
        <div class="flex gap-2">
          <span
            v-for="(type, index) in pokemon.types"
            :key="type.type?.name || index"
            :class="[
              'px-3 py-1 rounded-full text-white text-sm font-medium capitalize',
              getTypeColorClass(type.type?.name || '')
            ]"
          >
            {{ capitalize(type.type?.name || 'unknown') }}
          </span>
        </div>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-400">Number</span>
        <span class="font-semibold text-gray-900">{{ formatPokemonNumber(pokemon.id) }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-400">Weight</span>
        <span class="font-semibold text-gray-900">{{ (pokemon.weight! / 10).toFixed(1) }} kg</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-400">Height</span>
        <span class="font-semibold text-gray-900">{{ (pokemon.height! / 10).toFixed(1) }}m</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-400">Category</span>
        <span class="font-semibold text-gray-900 capitalize">{{ pokemon.species || 'Seed' }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-400">Abilities</span>
        <span class="font-semibold text-gray-900 capitalize">{{ getAbilitiesText() }}</span>
      </div>
    </div>
  </div>
</template>
