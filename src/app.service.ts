import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IAppService } from './app.service.interface';
import { EmailValidationSignUpRequestDto } from './dto/request/emailValidationSignUp.request.dto';
import { EmailValidationSignUpResponseDto } from './dto/response/emailValidationSignUp.response.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { SignUpMailHtml } from './resource/signup/mail.html';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { ValidateSignUpCodeRequestDto } from './dto/request/validateSignUpCode.request.dto';
import { ValidateSignUpCodeResponseDto } from './dto/response/validateSignUpCode.response.dto';
import { ConfigService } from '@nestjs/config';
import { GetWeeklyGraphDataResponseDto } from './dto/response/getWeeklyGraphData.response.dto';
import * as dayjs from 'dayjs';
import * as isoWeek from 'dayjs/plugin/isoWeek';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import { PrismaService } from './prisma/prisma.service';
import {
  GetWeeklyGraphDataRequestQueryDto,
  GetWeeklyGraphDataRequestBodyDto,
} from './dto/request/getWeeklyGraphData.request.dto';

@Injectable()
export class AppService implements IAppService {
  constructor(
    @Inject(MailerService) private readonly mail: MailerService,
    @InjectRedis() private readonly redis: Redis, // redis
    private config: ConfigService,
    @Inject(PrismaService) private prisma: PrismaService,
  ) {}

  async emailValidateForSignUp(
    request: EmailValidationSignUpRequestDto,
  ): Promise<EmailValidationSignUpResponseDto> {
    const { to } = request;
    const MAIL_FROM = this.config.get<string>('MAIL_USER');
    const MAIL_SIGNUP_SUBJECT = this.config.get<string>('MAIL_SIGNUP_SUBJECT');

    const code = Math.floor(Math.random() * 999998) + 1;

    const html = SignUpMailHtml(code);
    try {
      await this.mail.sendMail({
        to,
        from: MAIL_FROM,
        subject: MAIL_SIGNUP_SUBJECT,
        priority: 'high',
        html,
      });
    } catch (e) {
      throw new InternalServerErrorException('', e);
    }

    await this.redis.set(`${to}@SIGN_UP`, code);

    return {
      code: String(code).padStart(6, '0'),
    };
  }

  async validateSignUpCode(
    request: ValidateSignUpCodeRequestDto,
  ): Promise<ValidateSignUpCodeResponseDto> {
    const { email, code } = request;

    const redisCode = await this.redis.get(`${email}@SIGN_UP`);

    if (!redisCode) throw new NotFoundException();
    if (redisCode !== code) throw new UnauthorizedException();

    await this.redis.del(`${email}@SIGN_UP`);

    return {
      isValid: true,
    };
  }

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
