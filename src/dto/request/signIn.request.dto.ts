import { IsEmail, IsString } from '@nestjs/class-validator';

export class SignInRequestDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
