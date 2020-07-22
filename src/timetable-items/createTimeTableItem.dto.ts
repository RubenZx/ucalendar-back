import { JsonArray, TimeTableItemCreateInput } from "@prisma/client";
import {
  IsArray,
  IsInt,
  IsNumber,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
} from "class-validator";

export class CreateTimeTableItemDto
  implements Omit<TimeTableItemCreateInput, "subject" | "group"> {
  @IsNumber()
  groupId: number;

  @IsArray()
  weeks: JsonArray;

  @IsString()
  @Length(5)
  startHour: string;

  @IsString()
  @Length(5)
  endHour: string;

  @IsInt()
  @Min(0)
  @Max(6)
  dayOfTheWeek: number;

  @IsString()
  @MaxLength(3)
  classRoom: string;

  @IsString()
  type: string;

  @IsString()
  colorBgc: string;

  @IsString()
  colorAbrev: string;
}
