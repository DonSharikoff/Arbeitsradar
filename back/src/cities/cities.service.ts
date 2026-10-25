import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { from, map, Observable } from 'rxjs';
import { City, CityDocument } from './schemas/city.schema';

const AUTOCOMPLETE_LIMIT = 20;
const COMBINING_DIACRITICS = /[\u0300-\u036f]/g;

// Accent-insensitive compare so "munchen" matches "München". Done in
// application code rather than a Mongo collation/text index - the whole
// collection is ~200 rows, a full scan plus JS filter is simpler and cheap.
function normalize(value: string): string {
  return value
    .normalize('NFKD')
    .replace(COMBINING_DIACRITICS, '')
    .toLowerCase();
}

@Injectable()
export class CitiesService {
  public constructor(
    @InjectModel(City.name) private readonly cityModel: Model<CityDocument>,
  ) {}

  public search(query?: string): Observable<City[]> {
    return from(
      this.cityModel.find().sort({ population: -1 }).lean().exec(),
    ).pipe(
      map((cities) => {
        if (!query) return cities;

        const needle = normalize(query);
        return cities
          .filter((city) => normalize(city.name).includes(needle))
          .slice(0, AUTOCOMPLETE_LIMIT);
      }),
    );
  }
}
