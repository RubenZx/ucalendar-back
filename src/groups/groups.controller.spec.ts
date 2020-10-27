import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../prisma/prisma.service";
import { GroupsController } from "./groups.controller";

describe("Groups Controller", () => {
  let controller: GroupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupsController],
      providers: [PrismaService],
    }).compile();

    controller = module.get<GroupsController>(GroupsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
