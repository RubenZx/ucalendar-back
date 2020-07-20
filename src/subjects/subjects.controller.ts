import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { isNull } from "util";
import { UpdateSubjectDto } from "./updateSubject.dto";

@Controller("subjects")
export class SubjectsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async FindAll() {
    return this.prisma.subject.findMany();
  }

  @Get(":id")
  async findOne(@Param("id") id: number) {
    const subject = await this.prisma.subject.findOne({ where: { id } });
    if (isNull(subject)) throw new NotFoundException();
    return subject;
  }

  @Put(":id")
  async update(
    @Param("id") id: number,
    @Body() updateSubject: UpdateSubjectDto
  ) {
    const subject = await this.prisma.subject.findOne({ where: { id } });

    if (!updateSubject.endHour) {
      updateSubject.endHour = subject.endHour;
    }

    if (!updateSubject.startHour) {
      updateSubject.startHour = subject.startHour;
    }

    if (updateSubject.endHour < updateSubject.startHour)
      throw new BadRequestException();

    this.prisma.subject.update({ where: { id }, data: updateSubject });
  }
}
