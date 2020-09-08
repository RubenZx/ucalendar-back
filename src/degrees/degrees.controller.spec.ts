import { Test, TestingModule } from '@nestjs/testing';
import { DegreesController } from './degrees.controller';

describe('Degrees Controller', () => {
  let controller: DegreesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DegreesController],
    }).compile();

    controller = module.get<DegreesController>(DegreesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
