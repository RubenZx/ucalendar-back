import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(userId: string): Promise<User> {
    return this.prisma.user.findOne({
      where: { uid: userId },
    });
  }

  async findOneWithData(userId: string): Promise<any> {
    return this.prisma.user.findOne({
      where: { uid: userId },
      select: {
        name: true,
        lastName: true,
        role: true,
        subjects: { select: { subject: true } },
        timeTable: {
          select: {
            timeTable: { select: { semester: true, timeTableItems: true } },
          },
        },
      },
    });
  }
}
