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
  declare referenznummer: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare stellenangebotsart?: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare stellenangebotsTitel: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare hauptberuf: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare alleBerufe?: string[];

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare weitereBerufe?: string[];

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare alternativBeruf1?: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare alternativBeruf2?: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare firma: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare arbeitgeberKundennummerHash?: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare stellenlokationen: JobsucheStellenlokation[];

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare entfernung?: number;

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare eintrittszeitraum?: JobsucheZeitraum;

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare veroeffentlichungszeitraum?: JobsucheZeitraum;

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare datumErsteVeroeffentlichung?: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare aenderungsdatum?: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare verguetungsangabe?: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare artDerVerguetung?: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare festgehalt?: number;

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare gehaltsspanneVon?: number;

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare gehaltsspanneBis?: number;

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare vertragsdauer?: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare befristetBis?: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare befristungInMonaten?: number;

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare arbeitszeitVollzeit?: boolean;

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare arbeitszeitTeilzeitVormittag?: boolean;

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare arbeitszeitTeilzeitNachmittag?: boolean;

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare arbeitszeitTeilzeitAbend?: boolean;

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare arbeitszeitTeilzeitFlexibel?: boolean;

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare arbeitszeitSchichtNachtWochenende?: boolean;

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare istGeringfuegigeBeschaeftigung?: boolean;

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare homeofficemoeglich?: boolean;

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare homeofficetyp?: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare quereinstiegGeeignet?: boolean;

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare ausbildungsart?: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare studienform?: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare studiengang?: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare chiffrenummer?: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  declare externeURL?: string;
}
