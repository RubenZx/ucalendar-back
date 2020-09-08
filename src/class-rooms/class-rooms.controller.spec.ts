import { Test, TestingModule } from '@nestjs/testing';
import { ClassRoomsController } from './class-rooms.controller';

describe('ClassRooms Controller', () => {
  let controller: ClassRoomsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassRoomsController],
    }).compile();

    controller = module.get<ClassRoomsController>(ClassRoomsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
