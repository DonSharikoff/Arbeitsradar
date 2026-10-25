import { TestBed } from '@angular/core/testing';
import { VacancyCard } from './vacancy-card';
import { Vacancy } from '../models/vacancy.model';

const BASE_VACANCY: Vacancy = {
  externalRef: '1',
  title: 'Softwareentwickler (m/w/d)',
  employer: 'Acme GmbH',
  homeOffice: false,
  fullTime: true,
  partTime: false,
};

type ProtectedCardApi = {
  cleanTitle: () => string;
  genderSuffix: () => string | undefined;
  salaryLabel: () => string | undefined;
};

describe('VacancyCard', () => {
  function createWith(overrides: Partial<Vacancy>) {
    const fixture = TestBed.createComponent(VacancyCard);
    fixture.componentRef.setInput('vacancy', { ...BASE_VACANCY, ...overrides });
    fixture.detectChanges();
    return fixture.componentInstance as unknown as ProtectedCardApi;
  }

  it('strips the gender suffix from the title', () => {
    const component = createWith({ title: 'Erzieher (m/w/d) - Kita' });
    expect(component.cleanTitle()).toBe('Erzieher - Kita');
    expect(component.genderSuffix()).toBe('m/w/d');
  });

  it('leaves titles without a gender suffix untouched', () => {
    const component = createWith({ title: 'Motivierte Kollegen gesucht' });
    expect(component.cleanTitle()).toBe('Motivierte Kollegen gesucht');
    expect(component.genderSuffix()).toBeUndefined();
  });

  it('formats a salary range', () => {
    const component = createWith({ salaryFrom: 3000, salaryTo: 4000 });
    expect(component.salaryLabel()).toBe('3000–4000 €');
  });

  it('prefers the fixed wage over a salary range', () => {
    const component = createWith({ fixedWage: 2500, salaryFrom: 3000, salaryTo: 4000 });
    expect(component.salaryLabel()).toBe('2500 €');
  });
});
