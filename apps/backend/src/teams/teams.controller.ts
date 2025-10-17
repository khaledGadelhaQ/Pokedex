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
import { TeamsService } from './teams.service';
import { TeamDto } from './dto/team.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { SetTeamPokemonsDto } from './dto/set-team-pokemons.dto';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
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
  findOne(@Param('id', ParseIntPipe) id: number): Promise<TeamDto> {
    return this.teamsService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createTeamDto: CreateTeamDto): Promise<TeamDto> {
    return this.teamsService.create(createTeamDto);
  }

  @Post(':id')
  @UseGuards(AuthGuard)
  setPokemons(
    @Param('id', ParseIntPipe) id: number,
    @Body() setTeamPokemonsDto: SetTeamPokemonsDto,
  ): Promise<TeamDto> {
    return this.teamsService.setPokemons(id, setTeamPokemonsDto);
  }
}
