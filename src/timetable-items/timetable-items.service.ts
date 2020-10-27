import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class TimetableItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async isNewItemValid(userId: string, timetableItemId: number): Promise<any> {
    const itemToAdd = await this.prisma.timeTableItem.findOne({
      where: { id: timetableItemId },
    });

    if (!itemToAdd) throw new NotFoundException();

    const { timetableItems, subjects } = await this.prisma.user.findOne({
      where: { uid: userId },
      include: {
        subjects: { where: { subject: { semester: itemToAdd.semester } } },
        timetableItems: {
          include: { timeTableItem: true },
          where: { timeTableItem: { semester: itemToAdd.semester } },
        },
      },
    });

    if (!subjects.find((subject) => subject.subjectId === itemToAdd.subjectId))
      throw new BadRequestException(
        undefined,
        "El item elegido no pertenece a las asignaturas del usuario"
      );

    const isValid = timetableItems.every(({ timeTableItem }) => {
      if (itemToAdd.dayOfTheWeek === timeTableItem.dayOfTheWeek) {
        return (
          itemToAdd.startHour >= timeTableItem.endHour ||
          itemToAdd.endHour <= timeTableItem.startHour
        );
      } else {
        return true;
      }
    });

    return isValid;
  }
}
