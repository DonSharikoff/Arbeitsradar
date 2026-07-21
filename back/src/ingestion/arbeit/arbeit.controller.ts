import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { ArbeitService } from './arbeit.service';

@ApiTags('Arbeit')
@Controller('arbeit')
export class ArbeitController {
  constructor(private readonly arbeitService: ArbeitService) {}

  @Get('')
  public index(): Observable<any> {
    return this.arbeitService.index();
  }
}
