import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { TeamDto } from './dto/team.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { SetTeamPokemonsDto } from './dto/set-team-pokemons.dto';
import { AuthGuard } from '../common/guards/auth.guard';

@ApiTags('Teams')
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all teams' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search teams by name',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum number of teams to return',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Number of teams to skip',
  })
  @ApiResponse({ status: 200, description: 'List of teams', type: [TeamDto] })
  findAll(
    @Query('search') search?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<TeamDto[]> {
    const limitNumber = limit ? parseInt(limit, 10) : undefined;
    const offsetNumber = offset ? parseInt(offset, 10) : undefined;
    return this.teamsService.findAll(search, limitNumber, offsetNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a team by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Team ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Team details', type: TeamDto })
  @ApiResponse({ status: 404, description: 'Team not found' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<TeamDto> {
    return this.teamsService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Create a new team' })
  @ApiResponse({
    status: 201,
    description: 'Team created successfully',
    type: TeamDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createTeamDto: CreateTeamDto): Promise<TeamDto> {
    return this.teamsService.create(createTeamDto);
  }

  @Post(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Set Pokemon for a team' })
  @ApiParam({ name: 'id', type: Number, description: 'Team ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Team updated successfully',
    type: TeamDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  setPokemons(
    @Param('id', ParseIntPipe) id: number,
    @Body() setTeamPokemonsDto: SetTeamPokemonsDto,
  ): Promise<TeamDto> {
    return this.teamsService.setPokemons(id, setTeamPokemonsDto);
  }
}
