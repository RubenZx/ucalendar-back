import { Controller, Get, Param } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Controller("degrees")
export class DegreesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.degree.findMany();
  }

  @Get(":id/subjects")
  async getSubjects(@Param("id") id: number) {
    return await this.prisma.subject.findMany({
      where: { degrees: { some: { degreeId: id } } },
    });
  }
}
