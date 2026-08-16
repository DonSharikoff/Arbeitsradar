import { NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { AxiosError, AxiosHeaders } from 'axios';
import { mapJobsucheError } from './vacancies-error.mapper';

function axiosErrorWithStatus(status: number): AxiosError {
  return new AxiosError(
    'Request failed',
    'ERR_BAD_REQUEST',
    { headers: new AxiosHeaders({ 'X-API-Key': 'super-secret-key' }) },
    undefined,
    {
      status,
      statusText: 'Error',
      headers: {},
      config: { headers: new AxiosHeaders() },
      data: { messages: [{ code: 'STELLENANGEBOT_NICHT_GEFUNDEN' }] },
    },
  );
}

describe('mapJobsucheError', () => {
  it('maps an upstream 404 to NotFoundException with a safe message', () => {
    const result = mapJobsucheError(axiosErrorWithStatus(404), 'Vacancy');

    expect(result).toBeInstanceOf(NotFoundException);
    expect(result.getResponse()).toEqual(
      expect.objectContaining({ message: 'Vacancy not found' }),
    );
  });

  it('maps an unmapped upstream status to ServiceUnavailableException', () => {
    const result = mapJobsucheError(axiosErrorWithStatus(500), 'Vacancy');

    expect(result).toBeInstanceOf(ServiceUnavailableException);
  });

  it('maps a network error with no response to ServiceUnavailableException', () => {
    const networkError = new AxiosError('Network Error', 'ECONNREFUSED');

    const result = mapJobsucheError(networkError, 'Vacancy');

    expect(result).toBeInstanceOf(ServiceUnavailableException);
  });

  it('never leaks the upstream request/response body into the client-facing message', () => {
    const result = mapJobsucheError(axiosErrorWithStatus(404), 'Vacancy');
    const serialized = JSON.stringify(result.getResponse());

    expect(serialized).not.toContain('super-secret-key');
    expect(serialized).not.toContain('STELLENANGEBOT_NICHT_GEFUNDEN');
  });
});
