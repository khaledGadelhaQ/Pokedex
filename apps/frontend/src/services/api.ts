import axios from 'axios'
import type { Pokemon } from '../types/pokemon'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Pokemon API Service
export const pokemonService = {
  /**
   * Get list of Pokemon with optional pagination
   * @param page - Page number (optional)
   * @param limit - Items per page (optional)
   */
  async getAll(page?: number, limit?: number): Promise<Pokemon[]> {
    const params = new URLSearchParams()
    if (page) params.append('page', page.toString())
    if (limit) params.append('limit', limit.toString())
    
    const response = await api.get<Pokemon[]>('/pokemons', {
      params: Object.fromEntries(params),
    })
    return response.data
  },

  /**
   * Get a single Pokemon by ID
   * @param id - Pokemon ID
   */
  async getById(id: number): Promise<Pokemon> {
    const response = await api.get<Pokemon>(`/pokemons/${id}`)
    return response.data
  },

  /**
   * Search Pokemon by name or type
   * @param query - Search query
   */
  async search(query: string): Promise<Pokemon[]> {
    const response = await api.get<Pokemon[]>('/search', {
      params: { query },
    })
    return response.data
  },
}

export default api
