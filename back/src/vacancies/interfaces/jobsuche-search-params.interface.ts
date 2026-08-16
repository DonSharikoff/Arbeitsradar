export enum JobsucheAngebotsart {
  ARBEIT = '1',
  SELBSTAENDIGKEIT = '2',
  AUSBILDUNG = '4',
  PRAKTIKUM_TRAINEE = '34',
}

export enum JobsucheBefristung {
  BEFRISTET = '1',
  UNBEFRISTET = '2',
}

export enum JobsucheArbeitszeit {
  VOLLZEIT = 'vz',
  TEILZEIT = 'tz',
  SCHICHT_NACHT_WOCHENENDE = 'snw',
  HEIM_TELEARBEIT = 'ho',
  MINIJOB = 'mj',
}

// Upstream request shape for pc/v6/jobs - what actually goes on the wire.
// The public contract (dto/search-vacancies-query.dto.ts) is English and
// gets mapped to this via that DTO's toJobsucheParams().
export interface JobsucheSearchParams {
  was?: string;
  wo?: string;
  umkreis?: number;
  page: number;
  size: number;
  veroeffentlichtseit?: number;
  arbeitgeber?: string;
  zeitarbeit?: boolean;
  angebotsart?: JobsucheAngebotsart;
  befristung?: JobsucheBefristung;
  arbeitszeit?: JobsucheArbeitszeit[];
  berufsfeld?: string;
  pav?: boolean;
}
