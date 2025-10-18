import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { PokemonDto } from '../pokemons/dto/pokemon.dto';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({
    summary: 'Search Pokemon by name or type',
    description:
      'Search for Pokemon by their name or type. The search is case-insensitive and supports partial matches.',
  })
  @ApiQuery({
    name: 'query',
    required: true,
    description: 'Search query (Pokemon name or type)',
    example: 'pikachu',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum number of results to return',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'List of matching Pokemon',
    type: [PokemonDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Query parameter is required',
  })
  async search(
    @Query('query') query?: string,
    @Query('limit') limit?: string,
  ): Promise<PokemonDto[]> {
    if (!query) {
      throw new BadRequestException('Query parameter is required');
    }

    const limitNumber = limit ? parseInt(limit, 10) : undefined;

    if (limit && isNaN(limitNumber!)) {
      throw new BadRequestException('Limit must be a valid number');
    }

    return this.searchService.searchPokemons(query, limitNumber);
  }
}
