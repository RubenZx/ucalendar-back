import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../prisma/prisma.service";
import { DegreesController } from "./degrees.controller";

describe("Degrees Controller", () => {
  let degreesController: DegreesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DegreesController],
      providers: [PrismaService],
    }).compile();

    degreesController = module.get<DegreesController>(DegreesController);
  });

  it("should be defined", () => {
    expect(degreesController).toBeDefined();
  });
});
