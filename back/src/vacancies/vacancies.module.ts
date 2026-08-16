import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { VacanciesController } from './vacancies.controller';
import { VacanciesClientService } from './vacancies-client.service';

export const JOBSUCHE_BASE_URL: string = 'https://rest.arbeitsagentur.de';

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        baseURL: JOBSUCHE_BASE_URL,
        timeout: 5000,
        headers: { 'X-API-Key': configService.get<string>('JOBSUCHE_API_KEY') },
      }),
    }),
  ],
  controllers: [VacanciesController],
  providers: [VacanciesClientService],
})
export class VacanciesModule {}
