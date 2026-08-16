import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { JobsucheSearchParams } from '../interfaces/jobsuche-search-params.interface';

const toBoolean = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value === 'true' : value;

// Public contract stays English - frontend and reviewers read it.
// toJobsucheParams() maps it to the upstream German param names.
export class SearchVacanciesQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  @ApiPropertyOptional({ description: 'Search term / job title' })
  query?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  @ApiPropertyOptional({ description: 'City or postcode' })
  location?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(200)
  @ApiPropertyOptional({ type: Number, minimum: 0, maximum: 200 })
  radius?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ type: Number, default: 1 })
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @ApiPropertyOptional({ type: Number, default: 25, minimum: 1, maximum: 100 })
  size: number = 25;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  @ApiPropertyOptional({ description: 'Posted within N days', maximum: 100 })
  postedIn?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  employer?: string;

  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  temporary?: boolean;

  // page/size are already the same on both sides. Undefined values are
  // dropped by axios itself when building the query string.
  public toJobsucheParams(): JobsucheSearchParams {
    return {
      was: this.query,
      wo: this.location,
      umkreis: this.radius,
      page: this.page,
      size: this.size,
      veroeffentlichtseit: this.postedIn,
      arbeitgeber: this.employer,
      zeitarbeit: this.temporary,
    };
  }
}
