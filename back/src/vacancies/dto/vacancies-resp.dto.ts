import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VacancyListItemRawDto } from './vacancy-list-item-raw.dto';

// English view over VacancyListItemRawDto's raw upstream (German) fields -
// see that file for the raw-field-retention rationale. Every getter here
// is the public shape we currently expose for one search-result item.
export class VacanciesListsDto extends VacancyListItemRawDto {
  @Expose()
  @ApiProperty({ example: '10000-1198951489-S' })
  get externalRef(): string {
    return this.referenznummer;
  }

  @Expose()
  @ApiProperty()
  get title(): string {
    return this.stellenangebotsTitel;
  }

  @Expose()
  @ApiProperty()
  get employer(): string {
    return this.firma;
  }

  @Expose()
  @ApiProperty({ description: 'Normalized main profession title' })
  get mainProfession(): string {
    return this.hauptberuf;
  }

  @Expose()
  @ApiPropertyOptional({ description: 'City' })
  get location(): string | undefined {
    return this.stellenlokationen?.[0]?.adresse?.ort;
  }

  @Expose()
  @ApiPropertyOptional({
    description: 'Other profession titles this posting also matches',
  })
  get allProfessions(): string[] | undefined {
    return this.alleBerufe;
  }

  @Expose()
  @ApiPropertyOptional({
    description: 'Further profession titles matched by search',
  })
  get furtherProfessions(): string[] | undefined {
    return this.weitereBerufe;
  }

  @Expose()
  @ApiPropertyOptional()
  get alternativeProfession1(): string | undefined {
    return this.alternativBeruf1;
  }

  @Expose()
  @ApiPropertyOptional()
  get alternativeProfession2(): string | undefined {
    return this.alternativBeruf2;
  }

  @Expose()
  @ApiPropertyOptional({ description: 'Hashed employer customer number' })
  get employerHash(): string | undefined {
    return this.arbeitgeberKundennummerHash;
  }

  @Expose()
  @ApiPropertyOptional({ description: 'Distance from search location, km' })
  get distanceKm(): number | undefined {
    return this.entfernung;
  }

  @Expose()
  @ApiPropertyOptional({ description: 'ISO date string' })
  get publishedAt(): string | undefined {
    return (
      this.veroeffentlichungszeitraum?.von ?? this.datumErsteVeroeffentlichung
    );
  }

  @Expose()
  @ApiPropertyOptional({ description: 'ISO date string' })
  get startDate(): string | undefined {
    return this.eintrittszeitraum?.von;
  }

  @Expose()
  @ApiPropertyOptional({ description: 'ISO date string, last modified' })
  get updatedAt(): string | undefined {
    return this.aenderungsdatum;
  }

  @Expose()
  @ApiPropertyOptional()
  get homeOffice(): boolean {
    return !!this.homeofficemoeglich;
  }

  @Expose()
  @ApiPropertyOptional()
  get fullTime(): boolean {
    return !!this.arbeitszeitVollzeit;
  }

  @Expose()
  @ApiPropertyOptional()
  get partTime(): boolean {
    return !!(
      this.arbeitszeitTeilzeitVormittag ||
      this.arbeitszeitTeilzeitNachmittag ||
      this.arbeitszeitTeilzeitAbend ||
      this.arbeitszeitTeilzeitFlexibel
    );
  }

  @Expose()
  @ApiPropertyOptional({ description: 'BEFRISTET or UNBEFRISTET' })
  get contractDuration(): string | undefined {
    return this.vertragsdauer;
  }

  @Expose()
  @ApiPropertyOptional({ description: 'ISO date string' })
  get fixedTermUntil(): string | undefined {
    return this.befristetBis;
  }

  @Expose()
  @ApiPropertyOptional()
  get contractDurationMonths(): number | undefined {
    return this.befristungInMonaten;
  }

  @Expose()
  @ApiPropertyOptional({
    description: 'ARBEIT, SELBSTAENDIGKEIT, AUSBILDUNG, ...',
  })
  get employmentType(): string | undefined {
    return this.stellenangebotsart;
  }

  @Expose()
  @ApiPropertyOptional({ description: 'Shift, night, or weekend work' })
  get shiftWork(): boolean {
    return !!this.arbeitszeitSchichtNachtWochenende;
  }

  @Expose()
  @ApiPropertyOptional({ description: 'Marginal employment ("Minijob")' })
  get miniJob(): boolean {
    return !!this.istGeringfuegigeBeschaeftigung;
  }

  @Expose()
  @ApiPropertyOptional()
  get homeOfficeType(): string | undefined {
    return this.homeofficetyp;
  }

  @Expose()
  @ApiPropertyOptional({ description: 'Suitable for career changers' })
  get careerChangerSuitable(): boolean {
    return !!this.quereinstiegGeeignet;
  }

  @Expose()
  @ApiPropertyOptional()
  get apprenticeshipType(): string | undefined {
    return this.ausbildungsart;
  }

  @Expose()
  @ApiPropertyOptional()
  get studyType(): string | undefined {
    return this.studienform;
  }

  @Expose()
  @ApiPropertyOptional()
  get studyProgram(): string | undefined {
    return this.studiengang;
  }

  @Expose()
  @ApiPropertyOptional({ description: 'KEINE_ANGABEN, JAHRESGEHALT, ...' })
  get compensationDisclosure(): string | undefined {
    return this.verguetungsangabe;
  }

  @Expose()
  @ApiPropertyOptional({ description: 'GEHALTSSPANNE, FESTGEHALT, ...' })
  get compensationType(): string | undefined {
    return this.artDerVerguetung;
  }

  @Expose()
  @ApiPropertyOptional({ description: 'Fixed wage, as disclosed upstream' })
  get fixedWage(): number | undefined {
    return this.festgehalt;
  }

  @Expose()
  @ApiPropertyOptional()
  get salaryFrom(): number | undefined {
    return this.gehaltsspanneVon;
  }

  @Expose()
  @ApiPropertyOptional()
  get salaryTo(): number | undefined {
    return this.gehaltsspanneBis;
  }

  @Expose()
  @ApiPropertyOptional({
    description: 'Anonymous ad reference number (employer identity hidden)',
  })
  get cipherNumber(): string | undefined {
    return this.chiffrenummer;
  }

  @Expose()
  @ApiPropertyOptional()
  get externalUrl(): string | undefined {
    return this.externeURL;
  }
}

export class VacanciesListDto {
  @Expose()
  @Exclude({ toPlainOnly: true })
  @Type(() => VacanciesListsDto)
  ergebnisliste: VacanciesListsDto[] = [];

  @Expose()
  @Exclude({ toPlainOnly: true })
  maxErgebnisse: number = 0;

  @Expose()
  @Exclude({ toPlainOnly: true })
  facetten?: Record<string, unknown>;

  @Expose()
  @ApiProperty({ type: [VacanciesListsDto] })
  get items(): VacanciesListsDto[] {
    return this.ergebnisliste;
  }

  @Expose()
  @ApiProperty()
  get total(): number {
    return this.maxErgebnisse;
  }

  @Expose()
  @ApiProperty()
  page: number = 1;

  @Expose()
  @ApiProperty()
  size: number = 0;
}
