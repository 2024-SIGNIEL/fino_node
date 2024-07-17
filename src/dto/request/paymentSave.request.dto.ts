import { IsString } from "@nestjs/class-validator";
import { IsNumber } from "class-validator";
import { User } from "src/prisma/client";

export class PaymentSaveRequestDto {
  user: User;

  @IsNumber()
  amount: number;

  @IsString()
  paymentTime: string;

  @IsString()
  accountHolder: string;

  @IsString()
  recipient: string;

  @IsString()
  bank: string;
}