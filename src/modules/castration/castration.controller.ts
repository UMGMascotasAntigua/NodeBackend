import { Controller } from '@nestjs/common';
import { CastrationService } from './castration.service';

@Controller('castration')
export class CastrationController {
  constructor(private readonly castrationService: CastrationService) {}
}
