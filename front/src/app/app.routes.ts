import { Routes } from '@angular/router';
import { Homepage } from './pages/homepage/homepage';
import { VacanciesList } from './pages/vacancies-list/vacancies-list';

export const routes: Routes = [
  { path: '', component: Homepage },
  { path: 'vacancies', component: VacanciesList },
];
