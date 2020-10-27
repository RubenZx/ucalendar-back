import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PrismaService } from "../prisma/prisma.service";
import { Roles } from "../roles/roles.decoratos";
import { RolesGuard } from "../roles/roles.guard";

@Controller("groups")
@UseGuards(JwtAuthGuard, RolesGuard)
export class GroupsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.group.findMany();
  }

  @Get(":id")
  async findOne(@Param("id") id: number) {
    const group = await this.prisma.group.findOne({ where: { id } });
    if (!group) throw new NotFoundException();
    return group;
  }

  @Roles("ADMINISTRATOR")
  @Post()
  async create(@Body() { name }: { name: string }) {
    if (/^[A-Z][1-9]$/.test(name)) {
      try {
        const group = await this.prisma.group.create({ data: { name } });
        return group;
      } catch (error) {
        throw new BadRequestException(
          undefined,
          "El grupo introducido ya existe"
        );
      }
    } else {
      throw new BadRequestException(
        undefined,
        "Por favor, introduzca un nombre en el formato especificado"
      );
    }
  }
}
