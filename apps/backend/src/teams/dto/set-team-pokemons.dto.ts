import { IsArray, IsInt, ArrayMaxSize, ArrayMinSize } from 'class-validator';

export class SetTeamPokemonsDto {
  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(6)
  @IsInt({ each: true })
  pokemons: number[];
}
