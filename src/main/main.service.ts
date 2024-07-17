import { Injectable } from '@nestjs/common';
import { IsOverMaximumRequestDto } from 'src/dto/request/isOverMaximum.request.dto';
import { UserRequestDto } from 'src/dto/request/user.request.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc'
import * as timezone from 'dayjs/plugin/timezone'

@Injectable()
export class MainService {
  constructor(private prisma: PrismaService) {}

  async setMaximum(request) {
    const { maximum, user } = request;

    await this.prisma.setMaximum(user.id, maximum);

    return;
  }

  async isOverMaximum(date: string, request: IsOverMaximumRequestDto) {
    const { user } = request;

    dayjs.extend(utc)
    dayjs.extend(timezone)

    dayjs.tz.setDefault('Asia/Seoul');

    const startDate = dayjs(date, 'YYYY-MM-DD')
      .tz()
      .startOf('month')
      .toISOString()
      .split('T')[0];
    const endDate = dayjs(date, 'YYYY-MM-DD')
      .tz()
      .endOf('month')
      .toISOString()
      .split('T')[0];

    const monthlySpend = await this.prisma.findMonthlySpend(
      user.id,
      startDate,
      endDate,
    );

    return { 
      maximum: user.maximum,
      monthlySpend
    };
  }
}
