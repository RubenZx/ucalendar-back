import { Test, TestingModule } from '@nestjs/testing';
import { TimetableItemsService } from './timetable-items.service';

describe('TimetableItemsService', () => {
  let service: TimetableItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimetableItemsService],
    }).compile();

    service = module.get<TimetableItemsService>(TimetableItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
