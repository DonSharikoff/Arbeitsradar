import { Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Vacancy } from '../models/vacancy.model';

const EMPLOYMENT_TYPE_META: Record<string, { label: string; classes: string }> = {
  ARBEIT: { label: 'Festanstellung', classes: 'bg-indigo-50 text-indigo-700' },
  AUSBILDUNG: { label: 'Ausbildung', classes: 'bg-violet-50 text-violet-700' },
  SELBSTAENDIGKEIT: { label: 'Selbstständig', classes: 'bg-amber-50 text-amber-700' },
  PRAKTIKUM: { label: 'Praktikum', classes: 'bg-rose-50 text-rose-700' },
};

const ACCENT_BAR: Record<string, string> = {
  ARBEIT: 'bg-indigo-500',
  AUSBILDUNG: 'bg-violet-500',
  SELBSTAENDIGKEIT: 'bg-amber-500',
  PRAKTIKUM: 'bg-rose-500',
};

const DAY_MS = 86_400_000;
const NEW_THRESHOLD_DAYS = 7;

// Matches the German gender-neutral suffix in job titles, e.g. "(m/w/d)",
// "m/w/d", "(w/m/x)" - letters and order vary, slashes and parens are optional.
const GENDER_SUFFIX_RE = /\(?\s*[mwdx]\s*(?:\/\s*[mwdx]\s*){1,2}\)?/gi;

@Component({
  selector: 'app-vacancy-card',
  imports: [DatePipe],
  templateUrl: './vacancy-card.html',
})
export class VacancyCard {
  public readonly vacancy = input.required<Vacancy>();

  protected readonly salaryLabel = computed(() => {
    const v = this.vacancy();
    if (v.fixedWage) return `${v.fixedWage} €`;
    if (v.salaryFrom && v.salaryTo) return `${v.salaryFrom}–${v.salaryTo} €`;
    if (v.salaryFrom) return `ab ${v.salaryFrom} €`;
    return undefined;
  });

  protected readonly employmentTypeMeta = computed(() => {
    const type = this.vacancy().employmentType;
    return type ? EMPLOYMENT_TYPE_META[type] : undefined;
  });

  protected readonly accentClass = computed(
    () => ACCENT_BAR[this.vacancy().employmentType ?? ''] ?? 'bg-slate-300',
  );

  protected readonly cleanTitle = computed(() =>
    this.vacancy()
      .title.replace(GENDER_SUFFIX_RE, '')
      .replace(/\s{2,}/g, ' ')
      .trim(),
  );

  protected readonly genderSuffix = computed(() => {
    const match = this.vacancy().title.match(GENDER_SUFFIX_RE);
    return match?.[0].replace(/[()]/g, '').trim().toLowerCase();
  });

  protected readonly isNew = computed(() => {
    const published = this.vacancy().publishedAt;
    if (!published) return false;
    const ageDays = (Date.now() - new Date(published).getTime()) / DAY_MS;
    return ageDays >= 0 && ageDays <= NEW_THRESHOLD_DAYS;
  });
}
