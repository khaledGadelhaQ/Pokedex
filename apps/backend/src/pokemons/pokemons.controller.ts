import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { PokemonsService } from './pokemons.service';
import { PokemonDto } from './dto/pokemon.dto';
import { PokemonDetailsDto } from './dto/pokemon-details.dto';

@Controller('pokemons')
export class PokemonsController {
  constructor(private readonly pokemonsService: PokemonsService) {}

  @Get()
  findAll(
    @Query('sort') sort?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<PokemonDto[]> {
    const limitNumber = limit ? parseInt(limit, 10) : undefined;
    const offsetNumber = offset ? parseInt(offset, 10) : undefined;
    return this.pokemonsService.findAll(sort, limitNumber, offsetNumber);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PokemonDetailsDto> {
    return this.pokemonsService.findOne(id);
  }
}
