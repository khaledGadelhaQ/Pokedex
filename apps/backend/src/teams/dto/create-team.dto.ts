import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamDto {
  @ApiProperty({
    example: 'My Awesome Team',
    description: 'Team name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
