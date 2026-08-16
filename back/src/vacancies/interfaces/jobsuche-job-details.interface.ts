import {
  JobsucheStellenlokation,
  JobsucheZeitraum,
} from './jobsuche-response.interface';

export interface JobsucheJobDetails {
  referenznummer: string;
  stellenangebotsart: string;
  stellenangebotsTitel: string;
  stellenangebotsBeschreibung?: string;
  hauptberuf: string;
  alternativBeruf1?: string;
  alternativBeruf2?: string;
  weitereBerufe?: string[];
  firma: string;
  arbeitgeberKundennummerHash?: string;
  allianzpartnerName?: string;
  allianzpartnerUrl?: string;
  stellenlokationen: JobsucheStellenlokation[];
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
  arbeitszeitVollzeit?: boolean;
  arbeitszeitTeilzeitVormittag?: boolean;
  arbeitszeitTeilzeitNachmittag?: boolean;
  arbeitszeitTeilzeitAbend?: boolean;
  arbeitszeitTeilzeitFlexibel?: boolean;
  arbeitszeitSchichtNachtWochenende?: boolean;
  homeofficemoeglich?: boolean;
  homeofficetyp?: string;
  istGeringfuegigeBeschaeftigung?: boolean;
  istBehinderungGefordert?: boolean;
  istPrivateArbeitsvermittlung?: boolean;
  istArbeitnehmerUeberlassung?: boolean;
  istBetreut?: boolean;
  quereinstiegGeeignet?: boolean;
  ausbildungsart?: string;
  studienform?: string;
  studiengang?: string;
  geforderterBildungsabschluss?: string;
  chiffrenummer?: string;
  externeURL?: string;
}
