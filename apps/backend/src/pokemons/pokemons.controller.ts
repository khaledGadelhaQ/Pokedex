import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { PokemonsService } from './pokemons.service';
import { PokemonDto } from './dto/pokemon.dto';
import { PokemonDetailsDto } from './dto/pokemon-details.dto';

@ApiTags('Pokemons')
@Controller('pokemons')
export class PokemonsController {
  constructor(private readonly pokemonsService: PokemonsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all Pokemon' })
  @ApiQuery({
    name: 'sort',
    required: false,
    enum: ['name-asc', 'name-desc', 'id-asc', 'id-desc'],
    description: 'Sort order for Pokemon',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum number of Pokemon to return',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Number of Pokemon to skip',
  })
  @ApiResponse({
    status: 200,
    description: 'List of Pokemon',
    type: [PokemonDto],
  })
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
  @ApiOperation({ summary: 'Get a Pokemon by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Pokemon ID',
    example: 25,
  })
  @ApiResponse({
    status: 200,
    description: 'Pokemon details',
    type: PokemonDetailsDto,
  })
  @ApiResponse({ status: 404, description: 'Pokemon not found' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PokemonDetailsDto> {
    return this.pokemonsService.findOne(id);
  }
}
