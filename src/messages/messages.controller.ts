import {
  Bind,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PrismaService } from "../prisma/prisma.service";
import { Roles } from "../roles/roles.decoratos";
import { RolesGuard } from "../roles/roles.guard";
import { CreateMessageDto } from "./createMessage.dto";

@Controller("messages")
@UseGuards(JwtAuthGuard, RolesGuard)
export class MessagesController {
  constructor(private readonly prisma: PrismaService) {}

  @Roles("ADMINISTRATOR", "PROFESSOR")
  @Get("/users")
  @Bind(Req())
  async getUsersMessages(req: any) {
    const usersMeFrom = await this.prisma.message.findMany({
      where: { sentFromUid: req.user.uid },
      select: { sentTo: { select: { name: true, lastName: true, uid: true } } },
    });

    const usersMeTo = await this.prisma.message.findMany({
      where: { sentToUid: req.user.uid },
      select: {
        sentFrom: { select: { name: true, lastName: true, uid: true } },
      },
    });

    return [
      ...usersMeFrom.map((user) => {
        return { ...user.sentTo };
      }),
      ...usersMeTo.map((usersMeTo) => {
        return { ...usersMeTo.sentFrom };
      }),
    ].filter(
      (v, i, a) =>
        a.findIndex((t) => JSON.stringify(t) === JSON.stringify(v)) === i
    );
  }

  @Roles("ADMINISTRATOR", "PROFESSOR")
  @Post()
  @Bind(Req())
  async sendMessage(
    req: any,
    @Body() { sentToUid, sentFromUid, content }: CreateMessageDto
  ) {
    if (req.user.uid !== sentFromUid)
      throw new ForbiddenException(
        undefined,
        "El emisor no corresponde con el usuario logueado"
      );
    const message = await this.prisma.message.create({
      data: {
        content,
        sentFrom: { connect: { uid: sentFromUid } },
        sentTo: { connect: { uid: sentToUid } },
      },
    });
    return message;
  }
}
