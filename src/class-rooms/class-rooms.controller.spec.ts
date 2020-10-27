import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../prisma/prisma.service";
import { ClassRoomsController } from "./class-rooms.controller";

describe("ClassRooms Controller", () => {
  let controller: ClassRoomsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassRoomsController],
      providers: [PrismaService],
    }).compile();

    controller = module.get<ClassRoomsController>(ClassRoomsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
