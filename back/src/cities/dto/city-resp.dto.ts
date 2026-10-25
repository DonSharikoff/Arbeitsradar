import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CityRespDto {
  @Expose()
  @ApiProperty()
  declare name: string;

  @Expose()
  @ApiProperty()
  declare state: string;

  @Expose()
  @ApiProperty()
  declare population: number;

  @Expose()
  @ApiProperty({ type: [String] })
  declare postalCodes: string[];

  @Expose()
  @ApiProperty()
  declare lat: number;

  @Expose()
  @ApiProperty()
  declare lon: number;
}
