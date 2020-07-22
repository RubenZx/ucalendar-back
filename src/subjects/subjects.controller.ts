import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
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
    const subject = await this.prisma.subject.findOne({ where: { id } });
    if (isNull(subject)) throw new NotFoundException();
    return subject;
  }

  @Post(":id/timetable-items")
  async create(
    @Param("id") id: number,
    @Body() { groupId, ...newItem }: CreateTimeTableItemDto
  ) {
    if (newItem.endHour < newItem.startHour) throw new BadRequestException();

    const timeTableItems = await this.prisma.timeTableItem.findMany({
      where: {
        classRoom: newItem.classRoom,
        dayOfTheWeek: newItem.dayOfTheWeek,
      },
      select: {
        startHour: true,
        endHour: true,
      },
    });

    const result = timeTableItems.some(
      (item) =>
        newItem.endHour < item.endHour && newItem.endHour > item.startHour
    );

    if (result)
      throw new BadRequestException(undefined, "invalid hours interval");

    try {
      const itemCreated = await this.prisma.timeTableItem.create({
        data: {
          ...newItem,
          subject: { connect: { id } },
          group: { connect: { id: groupId } },
        },
      });
      return itemCreated;
    } catch (error) {
      throw new BadRequestException(undefined, "invalid timeTable item");
    }
  }
}
