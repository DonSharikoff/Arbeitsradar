import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { SearchVacanciesQueryDto } from './dto/search-vacancies-query.dto';
import { Observable } from 'rxjs';
import { VacanciesListDto } from './dto/vacancies-resp.dto';
import { GetVacancyDto } from './dto/get-vacancy-params.dto';
import { VacancyRespDto } from './dto/vacancy-resp.dto';
import { VacanciesClientService } from './vacancies-client.service';

@ApiTags('Vacancies')
@Controller('vacancies')
@UseInterceptors(ClassSerializerInterceptor)
export class VacanciesController {
  public constructor(
    private readonly vacanciesClientService: VacanciesClientService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Search vacancies postings' })
  @ApiOkResponse({ type: VacanciesListDto })
  @SerializeOptions({ type: VacanciesListDto, excludeExtraneousValues: true })
  public all(
    @Query() query: SearchVacanciesQueryDto,
  ): Observable<VacanciesListDto> {
    return this.vacanciesClientService.getList(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a single job posting by its external reference number',
  })
  @ApiParam({
    name: 'id',
    example: '10000-1198951489-S',
    description: 'External reference number from the search results',
  })
  @ApiOkResponse({ type: VacancyRespDto })
  @SerializeOptions({ type: VacancyRespDto, excludeExtraneousValues: true })
  public getJobDetail(
    @Param() params: GetVacancyDto,
  ): Observable<VacancyRespDto> {
    return this.vacanciesClientService.getJobDetail(params.id);
  }
}
