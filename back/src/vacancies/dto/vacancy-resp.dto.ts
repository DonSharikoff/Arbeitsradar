import { Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VacancyRawDto } from './vacancy-raw.dto';

export class JobLocationDto {
  @ApiPropertyOptional()
  street?: string;

  @ApiPropertyOptional()
  postalCode?: string;

  @ApiPropertyOptional()
  city?: string;

  @ApiPropertyOptional()
  region?: string;

  @ApiPropertyOptional()
  country?: string;
}

export class JobWorkingTimeDto {
  @ApiProperty()
  fullTime: boolean;

  @ApiProperty()
  partTime: boolean;

  @ApiProperty()
  shiftWork: boolean;

  @ApiProperty()
  homeOffice: boolean;
}

// English view over VacancyRawDto's raw upstream (German) fields - see that
// file for the raw-field-retention rationale. Every getter here is the
// public shape we currently expose for a single job posting's detail.
export class VacancyRespDto extends VacancyRawDto {
  @Expose()
  @ApiProperty({ example: '10000-1198951489-S' })
  get externalRef(): string {
    return this.referenznummer;
  }

  @Expose()
  @ApiPropertyOptional({
    description: 'ARBEIT, SELBSTAENDIGKEIT, AUSBILDUNG, ...',
  })
  get employmentType(): string {
    return this.stellenangebotsart;
  }

  @Expose()
  @ApiProperty()
  get title(): string {
    return this.stellenangebotsTitel;
  }

  @Expose()
  @ApiPropertyOptional()
  get description(): string | undefined {
    return this.stellenangebotsBeschreibung;
  }

  @Expose()
  @ApiProperty({ description: 'Normalized main profession title' })
  get mainProfession(): string {
    return this.hauptberuf;
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
  @ApiPropertyOptional({
    description: 'Further profession titles matched by search',
  })
  get furtherProfessions(): string[] | undefined {
    return this.weitereBerufe;
  }

  @Expose()
  @ApiProperty()
  get employer(): string {
    return this.firma;
  }

  @Expose()
  @ApiPropertyOptional({ description: 'Hashed employer customer number' })
  get employerHash(): string | undefined {
    return this.arbeitgeberKundennummerHash;
  }

  @Expose()
  @ApiPropertyOptional({ description: 'Syndication partner name, if any' })
  get partnerName(): string | undefined {
    return this.allianzpartnerName;
  }

  @Expose()
  @ApiPropertyOptional({ description: 'Syndication partner URL, if any' })
  get partnerUrl(): string | undefined {
    return this.allianzpartnerUrl;
  }

  @Expose()
  @ApiProperty({ type: JobLocationDto })
  get location(): JobLocationDto {
    const adresse = this.stellenlokationen?.[0]?.adresse;
    return {
      street:
        [adresse?.strasse, adresse?.hausnummer].filter(Boolean).join(' ') ||
        undefined,
      postalCode: adresse?.plz,
      city: adresse?.ort,
      region: adresse?.region,
      country: adresse?.land,
    };
  }

  @Expose()
  @ApiPropertyOptional({ description: 'ISO date string' })
  get startDate(): string | undefined {
    return this.eintrittszeitraum?.von;
  }

  @Expose()
  @ApiPropertyOptional({ description: 'ISO date string' })
  get publishedAt(): string | undefined {
    return (
      this.veroeffentlichungszeitraum?.von ?? this.datumErsteVeroeffentlichung
    );
  }

  @Expose()
  @ApiPropertyOptional({ description: 'ISO date string, last modified' })
  get updatedAt(): string | undefined {
    return this.aenderungsdatum;
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
  @ApiProperty({ type: JobWorkingTimeDto })
  get workingTime(): JobWorkingTimeDto {
    return {
      fullTime: !!this.arbeitszeitVollzeit,
      partTime: !!(
        this.arbeitszeitTeilzeitVormittag ||
        this.arbeitszeitTeilzeitNachmittag ||
        this.arbeitszeitTeilzeitAbend ||
        this.arbeitszeitTeilzeitFlexibel
      ),
      shiftWork: !!this.arbeitszeitSchichtNachtWochenende,
      homeOffice: !!this.homeofficemoeglich,
    };
  }

  @Expose()
  @ApiPropertyOptional()
  get homeOfficeType(): string | undefined {
    return this.homeofficetyp;
  }

  @Expose()
  @ApiPropertyOptional({ description: 'Marginal employment ("Minijob")' })
  get miniJob(): boolean {
    return !!this.istGeringfuegigeBeschaeftigung;
  }

  @Expose()
  @ApiPropertyOptional({
    description: 'Position targets people with disabilities',
  })
  get disabilityFriendly(): boolean {
    return !!this.istBehinderungGefordert;
  }

  @Expose()
  @ApiPropertyOptional({
    description: 'Posted via a private job placement agency',
  })
  get privateJobPlacement(): boolean {
    return !!this.istPrivateArbeitsvermittlung;
  }

  @Expose()
  @ApiPropertyOptional({
    description: 'Temporary staffing ("Arbeitnehmerüberlassung")',
  })
  get temporaryStaffing(): boolean {
    return !!this.istArbeitnehmerUeberlassung;
  }

  @Expose()
  @ApiPropertyOptional({ description: 'Listing is agency-supervised' })
  get supervised(): boolean {
    return !!this.istBetreut;
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
  @ApiPropertyOptional()
  get requiredEducation(): string | undefined {
    return this.geforderterBildungsabschluss;
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
