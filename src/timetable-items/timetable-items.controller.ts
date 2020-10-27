import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PrismaService } from "../prisma/prisma.service";
import { Roles } from "../roles/roles.decoratos";
import { RolesGuard } from "../roles/roles.guard";
import { UpdateTimeTableItemDto } from "./updateTimeTableItem.dto";

@Controller("timetable-items")
@UseGuards(JwtAuthGuard, RolesGuard)
export class TimetableItemsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.timeTableItem.findMany();
  }

  @Get(":id")
  async findOne(@Param("id") id: number) {
    const timeTableItem = await this.prisma.timeTableItem.findOne({
      where: { id },
      include: { subject: true, group: true, classRoom: true },
    });
    if (!timeTableItem) throw new NotFoundException();
    return timeTableItem;
  }

  @Roles("ADMINISTRATOR")
  @Put(":id")
  async update(
    @Param("id") id: number,
    @Body() { classRoomId, groupId, ...newItem }: UpdateTimeTableItemDto
  ) {
    if (newItem.endHour < newItem.startHour)
      throw new BadRequestException(
        undefined,
        "La hora de fin ha de ser mayor a la de inicio"
      );

    const subject = await this.prisma.timeTableItem.findOne({
      where: { id },
      include: { subject: { select: { semester: true } } },
    });
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
        id: { not: id },
      },
      select: {
        startHour: true,
        endHour: true,
      },
    });

    const result = timeTableItems.map(
      (item) =>
        newItem.startHour >= item.endHour || newItem.endHour <= item.startHour
    );

    if (result.some((value) => value === false))
      throw new BadRequestException(
        undefined,
        "Item inválido, horas, aula y día incompatibles"
      );

    try {
      const itemUpdated = await this.prisma.timeTableItem.update({
        where: { id },
        data: {
          ...newItem,
          classRoom: { connect: { id: classRoomId } },
          group: { connect: { id: groupId } },
        },
      });
      return itemUpdated;
    } catch (error) {
      throw new BadRequestException(undefined, "Error al actualizar el item");
    }
  }

  @Roles("ADMINISTRATOR")
  @Delete(":id")
  @HttpCode(204)
  async remove(@Param("id") id: number) {
    try {
      await this.prisma.userTimetableItems.deleteMany({
        where: { timeTableItemId: id },
      });
    } catch (e) {
      throw new ConflictException(undefined, "Error al eliminar el item " + id);
    }
    const res = await this.prisma.timeTableItem.delete({ where: { id } });
    return res;
  }
}
