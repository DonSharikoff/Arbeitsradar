import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { VacanciesList } from './pages/vacancies-list/vacancies-list';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'vacancies', component: VacanciesList },
];
