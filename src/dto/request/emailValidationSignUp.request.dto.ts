import { IsEmail, IsString } from "class-validator";

export class EmailValidationSignUpRequestDto {
  @IsEmail()
  to: string
}