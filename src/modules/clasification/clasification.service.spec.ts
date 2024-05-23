import { Test, TestingModule } from '@nestjs/testing';
import { ClasificationService } from './clasification.service';

describe('ClasificationService', () => {
  let service: ClasificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClasificationService],
    }).compile();

    service = module.get<ClasificationService>(ClasificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
