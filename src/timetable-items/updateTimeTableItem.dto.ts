import { JsonArray, TimeTableItemUpdateInput } from "@prisma/client";
import {
  IsArray,
  IsInt,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from "class-validator";

export class UpdateTimeTableItemDto implements TimeTableItemUpdateInput {
  @IsNumber()
  groupId?: number;

  @IsNumber()
  classRoomId?: number;

  @IsArray()
  weeks?: JsonArray;

  @IsString()
  @Length(5)
  startHour?: string;

  @IsString()
  @Length(5)
  endHour?: string;

  @IsInt()
  @Min(0)
  @Max(6)
  dayOfTheWeek?: number;

  @IsString()
  type?: string;

  @IsString()
  colorBg?: string;

  @IsString()
  colorAbrev?: string;
}
