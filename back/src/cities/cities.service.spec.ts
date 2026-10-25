import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { firstValueFrom } from 'rxjs';
import { CitiesService } from './cities.service';
import { City } from './schemas/city.schema';

const CITIES: City[] = [
  {
    name: 'Berlin',
    state: 'Berlin',
    population: 3426354,
    postalCodes: ['10115'],
    lat: 52.52,
    lon: 13.41,
  },
  {
    name: 'München',
    state: 'Bayern',
    population: 1505005,
    postalCodes: ['80331'],
    lat: 48.14,
    lon: 11.58,
  },
  {
    name: 'Münster',
    state: 'Nordrhein-Westfalen',
    population: 315293,
    postalCodes: ['48143'],
    lat: 51.96,
    lon: 7.63,
  },
];

describe('CitiesService', () => {
  let service: CitiesService;

  beforeEach(async () => {
    const cityModel = {
      find: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(CITIES),
          }),
        }),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CitiesService,
        { provide: getModelToken(City.name), useValue: cityModel },
      ],
    }).compile();

    service = module.get(CitiesService);
  });

  it('returns every city when no query is given', async () => {
    const result = await firstValueFrom(service.search());

    expect(result).toEqual(CITIES);
  });

  it('matches case- and accent-insensitively', async () => {
    const result = await firstValueFrom(service.search('munch'));

    expect(result.map((city) => city.name)).toEqual(['München']);
  });

  it('does not let "münster" match "münchen"', async () => {
    const result = await firstValueFrom(service.search('munst'));

    expect(result.map((city) => city.name)).toEqual(['Münster']);
  });

  it('returns nothing for a name that does not exist', async () => {
    const result = await firstValueFrom(service.search('Nonexistentstadt'));

    expect(result).toEqual([]);
  });
});
