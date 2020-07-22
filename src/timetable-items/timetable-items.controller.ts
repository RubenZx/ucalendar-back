import { Controller, Get, NotFoundException, Param, Put } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { isNull } from "util";

@Controller("timetable-items")
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
  async update(@Param("id") id: number) {}
}
