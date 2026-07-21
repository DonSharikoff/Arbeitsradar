import { Module } from '@nestjs/common';
import { ArbeitService } from './arbeit.service';
import { ArbeitController } from './arbeit.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [ArbeitController],
  providers: [ArbeitService],
  exports: [],
})
export class ArbeitModule {}
