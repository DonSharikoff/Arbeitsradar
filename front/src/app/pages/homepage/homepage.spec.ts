import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Homepage } from './homepage';

describe('Homepage', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Homepage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function createAndFlushCityCounts() {
    const fixture = TestBed.createComponent(Homepage);
    httpMock
      .match((r) => r.url === '/api/vacancies')
      .forEach((req) => req.flush({ items: [], total: 0, page: 1, size: 1 }));
    fixture.detectChanges();
    httpMock.match((r) => r.url === '/api/cities').forEach((req) => req.flush([]));
    return fixture;
  }

  it('should create', () => {
    const fixture = createAndFlushCityCounts();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the hero headline', () => {
    const fixture = createAndFlushCityCounts();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('vollen Bild');
  });

  it('defaults the city search to München when the form is submitted untouched', () => {
    const fixture = createAndFlushCityCounts();
    fixture.detectChanges();

    const navigateSpy = vi.spyOn(TestBed.inject(Router), 'navigate');
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { cancelable: true }));

    expect(navigateSpy).toHaveBeenCalledWith(['/vacancies'], {
      queryParams: { location: 'München' },
    });
  });
});
