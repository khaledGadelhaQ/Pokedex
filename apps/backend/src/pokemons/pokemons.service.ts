import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PokemonDto } from './dto/pokemon.dto';
import { PokemonDetailsDto } from './dto/pokemon-details.dto';
import {
  DbSprites,
  DbType,
  DbMove,
  DbStat,
  DbAbility,
} from './types/pokemon-db.types';
import { Pokemon } from '@prisma/client';

/**
 * Type for Pokemon with selected fields for list view
 * Represents the exact shape returned by Prisma when we select specific fields
 */
type PokemonBasic = Pick<Pokemon, 'id' | 'name' | 'sprites' | 'types'>;

/**
 * Type for full Pokemon details
 * Represents the complete Pokemon object from the database
 */
type PokemonFull = Pokemon;

@Injectable()
export class PokemonsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    sort?: string,
    limit?: number,
    offset?: number,
  ): Promise<PokemonDto[]> {
    // Determine sort order based on valid sort values
    const orderBy: { id: 'asc' | 'desc' } | { name: 'asc' | 'desc' } =
      sort === 'name-asc'
        ? { name: 'asc' }
        : sort === 'name-desc'
          ? { name: 'desc' }
          : sort === 'id-desc'
            ? { id: 'desc' }
            : { id: 'asc' }; // Default

    const pokemons = await this.prisma.pokemon.findMany({
      orderBy,
      select: {
        id: true,
        name: true,
        sprites: true,
        types: true,
      },
      take: limit,
      skip: offset,
    });

    // Transform to match OpenAPI spec format
    return pokemons.map((pokemon) => this.transformToPokemonDto(pokemon));
  }

  async findOne(id: number): Promise<PokemonDetailsDto> {
    const pokemon = await this.prisma.pokemon.findUnique({
      where: { id },
    });

    if (!pokemon) {
      throw new NotFoundException(`Pokemon with ID ${id} not found`);
    }

    return this.transformToPokemonDetailsDto(pokemon);
  }

  /**
   * Transform database Pokemon (basic fields) to API response DTO
   * @param pokemon - Raw Pokemon data from Prisma with selected fields
   * @returns PokemonDto - Formatted for API response matching OpenAPI spec
   */
  private transformToPokemonDto(pokemon: PokemonBasic): PokemonDto {
    // Cast JSON fields to their actual types
    const sprites = pokemon.sprites as unknown as DbSprites;
    const types = pokemon.types as unknown as DbType[];

    return {
      id: pokemon.id,
      name: pokemon.name,
      sprites: {
        front_default: sprites.front_default,
      },
      types: types.map((t) => ({
        type: {
          name: t.type,
        },
        slot: t.slot,
      })),
    };
  }

  /**
   * Transform full database Pokemon to detailed API response DTO
   * @param pokemon - Complete Pokemon data from Prisma
   * @returns PokemonDetailsDto - Formatted for API response matching OpenAPI spec
   */
  private transformToPokemonDetailsDto(
    pokemon: PokemonFull,
  ): PokemonDetailsDto {
    // Cast JSON fields to their actual types
    const sprites = pokemon.sprites as unknown as DbSprites;
    const types = pokemon.types as unknown as DbType[];
    const moves = pokemon.moves as unknown as DbMove[];
    const stats = pokemon.stats as unknown as DbStat[];
    const abilities = pokemon.abilities as unknown as DbAbility[];

    return {
      id: pokemon.id,
      name: pokemon.name,
      sprites: {
        front_default: sprites.front_default,
        front_female: sprites.front_female || null,
        front_shiny: sprites.front_shiny || null,
        front_shiny_female: sprites.front_shiny_female || null,
        back_default: sprites.back_default || null,
        back_female: sprites.back_female || null,
        back_shiny: sprites.back_shiny || null,
        back_shiny_female: sprites.back_shiny_female || null,
      },
      types: types.map((t) => ({
        type: {
          name: t.type,
        },
        slot: t.slot,
      })),
      height: pokemon.height || 0,
      weight: pokemon.weight || 0,
      moves: moves || [],
      order: pokemon.order || 0,
      species: (pokemon.species as string) || '',
      stats: stats || [],
      abilities: abilities || [],
      form: (pokemon.form as string) || '',
    };
  }
}
