import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../prisma/prisma.service";
import { MessagesController } from "./messages.controller";

describe("MessagesController", () => {
  let controller: MessagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagesController],
      providers: [PrismaService],
    }).compile();

    controller = module.get<MessagesController>(MessagesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
