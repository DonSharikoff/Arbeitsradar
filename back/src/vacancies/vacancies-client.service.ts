import { Injectable } from '@nestjs/common';
import { catchError, map, Observable, throwError } from 'rxjs';
import { VacanciesListDto } from './dto/vacancies-resp.dto';
import { HttpService } from '@nestjs/axios';
import { VacancyRespDto } from './dto/vacancy-resp.dto';
import { mapJobsucheError } from './vacancies-error.mapper';
import { SearchVacanciesQueryDto } from './dto/search-vacancies-query.dto';

@Injectable()
export class VacanciesClientService {
  private readonly JOBSUCHE_JOBS_PATH: string =
    '/jobboerse/jobsuche-service/pc/v6/jobs';

  private readonly JOBSUCHE_JOBDETAILS_PATH =
    '/jobboerse/jobsuche-service/pc/v4/jobdetails';

  public constructor(private readonly httpService: HttpService) {}

  public getList(
    params: SearchVacanciesQueryDto,
  ): Observable<VacanciesListDto> {
    return this.httpService
      .get<VacanciesListDto>(this.JOBSUCHE_JOBS_PATH, {
        params: params.toJobsucheParams(),
      })
      .pipe(
        map((res) => res.data),
        catchError((error) =>
          throwError(() => mapJobsucheError(error, 'Vacancy search')),
        ),
      );
  }

  public getJobDetail(id: string): Observable<VacancyRespDto> {
    return this.httpService
      .get<VacancyRespDto>(
        `${this.JOBSUCHE_JOBDETAILS_PATH}/${this.encodedId(id)}`,
      )
      .pipe(
        map((res) => res.data),
        catchError((error) =>
          throwError(() => mapJobsucheError(error, 'Vacancy')),
        ),
      );
  }

  private encodedId(id: string): string {
    return Buffer.from(id, 'utf-8').toString('base64');
  }
}
