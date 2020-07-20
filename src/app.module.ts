import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { SubjectsController } from "./subjects/subjects.controller";

@Module({
  imports: [],
  controllers: [SubjectsController],
  providers: [PrismaService],
})
export class AppModule {}
