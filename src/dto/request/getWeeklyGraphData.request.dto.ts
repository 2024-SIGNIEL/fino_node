import { Type } from '@nestjs/class-transformer';
import { IsDateString, IsString } from '@nestjs/class-validator';
import { User } from '../../prisma/client';

export class GetWeeklyGraphDataRequestQueryDto {
  @Type(() => String)
  @IsString()
  date: string;
}

export class GetWeeklyGraphDataRequestBodyDto {
  user: User;
}
