/**
 * Capitalize the first letter of a string
 * Example: "pikachu" -> "Pikachu"
 */
export function capitalize(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Format Pokemon ID to 3-digit number
 * Example: 1 -> "001", 25 -> "025", 151 -> "151"
 */
export function formatPokemonNumber(id: number): string {
  return id.toString().padStart(3, '0')
}
