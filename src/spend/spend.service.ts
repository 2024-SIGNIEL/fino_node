import { Inject, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import {
  GetWeeklyGraphDataRequestQueryDto,
  GetWeeklyGraphDataRequestBodyDto,
} from '../dto/request/getWeeklyGraphData.request.dto';
import { GetWeeklyGraphDataResponseDto } from '../dto/response/getWeeklyGraphData.response.dto';
import { ISpendService } from './spend.service.interface';
import * as isoWeek from 'dayjs/plugin/isoWeek';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import { PrismaService } from '../prisma/prisma.service';
import { UserRequestDto } from 'src/dto/request/user.request.dto';

@Injectable()
export class SpendService implements ISpendService {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async getWeeklyGraphData(
    requestQuery: GetWeeklyGraphDataRequestQueryDto,
    requestBody: GetWeeklyGraphDataRequestBodyDto,
  ): Promise<GetWeeklyGraphDataResponseDto> {
    const { user } = requestBody;

    dayjs.extend(isoWeek);
    dayjs.extend(utc);
    dayjs.extend(timezone);

    dayjs.tz.setDefault('Asia/Seoul');

    const { date } = requestQuery;
    const startDate = dayjs(date, 'YYYY-MM-DD').tz().startOf('isoWeek'); // dayjs.tz(dayjs(date, 'YYYY-MM-DD').date())

    const dateRange = [
      startDate.add(9, 'h').toISOString(),
      startDate.add(9, 'h').add(1, 'd').toISOString(),
      startDate.add(9, 'h').add(2, 'd').toISOString(),
      startDate.add(9, 'h').add(3, 'd').toISOString(),
      startDate.add(9, 'h').add(4, 'd').toISOString(),
      startDate.add(9, 'h').add(5, 'd').toISOString(),
      startDate.add(9, 'h').add(6, 'd').toISOString(),
      startDate.add(9, 'h').add(7, 'd').toISOString(),
    ];

    const graph = [
      {
        date: dateRange[0],
        sum: await this.prisma.findDailySpentByUsernameAndDate(
          user.id,
          dateRange[0],
          dateRange[1],
        ),
      },
      {
        date: dateRange[1],
        sum: await this.prisma.findDailySpentByUsernameAndDate(
          user.id,
          dateRange[1],
          dateRange[2],
        ),
      },
      {
        date: dateRange[2],
        sum: await this.prisma.findDailySpentByUsernameAndDate(
          user.id,
          dateRange[2],
          dateRange[3],
        ),
      },
      {
        date: dateRange[3],
        sum: await this.prisma.findDailySpentByUsernameAndDate(
          user.id,
          dateRange[3],
          dateRange[4],
        ),
      },
      {
        date: dateRange[4],
        sum: await this.prisma.findDailySpentByUsernameAndDate(
          user.id,
          dateRange[4],
          dateRange[5],
        ),
      },
      {
        date: dateRange[5],
        sum: await this.prisma.findDailySpentByUsernameAndDate(
          user.id,
          dateRange[5],
          dateRange[6],
        ),
      },
      {
        date: dateRange[6],
        sum: await this.prisma.findDailySpentByUsernameAndDate(
          user.id,
          dateRange[6],
          dateRange[7],
        ),
      },
    ];

    return {
      graph,
      spend: {
        sum: graph.reduce((s, x) => {
          return s + x.sum;
        }, 0),
        bank: await this.prisma.getWeeklySpentWithBank(
          user.id,
          startDate.toISOString().split('T')[0],
          dayjs(date, 'YYYY-MM-DD')
            .tz()
            .endOf('isoWeek')
            .toISOString()
            .split('T')[0],
        ),
      },
    };
  }

  async getDataForDay(date: string, request: UserRequestDto) {
    const { user } = request;

    dayjs.extend(isoWeek);
    dayjs.extend(utc);
    dayjs.extend(timezone);

    dayjs.tz.setDefault('Asia/Seoul');

    const startDate = dayjs(date, 'YYYY-MM-DD').tz().startOf('date').add(9, 'h').toISOString();
    const endDate = dayjs(date, 'YYYY-MM-DD').tz().endOf('date').add(9, 'h').toISOString();

    const list = await this.prisma.getDataForDate(user.id, startDate, endDate);

    return { list }
  }
}
