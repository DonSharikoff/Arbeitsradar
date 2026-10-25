import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchCitiesQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ApiPropertyOptional({ description: 'City name, partial match' })
  declare query?: string;
}
