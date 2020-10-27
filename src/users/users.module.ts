import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { TimetableItemsService } from "../timetable-items/timetable-items.service";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  providers: [UsersService, PrismaService, TimetableItemsService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
