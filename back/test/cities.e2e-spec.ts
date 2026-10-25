import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { City, CityDocument } from '../src/cities/schemas/city.schema';

const TEST_CITIES = [
  {
    name: 'E2E-Testhausen',
    state: 'Berlin',
    population: 123456,
    postalCodes: ['10115'],
    lat: 52.52,
    lon: 13.41,
  },
  {
    name: 'E2E-Testwald',
    state: 'Bayern',
    population: 65000,
    postalCodes: ['80331'],
    lat: 48.14,
    lon: 11.58,
  },
];

describe('Cities (e2e)', () => {
  let app: INestApplication;
  let cityModel: Model<CityDocument>;

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

    cityModel = app.get<Model<CityDocument>>(getModelToken(City.name));
    await cityModel.insertMany(TEST_CITIES);
  });

  afterAll(async () => {
    await cityModel.deleteMany({
      name: { $in: TEST_CITIES.map((city) => city.name) },
    });
    await app.close();
  });

  describe('GET /api/cities', () => {
    it('finds a seeded city by a partial, accent-insensitive query', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/cities')
        .query({ query: 'testhausen' })
        .expect(200);

      expect(response.body).toEqual([
        expect.objectContaining({ name: 'E2E-Testhausen', state: 'Berlin' }),
      ]);
    });

    it('returns results ordered by population, most populous first', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/cities')
        .query({ query: 'E2E-Test' })
        .expect(200);

      const body = response.body as { name: string }[];

      expect(body.map((city) => city.name)).toEqual([
        'E2E-Testhausen',
        'E2E-Testwald',
      ]);
    });

    it('rejects a query over the length limit', async () => {
      await request(app.getHttpServer())
        .get('/api/cities')
        .query({ query: 'a'.repeat(101) })
        .expect(400);
    });
  });
});
