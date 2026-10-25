import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { City } from '../models/city.model';

@Injectable({ providedIn: 'root' })
export class CitiesService {
  private readonly http = inject(HttpClient);

  public search(query?: string): Observable<City[]> {
    let params = new HttpParams();
    if (query) params = params.set('query', query);

    return this.http.get<City[]>('/api/cities', { params });
  }
}
