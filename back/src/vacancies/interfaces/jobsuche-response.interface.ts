export interface JobsucheAdresse {
  strasse?: string;
  hausnummer?: string;
  plz?: string;
  ort?: string;
  region?: string;
  land?: string;
}

export interface JobsucheStellenlokation {
  adresse: JobsucheAdresse;
  breite?: number;
  laenge?: number;
}

export interface JobsucheZeitraum {
  von?: string;
  bis?: string;
}

export interface JobsucheStellenangebot {
  referenznummer: string;
  stellenangebotsart?: string;
  stellenangebotsTitel: string;
  hauptberuf: string;
  alleBerufe?: string[];
  weitereBerufe?: string[];
  alternativBeruf1?: string;
  alternativBeruf2?: string;
  firma: string;
  arbeitgeberKundennummerHash?: string;
  stellenlokationen: JobsucheStellenlokation[];
  entfernung?: number;
  eintrittszeitraum?: JobsucheZeitraum;
  veroeffentlichungszeitraum?: JobsucheZeitraum;
  datumErsteVeroeffentlichung?: string;
  aenderungsdatum?: string;
  verguetungsangabe?: string;
  artDerVerguetung?: string;
  festgehalt?: number;
  gehaltsspanneVon?: number;
  gehaltsspanneBis?: number;
  vertragsdauer?: string;
  befristetBis?: string;
  befristungInMonaten?: number;
  arbeitszeitVollzeit?: boolean;
  arbeitszeitTeilzeitVormittag?: boolean;
  arbeitszeitTeilzeitNachmittag?: boolean;
  arbeitszeitTeilzeitAbend?: boolean;
  arbeitszeitTeilzeitFlexibel?: boolean;
  arbeitszeitSchichtNachtWochenende?: boolean;
  istGeringfuegigeBeschaeftigung?: boolean;
  homeofficemoeglich?: boolean;
  homeofficetyp?: string;
  quereinstiegGeeignet?: boolean;
  ausbildungsart?: string;
  studienform?: string;
  studiengang?: string;
  chiffrenummer?: string;
  externeURL?: string;
}

export interface JobsucheSearchResponse {
  ergebnisliste: JobsucheStellenangebot[];
  maxErgebnisse: number;
  page: number;
  size: number;
  facetten?: Record<string, unknown>;
}
