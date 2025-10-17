import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TeamDto } from './dto/team.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { SetTeamPokemonsDto } from './dto/set-team-pokemons.dto';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<TeamDto[]> {
    const teams = await this.prisma.team.findMany({
      include: {
        pokemons: {
          select: {
            pokemonId: true,
            position: true,
          },
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    return teams.map((team) => ({
      id: team.id,
      name: team.name,
      pokemons: team.pokemons.map((p) => p.pokemonId),
    }));
  }

  async findOne(id: number): Promise<TeamDto> {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: {
        pokemons: {
          select: {
            pokemonId: true,
            position: true,
          },
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    return {
      id: team.id,
      name: team.name,
      pokemons: team.pokemons.map((p) => p.pokemonId),
    };
  }

  async create(createTeamDto: CreateTeamDto): Promise<TeamDto> {
    const team = await this.prisma.team.create({
      data: {
        name: createTeamDto.name,
      },
    });

    return {
      id: team.id,
      name: team.name,
      pokemons: [],
    };
  }

  async setPokemons(
    id: number,
    setTeamPokemonsDto: SetTeamPokemonsDto,
  ): Promise<TeamDto> {
    // Check if team exists
    const team = await this.prisma.team.findUnique({ where: { id } });
    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    // Validate that all Pokemon exist
    const pokemonIds = setTeamPokemonsDto.pokemons;
    if (pokemonIds.length > 0) {
      const pokemons = await this.prisma.pokemon.findMany({
        where: { id: { in: pokemonIds } },
      });

      if (pokemons.length !== pokemonIds.length) {
        throw new NotFoundException('One or more Pokemon not found');
      }
    }

    // Delete existing team pokemons
    await this.prisma.teamPokemon.deleteMany({
      where: { teamId: id },
    });

    // Add new team pokemons with positions
    if (pokemonIds.length > 0) {
      await this.prisma.teamPokemon.createMany({
        data: pokemonIds.map((pokemonId, index) => ({
          teamId: id,
          pokemonId,
          position: index + 1,
        })),
      });
    }

    return this.findOne(id);
  }
}
