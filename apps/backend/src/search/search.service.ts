import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PokemonDto } from '../pokemons/dto/pokemon.dto';
import { DbSprites, DbType } from '../pokemons/types/pokemon-db.types';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async searchPokemons(query: string, limit?: number): Promise<PokemonDto[]> {
    const searchTerm = query.toLowerCase().trim();

    // Get all Pokemon (we'll filter in-memory for type search)
    const allPokemons = await this.prisma.pokemon.findMany({
      select: {
        id: true,
        name: true,
        sprites: true,
        types: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    // Filter by name or type
    const filteredPokemons = allPokemons.filter((pokemon) => {
      // Check if name matches
      if (pokemon.name.toLowerCase().includes(searchTerm)) {
        return true;
      }

      // Check if any type matches
      const types = pokemon.types as unknown as DbType[];
      return types.some((t) => t.type.toLowerCase().includes(searchTerm));
    });

    // Apply limit
    const limitedPokemons = limit
      ? filteredPokemons.slice(0, limit)
      : filteredPokemons;

    // Transform to DTO format
    return limitedPokemons.map((pokemon) => {
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
    });
  }
}
