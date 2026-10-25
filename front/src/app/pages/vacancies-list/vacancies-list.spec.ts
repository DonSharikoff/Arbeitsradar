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

  function flushCities() {
    httpMock.match((r) => r.url === '/api/cities').forEach((req) => req.flush([]));
  }

  it('loads vacancies on init', () => {
    const fixture = TestBed.createComponent(VacanciesList);

    const req = httpMock.expectOne((r) => r.url === '/api/vacancies');
    req.flush({ items: [{ externalRef: '1', title: 'Test', employer: 'Acme', homeOffice: false, fullTime: true, partTime: false }], total: 1, page: 1, size: 12 });

    fixture.detectChanges();
    flushCities();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('disables the search button while a request is in flight', () => {
    const fixture = TestBed.createComponent(VacanciesList);
    fixture.detectChanges();
    flushCities();

    const button = fixture.nativeElement.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;
    expect(button.disabled).toBe(true);

    const req = httpMock.expectOne((r) => r.url === '/api/vacancies');
    req.flush({ items: [], total: 0, page: 1, size: 12 });
    fixture.detectChanges();

    expect(button.disabled).toBe(false);
  });

  it('reports an error state when the request fails', () => {
    const fixture = TestBed.createComponent(VacanciesList);
    const component = fixture.componentInstance as unknown as { error: () => boolean };

    const req = httpMock.expectOne((r) => r.url === '/api/vacancies');
    req.flush('upstream down', { status: 503, statusText: 'Service Unavailable' });

    fixture.detectChanges();
    flushCities();
    expect(component.error()).toBe(true);
  });
});
