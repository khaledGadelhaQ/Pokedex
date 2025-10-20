// Pokemon type definition matching backend API response
export interface Pokemon {
  id: number
  name: string
  sprites: {
    front_default?: string | null
    front_shiny?: string | null
    back_default?: string | null
    back_shiny?: string | null
    [key: string]: string | null | undefined
  }
  types: Array<{
    type: string
    slot: number
  }>
  height?: number | null
  weight?: number | null
  stats?: Array<{
    stat: string
    base_stat: number
    effort: number
  }> | null
  abilities?: Array<{
    ability: string
    is_hidden: boolean
    slot: number
  }> | null
  moves?: Array<{
    move: string
    version_group_details: Array<{
      level_learned_at: number
      move_learn_method: string
      version_group: string
    }>
  }> | null
  order?: number | null
  species?: string | null
  form?: string | null
}

// API Response types
export interface PokemonListResponse {
  data: Pokemon[]
  total: number
  page: number
  limit: number
}

export interface ApiError {
  message: string
  error?: string
  statusCode?: number
}
