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
import { UpdateTimeTableItemDto } from "./updateTimeTableItem.dto";

@Controller("timetable-items")
// @UseGuards(JwtAuthGuard, RolesGuard)
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
    });
    if (isNull(timeTableItem)) throw new NotFoundException();
    return timeTableItem;
  }

  @Put(":id")
  async update(
    @Param("id") id: number,
    @Body() { classRoomId, groupId, ...newItem }: UpdateTimeTableItemDto
  ) {
    if (newItem.endHour < newItem.startHour) throw new BadRequestException();
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
        newItem.startHour > item.endHour || newItem.endHour < item.startHour
    );

    if (result.some((value) => value === false))
      throw new BadRequestException(undefined, "Intervalo de horas erróneo");

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
}
