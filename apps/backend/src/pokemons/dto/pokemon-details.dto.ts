export class PokemonDetailsDto {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
  };
  types: Array<{
    type: {
      name: string;
    };
    slot: number;
  }>;
  height: number;
  weight: number;
  moves: Array<{
    move: string;
    version_group_details: Array<{
      move_learn_method: string;
      version_group: string;
      level_learned_at: number;
    }>;
  }>;
  order: number;
  species: string;
  stats: Array<{
    stat: string;
    base_stat: number;
    effort: number;
  }>;
  abilities: Array<{
    ability: string;
    is_hidden: boolean;
    slot: number;
  }>;
  form: string;
}
