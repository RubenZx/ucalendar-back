import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { ClassRoomsController } from "./class-rooms/class-rooms.controller";
import { DegreesController } from "./degrees/degrees.controller";
import { GroupsController } from "./groups/groups.controller";
import { PrismaService } from "./prisma/prisma.service";
import { SubjectsController } from "./subjects/subjects.controller";
import { TimetableItemsController } from "./timetable-items/timetable-items.controller";
import { UsersController } from "./users/users.controller";
import { UsersModule } from "./users/users.module";
import { TimetableItemsService } from './timetable-items/timetable-items.service';
import { MessagesController } from './messages/messages.controller';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [
    SubjectsController,
    TimetableItemsController,
    AppController,
    DegreesController,
    GroupsController,
    ClassRoomsController,
    UsersController,
    MessagesController,
  ],
  providers: [PrismaService, TimetableItemsService],
})
export class AppModule {}
