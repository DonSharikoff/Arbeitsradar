import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VacancyCard } from '../../vacancy-card/vacancy-card';
import { Pagination } from '../../shared/pagination/pagination';
import { CitySelect } from '../../shared/city-select/city-select';
import { Vacancy } from '../../models/vacancy.model';
import { VacanciesService } from '../../services/vacancies.service';

const PAGE_SIZE = 12;

@Component({
  selector: 'app-vacancies-list',
  imports: [VacancyCard, Pagination, CitySelect],
  templateUrl: './vacancies-list.html',
})
export class VacanciesList {
  private readonly vacanciesService = inject(VacanciesService);
  private readonly route = inject(ActivatedRoute);

  protected readonly searchTerm = signal(this.route.snapshot.queryParamMap.get('query') ?? '');
  protected readonly locationFilter = signal(
    this.route.snapshot.queryParamMap.get('location') ?? '',
  );
  protected readonly page = signal(1);
  protected readonly vacancies = signal<Vacancy[]>([]);
  protected readonly total = signal(0);
  protected readonly loading = signal(false);
  protected readonly error = signal(false);

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.total() / PAGE_SIZE)),
  );

  public constructor() {
    this.load();
  }

  protected onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    this.searchTerm.set((formData.get('query') as string | null) ?? '');
    this.locationFilter.set((formData.get('location') as string | null) ?? '');
    this.page.set(1);
    this.load();
  }

  protected goToPage(page: number): void {
    this.page.set(page);
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(false);

    this.vacanciesService
      .search({
        query: this.searchTerm() || undefined,
        location: this.locationFilter() || undefined,
        page: this.page(),
        size: PAGE_SIZE,
      })
      .subscribe({
        next: (res) => {
          this.vacancies.set(res.items);
          this.total.set(res.total);
          this.loading.set(false);
        },
        error: () => {
          this.error.set(true);
          this.loading.set(false);
        },
      });
  }
}
