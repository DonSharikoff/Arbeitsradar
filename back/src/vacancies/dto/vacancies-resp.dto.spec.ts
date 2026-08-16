import { instanceToPlain, plainToInstance } from 'class-transformer';
import { VacanciesListDto } from './vacancies-resp.dto';

function serialize(raw: unknown): Record<string, unknown> {
  const instance = plainToInstance(VacanciesListDto, raw, {
    excludeExtraneousValues: true,
  });
  return instanceToPlain(instance) as Record<string, unknown>;
}

describe('VacanciesListDto', () => {
  it('maps a full raw upstream item to the public English shape', () => {
    const plain = serialize({
      ergebnisliste: [
        {
          referenznummer: 'REF-1',
          stellenangebotsart: 'ARBEIT',
          stellenangebotsTitel: 'Koch',
          hauptberuf: 'Koch/Köchin',
          alleBerufe: ['Koch/Köchin'],
          weitereBerufe: ['Beikoch/-köchin'],
          firma: 'Test GmbH',
          arbeitgeberKundennummerHash: 'hash-1',
          stellenlokationen: [{ adresse: { ort: 'Berlin' } }],
          entfernung: 5,
          eintrittszeitraum: { von: '2026-01-01' },
          veroeffentlichungszeitraum: { von: '2025-12-01' },
          verguetungsangabe: 'JAHRESGEHALT',
          vertragsdauer: 'UNBEFRISTET',
          arbeitszeitVollzeit: true,
          homeofficemoeglich: true,
          quereinstiegGeeignet: true,
        },
      ],
      maxErgebnisse: 1,
      page: 1,
      size: 25,
    });

    expect(plain.items).toEqual([
      expect.objectContaining({
        externalRef: 'REF-1',
        title: 'Koch',
        employer: 'Test GmbH',
        mainProfession: 'Koch/Köchin',
        location: 'Berlin',
        allProfessions: ['Koch/Köchin'],
        furtherProfessions: ['Beikoch/-köchin'],
        employerHash: 'hash-1',
        distanceKm: 5,
        startDate: '2026-01-01',
        publishedAt: '2025-12-01',
        homeOffice: true,
        fullTime: true,
        contractDuration: 'UNBEFRISTET',
        employmentType: 'ARBEIT',
        careerChangerSuitable: true,
        compensationDisclosure: 'JAHRESGEHALT',
      }),
    ]);
    expect(plain.total).toBe(1);
  });

  it('never leaks raw German field names into the serialized output', () => {
    const plain = serialize({
      ergebnisliste: [
        {
          referenznummer: 'REF-1',
          stellenangebotsTitel: 'Koch',
          hauptberuf: 'Koch/Köchin',
          firma: 'Test GmbH',
          stellenlokationen: [{ adresse: { ort: 'Berlin' } }],
        },
      ],
      maxErgebnisse: 1,
      page: 1,
      size: 25,
      facetten: { verguetung: { counts: {}, maxCount: 0 } },
    });

    const item = (plain.items as Record<string, unknown>[])[0];
    expect(Object.keys(item)).not.toContain('referenznummer');
    expect(Object.keys(item)).not.toContain('stellenangebotsTitel');
    expect(plain).not.toHaveProperty('facetten');
    expect(plain).not.toHaveProperty('ergebnisliste');
  });

  it('treats any afternoon/evening/flexible slot as part-time', () => {
    const plain = serialize({
      ergebnisliste: [
        {
          referenznummer: 'REF-1',
          stellenangebotsTitel: 'Koch',
          hauptberuf: 'Koch/Köchin',
          firma: 'Test GmbH',
          stellenlokationen: [],
          arbeitszeitVollzeit: false,
          arbeitszeitTeilzeitAbend: true,
        },
      ],
      maxErgebnisse: 1,
      page: 1,
      size: 25,
    });

    const item = (plain.items as Record<string, unknown>[])[0];
    expect(item.partTime).toBe(true);
    expect(item.fullTime).toBe(false);
  });

  it('falls back to the first-published date when the period start is missing', () => {
    const plain = serialize({
      ergebnisliste: [
        {
          referenznummer: 'REF-1',
          stellenangebotsTitel: 'Koch',
          hauptberuf: 'Koch/Köchin',
          firma: 'Test GmbH',
          stellenlokationen: [],
          datumErsteVeroeffentlichung: '2025-11-01',
        },
      ],
      maxErgebnisse: 1,
      page: 1,
      size: 25,
    });

    const item = (plain.items as Record<string, unknown>[])[0];
    expect(item.publishedAt).toBe('2025-11-01');
  });
});
