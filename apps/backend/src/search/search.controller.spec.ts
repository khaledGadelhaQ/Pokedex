import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

describe('SearchController', () => {
  let controller: SearchController;

  const mockPokemon = {
    id: 1,
    name: 'Bulbasaur',
    types: ['grass', 'poison'],
    sprites: {
      front_default: '/images/sprites/1-front_default.png',
    },
  };

  const mockSearchService = {
    searchPokemons: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        {
          provide: SearchService,
          useValue: mockSearchService,
        },
      ],
    }).compile();

    controller = module.get<SearchController>(SearchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('search', () => {
    it('should return search results', async () => {
      const result = [mockPokemon];
      mockSearchService.searchPokemons.mockResolvedValue(result);

      expect(await controller.search('bulba', '10')).toBe(result);
    });
  });
});
