import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { VacanciesResponse } from '../models/vacancy.model';

export interface VacanciesSearchParams {
  query?: string;
  location?: string;
  page?: number;
  size?: number;
}

@Injectable({ providedIn: 'root' })
export class VacanciesService {
  private readonly http = inject(HttpClient);

  public search(params: VacanciesSearchParams = {}): Observable<VacanciesResponse> {
    let httpParams = new HttpParams();
    if (params.query) httpParams = httpParams.set('query', params.query);
    if (params.location) httpParams = httpParams.set('location', params.location);
    if (params.page) httpParams = httpParams.set('page', params.page);
    if (params.size) httpParams = httpParams.set('size', params.size);

    return this.http.get<VacanciesResponse>('/api/vacancies', { params: httpParams });
  }
}
