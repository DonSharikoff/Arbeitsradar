import { Exclude, Expose } from 'class-transformer';
import type {
  JobsucheStellenlokation,
  JobsucheZeitraum,
} from '../interfaces/jobsuche-response.interface';

// Holds every raw upstream (German) field for a single search-result item
// as-is - nothing is dropped during the transform, only excluded from the
// serialized output. Both decorators are required together on each field:
// @Expose so plainToInstance keeps it under excludeExtraneousValues (needed
// to drop genuine noise like the wrapper's "facetten"), @Exclude
// (toPlainOnly) so instanceToPlain still leaves it out of the JSON output.
// English getters live on the subclass (VacanciesListsDto).
export class VacancyListItemRawDto {
  @Expose()
  @Exclude({ toPlainOnly: true })
  referenznummer: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  stellenangebotsart?: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  stellenangebotsTitel: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  hauptberuf: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  alleBerufe?: string[];

  @Expose()
  @Exclude({ toPlainOnly: true })
  weitereBerufe?: string[];

  @Expose()
  @Exclude({ toPlainOnly: true })
  alternativBeruf1?: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  alternativBeruf2?: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  firma: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  arbeitgeberKundennummerHash?: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  stellenlokationen: JobsucheStellenlokation[];

  @Expose()
  @Exclude({ toPlainOnly: true })
  entfernung?: number;

  @Expose()
  @Exclude({ toPlainOnly: true })
  eintrittszeitraum?: JobsucheZeitraum;

  @Expose()
  @Exclude({ toPlainOnly: true })
  veroeffentlichungszeitraum?: JobsucheZeitraum;

  @Expose()
  @Exclude({ toPlainOnly: true })
  datumErsteVeroeffentlichung?: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  aenderungsdatum?: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  verguetungsangabe?: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  artDerVerguetung?: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  festgehalt?: number;

  @Expose()
  @Exclude({ toPlainOnly: true })
  gehaltsspanneVon?: number;

  @Expose()
  @Exclude({ toPlainOnly: true })
  gehaltsspanneBis?: number;

  @Expose()
  @Exclude({ toPlainOnly: true })
  vertragsdauer?: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  befristetBis?: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  befristungInMonaten?: number;

  @Expose()
  @Exclude({ toPlainOnly: true })
  arbeitszeitVollzeit?: boolean;

  @Expose()
  @Exclude({ toPlainOnly: true })
  arbeitszeitTeilzeitVormittag?: boolean;

  @Expose()
  @Exclude({ toPlainOnly: true })
  arbeitszeitTeilzeitNachmittag?: boolean;

  @Expose()
  @Exclude({ toPlainOnly: true })
  arbeitszeitTeilzeitAbend?: boolean;

  @Expose()
  @Exclude({ toPlainOnly: true })
  arbeitszeitTeilzeitFlexibel?: boolean;

  @Expose()
  @Exclude({ toPlainOnly: true })
  arbeitszeitSchichtNachtWochenende?: boolean;

  @Expose()
  @Exclude({ toPlainOnly: true })
  istGeringfuegigeBeschaeftigung?: boolean;

  @Expose()
  @Exclude({ toPlainOnly: true })
  homeofficemoeglich?: boolean;

  @Expose()
  @Exclude({ toPlainOnly: true })
  homeofficetyp?: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  quereinstiegGeeignet?: boolean;

  @Expose()
  @Exclude({ toPlainOnly: true })
  ausbildungsart?: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  studienform?: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  studiengang?: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  chiffrenummer?: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  externeURL?: string;
}
