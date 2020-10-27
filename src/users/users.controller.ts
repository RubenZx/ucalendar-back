import {
  BadRequestException,
  Bind,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PrismaService } from "../prisma/prisma.service";
import { Roles } from "../roles/roles.decoratos";
import { RolesGuard } from "../roles/roles.guard";
import { TimetableItemsService } from "../timetable-items/timetable-items.service";

@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly prisma: PrismaService,
    private timetableItemsService: TimetableItemsService
  ) {}

  @Get()
  @Bind(Req())
  async findAll(req: any) {
    return this.prisma.user.findMany({
      where: {
        role: req.user.role === "PROFESSOR" ? "ADMINISTRATOR" : "PROFESSOR",
      },
      select: { name: true, lastName: true, uid: true },
    });
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const {
      password,
      timetableItems,
      ...user
    } = await this.prisma.user.findOne({
      where: { uid: id },
      include: {
        timetableItems: {
          include: {
            timeTableItem: {
              include: { classRoom: true, group: true, subject: true },
            },
          },
        },
      },
    });

    if (!user) throw new NotFoundException();

    return {
      ...user,
      timetableItems: timetableItems.map((item) => {
        return { ...item.timeTableItem };
      }),
    };
  }

  @Roles("ADMINISTRATOR", "PROFESSOR")
  @Get(":id/messages/:idFrom")
  async getMessages(@Param("id") id: string, @Param("idFrom") idFrom: string) {
    const messagesFromToMe = await this.prisma.message.findMany({
      where: { sentToUid: id, sentFromUid: idFrom },
    });

    const messagesMeToFrom = await this.prisma.message.findMany({
      where: { sentToUid: idFrom, sentFromUid: id },
    });

    return [...messagesFromToMe, ...messagesMeToFrom].sort(
      (m1, m2) => m2.sentDate.getTime() - m1.sentDate.getTime()
    );
  }

  @Get(":id/subjects/:semester")
  async getSubjects(
    @Param("id") id: string,
    @Param("semester") semester: boolean
  ) {
    const res = await this.prisma.user.findOne({
      where: { uid: id },
      select: {
        subjects: {
          where: { subject: { semester } },
          select: { subject: true },
        },
      },
    });
    if (!res) throw new NotFoundException();
    return res.subjects.map((subject) => {
      return { ...subject.subject };
    });
  }

  @Roles("ALUMN", "PROFESSOR")
  @Delete(":id/timetable-items/:semester")
  @Bind(Req())
  async removeTimetableItems(
    { user }: { user: Omit<User, "password"> },
    @Param("id") id: string,
    @Param("semester") semester: boolean
  ) {
    if (id !== user.uid) {
      throw new ForbiddenException();
    }
    const res = await this.prisma.userTimetableItems.deleteMany({
      where: { userId: id, timeTableItem: { semester } },
    });
    return res;
  }

  @Roles("ALUMN", "PROFESSOR")
  @Put(":id/timetable-items")
  @Bind(Req())
  async addTimetableItems(
    { user }: { user: Omit<User, "password"> },
    @Param("id") id: string,
    @Body() { timetableItemId }: { timetableItemId: number }
  ) {
    if (id !== user.uid) {
      throw new ForbiddenException();
    }

    if (!timetableItemId) {
      throw new BadRequestException(
        undefined,
        "Por favor, seleccione un item a añadir"
      );
    }

    const isItemValid = await this.timetableItemsService.isNewItemValid(
      id,
      timetableItemId
    );

    if (isItemValid) {
      const res = await this.prisma.userTimetableItems.create({
        data: {
          timeTableItem: { connect: { id: timetableItemId } },
          user: { connect: { uid: id } },
        },
      });
      return res;
    }
    throw new BadRequestException(
      undefined,
      "El item seleccionado no se puede añadir a su horario"
    );
  }

  @Get(":id/timetable-items/:semester")
  async getTimetable(
    @Param("id") id: string,
    @Param("semester") semester: boolean
  ) {
    const res = await this.prisma.user.findOne({
      where: { uid: id },
      include: {
        timetableItems: {
          where: { timeTableItem: { semester } },
          include: {
            timeTableItem: {
              include: { classRoom: true, group: true, subject: true },
            },
          },
        },
      },
    });

    return res.timetableItems.map((item) => {
      return { ...item.timeTableItem };
    });
  }
}
