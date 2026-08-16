import {
  HttpException,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { isAxiosError } from 'axios';

const logger = new Logger('VacanciesClientService');

// Upstream HTTP status -> safe, generic exception for the client.
// Never forward the raw upstream error (body, headers, stack) to the
// caller - it may contain the outgoing X-API-Key or internal URLs.
const UPSTREAM_ERROR_MAP: Record<number, (context: string) => HttpException> = {
  404: (context) => new NotFoundException(`${context} not found`),
};

export function mapJobsucheError(
  error: unknown,
  context: string,
): HttpException {
  const status = isAxiosError(error) ? error.response?.status : undefined;

  logger.error(
    `Jobsuche API error while fetching ${context}: ${status ?? 'network error'}`,
    error instanceof Error ? error.stack : undefined,
  );

  const factory = status ? UPSTREAM_ERROR_MAP[status] : undefined;
  return factory
    ? factory(context)
    : new ServiceUnavailableException(
        'Vacancy service is temporarily unavailable',
      );
}
