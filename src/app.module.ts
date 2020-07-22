import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { SubjectsController } from "./subjects/subjects.controller";
import { TimetableItemsController } from './timetable-items/timetable-items.controller';

@Module({
  imports: [],
  controllers: [SubjectsController, TimetableItemsController],
  providers: [PrismaService],
})
export class AppModule {}
