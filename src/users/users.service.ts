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
}
