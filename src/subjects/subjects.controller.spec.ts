import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../prisma/prisma.service";
import { SubjectsController } from "./subjects.controller";

describe("Subjects Controller", () => {
  let controller: SubjectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubjectsController],
      providers: [PrismaService],
    }).compile();

    controller = module.get<SubjectsController>(SubjectsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
