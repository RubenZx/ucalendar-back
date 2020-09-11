import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { PrismaService } from "src/prisma/prisma.service";
import { RolesGuard } from "src/roles/roles.guard";
import { isNull } from "util";
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

    const itemUpdated = await this.prisma.timeTableItem.update({
      where: { id },
      data: {
        ...newItem,
        classRoom: { connect: { id: classRoomId } },
        group: { connect: { id: groupId } },
      },
    });

    return itemUpdated;
  }
}
