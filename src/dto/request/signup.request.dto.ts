import { IsEmail, IsString } from 'class-validator';

export class SignUpReq {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  password: string;
}
