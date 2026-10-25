import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Landing } from './landing';

describe('Landing', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Landing],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function createAndFlushCityCounts() {
    const fixture = TestBed.createComponent(Landing);
    httpMock
      .match((r) => r.url === '/api/vacancies')
      .forEach((req) => req.flush({ items: [], total: 0, page: 1, size: 1 }));
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
});
