import { IsEmail, IsOptional, IsString } from 'class-validator';
import { User } from 'src/prisma/client';

export class ModifyInformRequestDto {
  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  name: string;

  user: User;
}
