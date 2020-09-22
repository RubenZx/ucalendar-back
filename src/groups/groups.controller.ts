import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Controller("groups")
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
