import { IsArray, IsInt, ArrayMaxSize, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetTeamPokemonsDto {
  @ApiProperty({
    example: [25, 6, 9, 1, 4, 7],
    description: 'Array of Pokemon IDs to add to the team (max 6)',
    type: [Number],
  })
  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(6)
  @IsInt({ each: true })
  pokemons: number[];
}
