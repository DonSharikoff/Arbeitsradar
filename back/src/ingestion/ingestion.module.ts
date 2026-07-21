import { Module } from '@nestjs/common';
import { ArbeitModule } from './arbeit/arbeit.module';

@Module({
  imports: [ArbeitModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class IngestionModule {}
