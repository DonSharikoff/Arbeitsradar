import { instanceToPlain, plainToInstance } from 'class-transformer';
import { VacancyRespDto } from './vacancy-resp.dto';

function serialize(raw: unknown): Record<string, unknown> {
  const instance = plainToInstance(VacancyRespDto, raw, {
    excludeExtraneousValues: true,
  });
  return instanceToPlain(instance) as Record<string, unknown>;
}

describe('VacancyRespDto', () => {
  it('maps a full raw upstream job-detail payload to the public English shape', () => {
    const plain = serialize({
      referenznummer: 'REF-1',
      stellenangebotsart: 'ARBEIT',
      stellenangebotsTitel: 'Koch',
      stellenangebotsBeschreibung: 'Description text',
      hauptberuf: 'Koch/Köchin',
      firma: 'Test GmbH',
      stellenlokationen: [
        {
          adresse: {
            strasse: 'Hauptstr.',
            hausnummer: '1',
            plz: '10115',
            ort: 'Berlin',
            region: 'BERLIN',
            land: 'DEUTSCHLAND',
          },
        },
      ],
      eintrittszeitraum: { von: '2026-01-01' },
      veroeffentlichungszeitraum: { von: '2025-12-01' },
      arbeitszeitVollzeit: true,
      arbeitszeitTeilzeitVormittag: false,
      homeofficemoeglich: true,
    });

    expect(plain).toEqual(
      expect.objectContaining({
        externalRef: 'REF-1',
        title: 'Koch',
        employer: 'Test GmbH',
        mainProfession: 'Koch/Köchin',
        description: 'Description text',
        location: {
          street: 'Hauptstr. 1',
          postalCode: '10115',
          city: 'Berlin',
          region: 'BERLIN',
          country: 'DEUTSCHLAND',
        },
        publishedAt: '2025-12-01',
        startDate: '2026-01-01',
        employmentType: 'ARBEIT',
        workingTime: {
          fullTime: true,
          partTime: false,
          shiftWork: false,
          homeOffice: true,
        },
      }),
    );
  });

  it('never leaks raw German field names into the serialized output', () => {
    const plain = serialize({
      referenznummer: 'REF-1',
      stellenangebotsart: 'ARBEIT',
      stellenangebotsTitel: 'Koch',
      hauptberuf: 'Koch/Köchin',
      firma: 'Test GmbH',
      stellenlokationen: [],
    });

    expect(Object.keys(plain)).not.toContain('referenznummer');
    expect(Object.keys(plain)).not.toContain('stellenangebotsTitel');
    expect(Object.keys(plain)).not.toContain('stellenlokationen');
  });

  it('treats any afternoon/evening/flexible slot as part-time', () => {
    const plain = serialize({
      referenznummer: 'REF-1',
      stellenangebotsart: 'ARBEIT',
      stellenangebotsTitel: 'Koch',
      hauptberuf: 'Koch/Köchin',
      firma: 'Test GmbH',
      stellenlokationen: [],
      arbeitszeitVollzeit: false,
      arbeitszeitTeilzeitAbend: true,
    });

    const workingTime = plain.workingTime as Record<string, unknown>;
    expect(workingTime.partTime).toBe(true);
    expect(workingTime.fullTime).toBe(false);
  });

  it('builds the street from strasse+hausnummer and leaves it undefined when both are missing', () => {
    const withStreet = serialize({
      referenznummer: 'REF-1',
      stellenangebotsart: 'ARBEIT',
      stellenangebotsTitel: 'Koch',
      hauptberuf: 'Koch/Köchin',
      firma: 'Test GmbH',
      stellenlokationen: [{ adresse: { strasse: 'Hauptstr.', ort: 'Berlin' } }],
    });
    expect((withStreet.location as Record<string, unknown>).street).toBe(
      'Hauptstr.',
    );

    const withoutStreet = serialize({
      referenznummer: 'REF-1',
      stellenangebotsart: 'ARBEIT',
      stellenangebotsTitel: 'Koch',
      hauptberuf: 'Koch/Köchin',
      firma: 'Test GmbH',
      stellenlokationen: [{ adresse: { ort: 'Berlin' } }],
    });
    expect(
      (withoutStreet.location as Record<string, unknown>).street,
    ).toBeUndefined();
  });
});
