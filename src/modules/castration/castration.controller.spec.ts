import { Test, TestingModule } from '@nestjs/testing';
import { CastrationController } from './castration.controller';
import { CastrationService } from './castration.service';

describe('CastrationController', () => {
  let controller: CastrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CastrationController],
      providers: [CastrationService],
    }).compile();

    controller = module.get<CastrationController>(CastrationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
