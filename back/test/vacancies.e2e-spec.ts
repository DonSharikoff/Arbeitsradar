import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import nock from 'nock';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { VacancyRespDto } from '../src/vacancies/dto/vacancy-resp.dto';

const UPSTREAM = 'https://rest.arbeitsagentur.de';

describe('Vacancies (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => nock.cleanAll());

  describe('GET /api/vacancies', () => {
    it('translates the public query params to the German upstream names', async () => {
      nock(UPSTREAM)
        .get('/jobboerse/jobsuche-service/pc/v6/jobs')
        .query({
          was: 'e2e-unique-term',
          wo: 'Berlin',
          umkreis: '10',
          page: '1',
          size: '25',
        })
        .reply(200, { ergebnisliste: [], maxErgebnisse: 0, page: 1, size: 25 });

      await request(app.getHttpServer())
        .get('/api/vacancies')
        .query({ query: 'e2e-unique-term', location: 'Berlin', radius: 10 })
        .expect(200);
    });

    it('maps upstream search results to the public English shape', async () => {
      nock(UPSTREAM)
        .get('/jobboerse/jobsuche-service/pc/v6/jobs')
        .query(true)
        .reply(200, {
          ergebnisliste: [
            {
              referenznummer: 'E2E-SEARCH-1',
              stellenangebotsTitel: 'Testjob',
              hauptberuf: 'Koch/Köchin',
              firma: 'Test GmbH',
              stellenlokationen: [{ adresse: { ort: 'Berlin' } }],
              veroeffentlichungszeitraum: { von: '2026-01-01' },
            },
          ],
          maxErgebnisse: 1,
          page: 1,
          size: 25,
        });

      const response = await request(app.getHttpServer())
        .get('/api/vacancies')
        .query({ query: 'e2e-unique-term' })
        .expect(200);

      expect(response.body).toEqual({
        items: [
          expect.objectContaining({
            externalRef: 'E2E-SEARCH-1',
            title: 'Testjob',
            employer: 'Test GmbH',
            location: 'Berlin',
            publishedAt: '2026-01-01',
          }),
        ],
        total: 1,
        page: 1,
        size: 25,
      });
    });

    it('rejects an out-of-range size', async () => {
      await request(app.getHttpServer())
        .get('/api/vacancies')
        .query({ size: 500 })
        .expect(400);
    });

    it('maps an upstream failure to a 503 without leaking upstream details', async () => {
      nock(UPSTREAM)
        .get('/jobboerse/jobsuche-service/pc/v6/jobs')
        .query(true)
        .reply(500, { internal: 'upstream stack trace or secret' });

      const response = await request(app.getHttpServer())
        .get('/api/vacancies')
        .query({ query: 'e2e-upstream-failure' })
        .expect(503);

      expect(JSON.stringify(response.body)).not.toContain('upstream stack');
    });
  });

  describe('GET /api/vacancies/:id', () => {
    it('maps an upstream job detail to the public English shape', async () => {
      nock(UPSTREAM)
        .get(/\/jobboerse\/jobsuche-service\/pc\/v4\/jobdetails\/.+/)
        .reply(200, {
          referenznummer: 'E2E-DETAIL-1',
          stellenangebotsart: 'ARBEIT',
          stellenangebotsTitel: 'Testjob Detail',
          hauptberuf: 'Koch/Köchin',
          firma: 'Detail GmbH',
          stellenlokationen: [{ adresse: { ort: 'Hamburg', plz: '20095' } }],
        });

      const response = await request(app.getHttpServer())
        .get('/api/vacancies/E2E-DETAIL-1')
        .expect(200);
      const body = response.body as VacancyRespDto;

      expect(body.externalRef).toBe('E2E-DETAIL-1');
      expect(body.title).toBe('Testjob Detail');
      expect(body.employer).toBe('Detail GmbH');
      expect(body.location.city).toBe('Hamburg');
    });

    it('rejects a malformed id', async () => {
      await request(app.getHttpServer())
        .get('/api/vacancies/%20%20')
        .expect(400);
    });

    it('maps an upstream 404 to Not Found without leaking the upstream body', async () => {
      nock(UPSTREAM)
        .get(/\/jobboerse\/jobsuche-service\/pc\/v4\/jobdetails\/.+/)
        .reply(404, { messages: [{ code: 'STELLENANGEBOT_NICHT_GEFUNDEN' }] });

      const response = await request(app.getHttpServer())
        .get('/api/vacancies/E2E-NOT-FOUND')
        .expect(404);

      expect(JSON.stringify(response.body)).not.toContain(
        'STELLENANGEBOT_NICHT_GEFUNDEN',
      );
    });
  });
});
