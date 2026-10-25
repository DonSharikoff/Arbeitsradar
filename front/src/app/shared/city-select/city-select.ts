import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { City } from '../../models/city.model';
import { CitiesService } from '../../services/cities.service';

const IDLE_SUGGESTIONS_LIMIT = 8;
const QUERY_SUGGESTIONS_LIMIT = 20;
const COMBINING_DIACRITICS = /[\u0300-\u036f]/g;

function normalize(value: string): string {
  return value.normalize('NFKD').replace(COMBINING_DIACRITICS, '').toLowerCase();
}

@Component({
  selector: 'app-city-select',
  templateUrl: './city-select.html',
})
export class CitySelect {
  public readonly name = input('location');
  public readonly placeholder = input('Stadt…');
  public readonly size = input<'sm' | 'lg'>('sm');
  public readonly initialValue = input('');
  public readonly disabled = input(false);

  protected readonly term = signal('');
  protected readonly open = signal(false);

  // Fetched once and kept for the component's lifetime - ~200 cities,
  // doesn't change at runtime. Opening/closing the dropdown and filtering
  // by the typed term are both pure show/hide over this, never a refetch.
  private readonly allCities = signal<City[]>([]);

  protected readonly suggestions = computed(() => {
    const cities = this.allCities();
    const query = normalize(this.term());

    if (!query) return cities.slice(0, IDLE_SUGGESTIONS_LIMIT);

    return cities
      .filter((city) => normalize(city.name).includes(query))
      .slice(0, QUERY_SUGGESTIONS_LIMIT);
  });

  private readonly citiesService = inject(CitiesService);

  public constructor() {
    effect(() => this.term.set(this.initialValue()));

    this.citiesService
      .search()
      .pipe(takeUntilDestroyed())
      .subscribe((cities) => this.allCities.set(cities));
  }

  protected onInput(value: string): void {
    this.term.set(value);
    this.open.set(true);
  }

  protected onFocus(): void {
    this.open.set(true);
  }

  protected onBlur(): void {
    setTimeout(() => this.open.set(false), 150);
  }

  protected select(city: City): void {
    this.term.set(city.name);
    this.open.set(false);
  }

  protected clear(): void {
    this.term.set('');
  }
}
