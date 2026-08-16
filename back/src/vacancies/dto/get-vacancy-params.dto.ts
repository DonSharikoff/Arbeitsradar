import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetVacancyDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9-]{3,100}$/, {
    message: 'id has an invalid format',
  })
  @ApiProperty({ example: '10000-1198951489-S' })
  id: string;
}
