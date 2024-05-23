import { Controller, Get} from '@nestjs/common';
import { ClasificationService } from './clasification.service';

@Controller('clasification')
export class ClasificationController {
  constructor(private readonly clasificationService: ClasificationService) {}
  @Get()
  findAll() {
    return this.clasificationService.findAll();
  }
}
