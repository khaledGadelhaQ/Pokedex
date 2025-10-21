/**
 * Pokemon type names
 */
export type PokemonType =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy'

/**
 * Get the Tailwind class for a Pokemon type background color
 * These classes are defined in tailwind.config.js and safelisted
 * 
 * @param typeName - The Pokemon type (case-insensitive)
 * @returns Tailwind background color class (e.g., "bg-type-fire")
 */
export function getTypeColorClass(typeName: string): string {
  const normalizedType = typeName.toLowerCase()
  return `bg-type-${normalizedType}`
}
