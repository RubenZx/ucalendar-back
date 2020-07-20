import { SubjectUpdateInput } from "@prisma/client";
import { IsDate, IsInt, IsString, Max, Min, MinLength } from "class-validator";

export class UpdateSubjectDto implements SubjectUpdateInput {
  @IsDate()
  startHour?: Date;

  @IsDate()
  endHour?: Date;

  @IsInt()
  @Min(0)
  @Max(6)
  dayOfTheWeek?: number;

  @IsString()
  @MinLength(4)
  name?: string;

  @IsString()
  abrev?: string;

  @IsString()
  classRoom?: string;

  @IsString()
  type?: string;

  @IsString()
  colorBgc?: string;

  @IsString()
  colorAbrev?: string;
}
