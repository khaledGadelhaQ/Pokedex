import { Test, TestingModule } from '@nestjs/testing';
import { PokemonsController } from './pokemons.controller';
import { PokemonsService } from './pokemons.service';

describe('PokemonsController', () => {
  let controller: PokemonsController;

  const mockPokemon = {
    id: 1,
    name: 'Bulbasaur',
    types: ['grass', 'poison'],
    height: 7,
    weight: 69,
    stats: [
      { name: 'hp', value: 45 },
      { name: 'attack', value: 49 },
    ],
    abilities: ['overgrow', 'chlorophyll'],
    sprites: {
      front_default: '/images/sprites/1-front_default.png',
    },
  };

  const mockPokemonsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonsController],
      providers: [
        {
          provide: PokemonsService,
          useValue: mockPokemonsService,
        },
      ],
    }).compile();

    controller = module.get<PokemonsController>(PokemonsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of pokemons', async () => {
      const result = [mockPokemon];
      mockPokemonsService.findAll.mockResolvedValue(result);

      expect(await controller.findAll('name-asc', '10', '0')).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single pokemon', async () => {
      mockPokemonsService.findOne.mockResolvedValue(mockPokemon);

      expect(await controller.findOne(1)).toBe(mockPokemon);
    });
  });
});
