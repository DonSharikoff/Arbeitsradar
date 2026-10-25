import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { SearchCitiesQueryDto } from './dto/search-cities-query.dto';
import { CityRespDto } from './dto/city-resp.dto';
import { CitiesService } from './cities.service';
import { City } from './schemas/city.schema';

@ApiTags('Cities')
@Controller('cities')
@UseInterceptors(ClassSerializerInterceptor)
export class CitiesController {
  public constructor(private readonly citiesService: CitiesService) {}

  @Get()
  @ApiOperation({ summary: 'Search German cities by name, or list all' })
  @ApiOkResponse({ type: [CityRespDto] })
  @SerializeOptions({ type: CityRespDto, excludeExtraneousValues: true })
  public search(@Query() query: SearchCitiesQueryDto): Observable<City[]> {
    return this.citiesService.search(query.query);
  }
}
