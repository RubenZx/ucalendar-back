import { Injectable } from "@nestjs/common";
import { Subject, TimeTableTimeTableItem, User } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

export type UserRelations = User & {
  subjects: { subject: Subject }[];
  timeTable: { timeTableItems: TimeTableTimeTableItem[] }[];
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(userId: string): Promise<UserRelations> {
    console.log(userId);
    return this.prisma.user.findOne({
      where: { uid: userId },
      include: {
        subjects: { select: { subject: true } },
        timeTable: { select: { timeTableItems: true } },
      },
    });
  }
}
