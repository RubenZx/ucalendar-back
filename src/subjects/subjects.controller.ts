import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PrismaService } from "../prisma/prisma.service";
import { Roles } from "../roles/roles.decoratos";
import { RolesGuard } from "../roles/roles.guard";
import { CreateTimeTableItemDto } from "../timetable-items/createTimeTableItem.dto";

@Controller("subjects")
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubjectsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.subject.findMany();
  }

  @Get(":id")
  async findOne(@Param("id") id: number) {
    const subject = await this.prisma.subject.findOne({
      where: { id },
      include: { degrees: { include: { degree: true } } },
    });
    if (!subject) throw new NotFoundException();
    return subject;
  }

  @Get(":id/timetable-items")
  async getItems(@Param("id") id: number) {
    const items = await this.prisma.timeTableItem.findMany({
      where: { subjectId: id },
      include: { classRoom: true, group: true, subject: true },
    });
    if (items.length < 1) throw new NotFoundException();
    return items;
  }

  @Roles("ADMINISTRATOR")
  @Post(":id/timetable-items")
  async create(
    @Param("id") id: number,
    @Body() { groupId, classRoomId, ...newItem }: CreateTimeTableItemDto
  ) {
    if (newItem.endHour < newItem.startHour)
      throw new BadRequestException(
        undefined,
        "La hora de fin ha de ser mayor a la de inicio"
      );

    const subject = await this.prisma.subject.findOne({ where: { id } });
    if (subject.semester !== newItem.semester)
      throw new BadRequestException(
        undefined,
        "El semestre del item debe coincidir con el de la asignatura"
      );

    const timeTableItems = await this.prisma.timeTableItem.findMany({
      where: {
        // take timetable-items with the same semester, class-room and day of the week
        semester: newItem.semester,
        classRoom: { id: classRoomId },
        dayOfTheWeek: newItem.dayOfTheWeek,
      },
      select: {
        startHour: true,
        endHour: true,
      },
    });

    const result = timeTableItems.map(
      (item) =>
        newItem.startHour > item.endHour || newItem.endHour < item.startHour
    );

    if (result.some((value) => value === false))
      throw new BadRequestException(
        undefined,
        "Item inválido, horas, aula y día incompatibles"
      );

    try {
      const itemCreated = await this.prisma.timeTableItem.create({
        data: {
          ...newItem,
          subject: { connect: { id } },
          group: { connect: { id: groupId } },
          classRoom: { connect: { id: classRoomId } },
        },
      });
      return itemCreated;
    } catch (error) {
      throw new BadRequestException(undefined, "Error al crear el item");
    }
  }
}
