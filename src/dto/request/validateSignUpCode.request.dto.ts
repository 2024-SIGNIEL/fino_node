import { IsNumberString, IsString } from '@nestjs/class-validator';

export class ValidateSignUpCodeRequestDto {
  @IsString()
  email: string;

  @IsNumberString()
  code: string;
}
