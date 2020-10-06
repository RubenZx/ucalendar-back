import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Controller("degrees")
export class DegreesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.degree.findMany();
  }

  @Get(":id/subjects/:semester")
  async getSubjects(
    @Param("id") id: number,
    @Param("semester") semester: boolean
  ) {
    const subjects = await this.prisma.subject.findMany({
      where: {
        degrees: { every: { degreeId: id } },
        semester: { equals: semester },
      },
    });
    if (!subjects) throw new NotFoundException();
    return subjects;
  }
}
