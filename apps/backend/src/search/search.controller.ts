import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { SearchService } from './search.service';
import { PokemonDto } from '../pokemons/dto/pokemon.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
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
