import { Test, TestingModule } from '@nestjs/testing';
import { TimetableItemsController } from './timetable-items.controller';

describe('TimetableItems Controller', () => {
  let controller: TimetableItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimetableItemsController],
    }).compile();

    controller = module.get<TimetableItemsController>(TimetableItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
