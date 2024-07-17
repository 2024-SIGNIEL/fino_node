import { Inject, Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
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

@Injectable()
export class SpendService implements ISpendService {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async getWeeklyGraphData(
    requestQuery: GetWeeklyGraphDataRequestQueryDto,
    requestBody: GetWeeklyGraphDataRequestBodyDto,
  ): Promise<GetWeeklyGraphDataResponseDto> {
    const { username } = requestBody.user;

    dayjs.extend(isoWeek);
    dayjs.extend(utc);
    dayjs.extend(timezone);

    dayjs.tz.setDefault('Asia/Seoul');

    const { date } = requestQuery;
    const startDate = dayjs(date, 'YYYY-MM-DD').tz().startOf('isoWeek'); // dayjs.tz(dayjs(date, 'YYYY-MM-DD').date())

    const dateRange = [
      startDate.add(9, 'h').toISOString().split('T')[0],
      startDate.add(9, 'h').add(1, 'd').toISOString().split('T')[0],
      startDate.add(9, 'h').add(2, 'd').toISOString().split('T')[0],
      startDate.add(9, 'h').add(3, 'd').toISOString().split('T')[0],
      startDate.add(9, 'h').add(4, 'd').toISOString().split('T')[0],
      startDate.add(9, 'h').add(5, 'd').toISOString().split('T')[0],
      startDate.add(9, 'h').add(6, 'd').toISOString().split('T')[0],
    ];

    const graph = [
      {
        date: dateRange[0],
        sum: await this.prisma.findDailySpentByUsernameAndDate(
          username,
          dateRange[0],
        ),
      },
      {
        date: dateRange[1],
        sum: await this.prisma.findDailySpentByUsernameAndDate(
          username,
          dateRange[1],
        ),
      },
      {
        date: dateRange[2],
        sum: await this.prisma.findDailySpentByUsernameAndDate(
          username,
          dateRange[2],
        ),
      },
      {
        date: dateRange[3],
        sum: await this.prisma.findDailySpentByUsernameAndDate(
          username,
          dateRange[3],
        ),
      },
      {
        date: dateRange[4],
        sum: await this.prisma.findDailySpentByUsernameAndDate(
          username,
          dateRange[4],
        ),
      },
      {
        date: dateRange[5],
        sum: await this.prisma.findDailySpentByUsernameAndDate(
          username,
          dateRange[5],
        ),
      },
      {
        date: dateRange[6],
        sum: await this.prisma.findDailySpentByUsernameAndDate(
          username,
          dateRange[6],
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
          username,
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
}
