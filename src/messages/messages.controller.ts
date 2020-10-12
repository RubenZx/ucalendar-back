import {
  Bind,
  Body,
  Controller,
  ForbiddenException,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { PrismaService } from "src/prisma/prisma.service";
import { Roles } from "src/roles/roles.decoratos";
import { RolesGuard } from "src/roles/roles.guard";
import { CreateMessageDto } from "./createMessage.dto";

@Controller("messages")
@UseGuards(JwtAuthGuard, RolesGuard)
export class MessagesController {
  constructor(private readonly prisma: PrismaService) {}

  @Roles("ADMINISTRATOR", "PROFESSOR")
  @Post()
  @Bind(Req())
  async sendMessage(
    req: any,
    @Body() { sentToUid, sentFromUid, content }: CreateMessageDto
  ) {
    if (req.user.uid !== sentFromUid) throw new ForbiddenException();
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
