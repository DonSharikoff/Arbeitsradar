import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { VacanciesService } from '../../services/vacancies.service';

interface ProfessionField {
  label: string;
  query: string;
}

interface Category {
  label: string;
  query: string;
  classes: string;
}

interface City {
  name: string;
  landmark: string;
  image: string;
}

// Free-licensed landmark photos from Wikimedia Commons, served via the
// Special:FilePath redirect so we don't have to pin exact file-hash URLs.
const COMMONS_FILE_PATH = 'https://commons.wikimedia.org/wiki/Special:FilePath';

const PROFESSION_FIELDS: ProfessionField[] = [
  { label: 'Softwareentwicklung', query: 'Softwareentwickler' },
  { label: 'Pflege', query: 'Pflegefachkraft' },
  { label: 'Handwerk', query: 'Handwerker' },
  { label: 'Logistik', query: 'Logistik' },
  { label: 'Vertrieb', query: 'Vertrieb' },
  { label: 'Gastronomie', query: 'Koch' },
  { label: 'Bildung', query: 'Erzieher' },
  { label: 'Bauwesen', query: 'Bauingenieur' },
];

const CATEGORIES: Category[] = [
  { label: 'IT & Software', query: 'Softwareentwickler', classes: 'bg-indigo-500' },
  { label: 'Pflege & Medizin', query: 'Pflegefachkraft', classes: 'bg-rose-500' },
  { label: 'Handwerk', query: 'Handwerker', classes: 'bg-amber-500' },
  { label: 'Logistik', query: 'Logistik', classes: 'bg-sky-500' },
  { label: 'Vertrieb', query: 'Vertrieb', classes: 'bg-violet-500' },
  { label: 'Gastronomie', query: 'Koch', classes: 'bg-emerald-500' },
  { label: 'Bildung', query: 'Erzieher', classes: 'bg-teal-500' },
  { label: 'Bauwesen', query: 'Bauingenieur', classes: 'bg-orange-500' },
];

const CITIES: City[] = [
  {
    name: 'Berlin',
    landmark: 'Brandenburger Tor',
    image: `${COMMONS_FILE_PATH}/Brandenburger_Tor,_Berlin,_Germany.jpg?width=640`,
  },
  {
    name: 'München',
    landmark: 'Neues Rathaus, Marienplatz',
    image: `${COMMONS_FILE_PATH}/Neues_Rathaus_Marienplatz_Munich.jpg?width=640`,
  },
  {
    name: 'Hamburg',
    landmark: 'Elbphilharmonie',
    image: `${COMMONS_FILE_PATH}/Elbphilharmonie_Hamburg_Germany.jpg?width=640`,
  },
  {
    name: 'Köln',
    landmark: 'Kölner Dom',
    image: `${COMMONS_FILE_PATH}/Cologne_Cathedral.jpg?width=640`,
  },
];

@Component({
  selector: 'app-landing',
  imports: [RouterLink],
  templateUrl: './landing.html',
})
export class Landing {
  private readonly router = inject(Router);
  private readonly vacanciesService = inject(VacanciesService);

  protected readonly professionFields = PROFESSION_FIELDS;
  protected readonly categories = CATEGORIES;
  protected readonly cities = CITIES;
  protected readonly cityVacancyCounts = signal<Record<string, number>>({});

  public constructor() {
    for (const city of CITIES) {
      this.vacanciesService.search({ location: city.name, size: 1 }).subscribe((res) => {
        this.cityVacancyCounts.update((counts) => ({ ...counts, [city.name]: res.total }));
      });
    }
  }

  protected search(term: string): void {
    this.router.navigate(['/vacancies'], { queryParams: term ? { query: term } : {} });
  }
}
