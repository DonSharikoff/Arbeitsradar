import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class ArbeitService {
  public constructor(private readonly httpService: HttpService) {}

  private readonly url: string = 'https://rest.arbeitsagentur.de';
  private readonly jobSearch: string = 'jobboerse/jobsuche-service/pc/v4/jobs';
  private readonly publicAPIKey: string = 'jobboerse-jobsuche';

  public index(): Observable<AxiosResponse<any, any>> {
    return this.httpService
      .get(`${this.url}/${this.jobSearch}`, {
        headers: { 'X-API-Key': this.publicAPIKey },
      })
      .pipe(map((response) => response.data));
  }
}
