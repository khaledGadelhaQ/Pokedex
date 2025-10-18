import { ApiProperty } from '@nestjs/swagger';

export class TeamDto {
  @ApiProperty({ example: 1, description: 'Team ID' })
  id: number;

  @ApiProperty({ example: 'My Awesome Team', description: 'Team name' })
  name: string;

  @ApiProperty({
    example: [25, 6, 9],
    description: 'Array of Pokemon IDs in the team (max 6)',
    type: [Number],
  })
  pokemons: number[];
}
