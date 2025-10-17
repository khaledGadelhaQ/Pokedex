/**
 * PokeAPI Response Type Interfaces
 * These represent the structure of data received from the PokeAPI (pokeapi.co)
 * Used by both seed.ts and import-pokemon.ts scripts
 */

/**
 * Ability information from PokeAPI
 */
export interface PokeApiAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

/**
 * Type information from PokeAPI
 */
export interface PokeApiType {
  type: {
    name: string;
    url: string;
  };
  slot: number;
}

/**
 * Move information from PokeAPI
 */
export interface PokeApiMove {
  move: {
    name: string;
    url: string;
  };
  version_group_details: Array<{
    level_learned_at: number;
    move_learn_method: {
      name: string;
      url: string;
    };
    version_group: {
      name: string;
      url: string;
    };
  }>;
}

/**
 * Stat information from PokeAPI
 */
export interface PokeApiStat {
  stat: {
    name: string;
    url: string;
  };
  base_stat: number;
  effort: number;
}

/**
 * Species information from PokeAPI
 */
export interface PokeApiSpecies {
  name: string;
  url: string;
}

/**
 * Form information from PokeAPI
 */
export interface PokeApiForm {
  name: string;
  url: string;
}

/**
 * Sprites information from PokeAPI
 */
export interface PokeApiSprites {
  back_default: string | null;
  back_female: string | null;
  back_shiny: string | null;
  back_shiny_female: string | null;
  front_default: string | null;
  front_female: string | null;
  front_shiny: string | null;
  front_shiny_female: string | null;
  other?: Record<string, unknown>;
  versions?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Complete Pokemon response from PokeAPI
 * This represents the full Pokemon object returned by pokeapi.co/api/v2/pokemon/{id}
 */
export interface PokeApiPokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  order: number;
  sprites: PokeApiSprites;
  types: PokeApiType[];
  abilities: PokeApiAbility[];
  moves: PokeApiMove[];
  stats: PokeApiStat[];
  species: PokeApiSpecies;
  forms: PokeApiForm[];
  [key: string]: unknown;
}
