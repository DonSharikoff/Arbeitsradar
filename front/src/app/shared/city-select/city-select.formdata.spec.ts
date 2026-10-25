import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CitySelect } from './city-select';

@Component({
  imports: [CitySelect],
  template: `<form><app-city-select [initialValue]="initial" /></form>`,
})
class HostComponent {
  public initial = '';
}

describe('CitySelect inside a native form', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function flushCities() {
    httpMock.match((r) => r.url === '/api/cities').forEach((req) => req.flush([]));
  }

  it('submits the initial value via FormData, unchanged', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.initial = 'München';
    fixture.detectChanges();
    flushCities();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    const data = new FormData(form);

    expect(data.get('location')).toBe('München');
  });

  it('submits a typed value that was never explicitly selected', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    flushCities();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'Leipzig';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    const data = new FormData(form);

    expect(data.get('location')).toBe('Leipzig');
  });
});
