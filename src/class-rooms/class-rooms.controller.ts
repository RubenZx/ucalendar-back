import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Controller("class-rooms")
export class ClassRoomsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.classRoom.findMany();
  }
}
