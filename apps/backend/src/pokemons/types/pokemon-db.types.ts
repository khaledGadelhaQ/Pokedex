/**
 * Database JSON type interfaces
 * These represent the structure of JSON data stored in PostgreSQL via Prisma
 */

export interface DbSprites {
  front_default: string | null;
  front_female?: string | null;
  front_shiny?: string | null;
  front_shiny_female?: string | null;
  back_default?: string | null;
  back_female?: string | null;
  back_shiny?: string | null;
  back_shiny_female?: string | null;
}

export interface DbType {
  type: string;
  slot: number;
}

export interface DbMove {
  move: string;
  version_group_details: Array<{
    move_learn_method: string;
    version_group: string;
    level_learned_at: number;
  }>;
}

export interface DbStat {
  stat: string;
  base_stat: number;
  effort: number;
}

export interface DbAbility {
  ability: string;
  is_hidden: boolean;
  slot: number;
}
