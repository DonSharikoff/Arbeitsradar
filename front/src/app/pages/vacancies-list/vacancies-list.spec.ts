import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { VacanciesList } from './vacancies-list';

describe('VacanciesList', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VacanciesList],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads vacancies on init', () => {
    const fixture = TestBed.createComponent(VacanciesList);

    const req = httpMock.expectOne((r) => r.url === '/api/vacancies');
    req.flush({ items: [{ externalRef: '1', title: 'Test', employer: 'Acme', homeOffice: false, fullTime: true, partTime: false }], total: 1, page: 1, size: 12 });

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('reports an error state when the request fails', () => {
    const fixture = TestBed.createComponent(VacanciesList);
    const component = fixture.componentInstance as unknown as { error: () => boolean };

    const req = httpMock.expectOne((r) => r.url === '/api/vacancies');
    req.flush('upstream down', { status: 503, statusText: 'Service Unavailable' });

    expect(component.error()).toBe(true);
  });
});
