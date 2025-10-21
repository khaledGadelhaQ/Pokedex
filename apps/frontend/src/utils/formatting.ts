/**
 * Format Pokemon stat names for display
 * Example: "special-attack" -> "Sp. Atk"
 */
export function formatStatName(statName: string): string {
  if (!statName) return ''
  
  const statMap: Record<string, string> = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    'special-attack': 'Sp. Atk',
    'special_attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    'special_defense': 'Sp. Def',
    speed: 'Speed'
  }
  
  return statMap[statName.toLowerCase()] || statName
}

/**
 * Format move names by replacing hyphens with spaces
 * Example: "thunder-shock" -> "thunder shock"
 */
export function formatMoveName(moveName: string): string {
  if (!moveName) return ''
  return moveName.replace(/-/g, ' ')
}

/**
 * Get Tailwind color class based on stat value
 * Higher stats get better colors (green), lower stats get warning colors (red/orange)
 */
export function getStatColor(value: number): string {
  if (value >= 150) return 'bg-stat-green'
  if (value >= 100) return 'bg-green-400'
  if (value >= 80) return 'bg-yellow-400'
  if (value >= 50) return 'bg-orange-400'
  return 'bg-stat-red'
}

/**
 * Get level badge color class based on index (cycling through colors)
 * Uses Tailwind config colors for consistency
 */
export function getLevelBadgeColor(index: number): string {
  const colors = [
    'bg-level-purple',
    'bg-level-teal',
    'bg-level-orange',
    'bg-purple-500',
    'bg-pink-500',
    'bg-cyan-500'
  ]
  return colors[index % colors.length] || 'bg-level-purple'
}
