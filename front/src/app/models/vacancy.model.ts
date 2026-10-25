export interface Vacancy {
  externalRef: string;
  title: string;
  employer: string;
  location?: string;
  employmentType?: string;
  homeOffice: boolean;
  fullTime: boolean;
  partTime: boolean;
  fixedWage?: number;
  salaryFrom?: number;
  salaryTo?: number;
  publishedAt?: string;
}

export interface VacanciesResponse {
  items: Vacancy[];
  total: number;
  page: number;
  size: number;
}