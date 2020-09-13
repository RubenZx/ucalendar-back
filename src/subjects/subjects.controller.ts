import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateTimeTableItemDto } from "src/timetable-items/createTimeTableItem.dto";
import { isNull } from "util";

@Controller("subjects")
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
    if (isNull(subject)) throw new NotFoundException();
    return subject;
  }

  @Get(":id/timetable-items")
  async getItems(@Param("id") id: number, @Query() query) {
    let items = [];
    if (query.semester !== undefined) {
      items = await this.prisma.timeTableItem.findMany({
        where: {
          subjectId: id,
          semester: { equals: query.semester === "true" },
        },
        include: { classRoom: true, group: true, subject: true },
      });
    } else {
      items = await this.prisma.timeTableItem.findMany({
        where: { subjectId: id },
        include: { classRoom: true, group: true, subject: true },
      });
    }
    if (items.length < 1) throw new NotFoundException();
    return items;
  }

  @Post(":id/timetable-items")
  async create(
    @Param("id") id: number,
    @Body() { groupId, classRoomId, ...newItem }: CreateTimeTableItemDto
  ) {
    if (newItem.endHour < newItem.startHour) throw new BadRequestException();
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
      throw new BadRequestException(undefined, "Intervalo de horas erróneo");

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
