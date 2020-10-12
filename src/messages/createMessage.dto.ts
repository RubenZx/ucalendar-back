import { MessageCreateInput } from "@prisma/client";
import { IsString, Length } from "class-validator";

export class CreateMessageDto
  implements Omit<MessageCreateInput, "sentTo" | "sentFrom" | "sentDate"> {
  @IsString()
  @Length(10, 190)
  content: string;

  @IsString()
  sentToUid: string;

  @IsString()
  sentFromUid: string;
}
