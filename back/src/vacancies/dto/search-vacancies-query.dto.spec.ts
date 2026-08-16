import { SearchVacanciesQueryDto } from './search-vacancies-query.dto';

describe('SearchVacanciesQueryDto.toJobsucheParams', () => {
  it('translates every public field to its German upstream name', () => {
    const dto = new SearchVacanciesQueryDto();
    dto.query = 'Elektriker';
    dto.location = 'Berlin';
    dto.radius = 50;
    dto.page = 2;
    dto.size = 10;
    dto.postedIn = 7;
    dto.employer = 'Acme GmbH';
    dto.temporary = true;

    expect(dto.toJobsucheParams()).toEqual({
      was: 'Elektriker',
      wo: 'Berlin',
      umkreis: 50,
      page: 2,
      size: 10,
      veroeffentlichtseit: 7,
      arbeitgeber: 'Acme GmbH',
      zeitarbeit: true,
    });
  });

  it('carries page/size through unchanged and leaves optional fields undefined', () => {
    const dto = new SearchVacanciesQueryDto();

    const result = dto.toJobsucheParams();

    expect(result.page).toBe(1);
    expect(result.size).toBe(25);
    expect(result.was).toBeUndefined();
    expect(result.wo).toBeUndefined();
    expect(result.umkreis).toBeUndefined();
  });
});
