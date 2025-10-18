import { Test, TestingModule } from '@nestjs/testing';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';

describe('TeamsController', () => {
  let controller: TeamsController;

  const mockTeam = {
    id: 1,
    name: 'My Team',
    pokemons: [],
  };

  const mockTeamsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    setPokemons: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamsController],
      providers: [
        {
          provide: TeamsService,
          useValue: mockTeamsService,
        },
      ],
    }).compile();

    controller = module.get<TeamsController>(TeamsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of teams', async () => {
      const result = [mockTeam];
      mockTeamsService.findAll.mockResolvedValue(result);

      expect(await controller.findAll('10', '0')).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single team', async () => {
      mockTeamsService.findOne.mockResolvedValue(mockTeam);

      expect(await controller.findOne(1)).toBe(mockTeam);
    });
  });

  describe('create', () => {
    it('should create a new team', async () => {
      const createDto = { name: 'New Team' };
      mockTeamsService.create.mockResolvedValue(mockTeam);

      expect(await controller.create(createDto)).toBe(mockTeam);
    });
  });
});
