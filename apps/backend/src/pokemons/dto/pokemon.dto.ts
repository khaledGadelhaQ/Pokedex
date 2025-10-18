import { ApiProperty } from '@nestjs/swagger';

export class PokemonDto {
  @ApiProperty({ example: 25, description: 'Pokemon ID' })
  id: number;

  @ApiProperty({ example: 'pikachu', description: 'Pokemon name' })
  name: string;

  @ApiProperty({
    example: { front_default: '/images/sprites/25-front_default.png' },
    description: 'Pokemon sprites',
  })
  sprites: {
    front_default: string | null;
  };

  @ApiProperty({
    example: [{ type: { name: 'electric' }, slot: 1 }],
    description: 'Pokemon types',
  })
  types: Array<{
    type: {
      name: string;
    };
    slot: number;
  }>;
}
