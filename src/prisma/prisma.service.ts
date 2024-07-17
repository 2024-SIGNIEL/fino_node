import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from './client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(readonly configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get('DATABASE_URL'),
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async findUserById(id: number) {
    return await this.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        role: true,
      },
    });
  }

  async findUserByEmail(email: string) {
    return await this.user.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        role: true,
      },
    });
  }

  async updateUser(id: number, email: string, name: string) {
    return await this.user.update({
      where: {
        id,
      },
      data: {
        email,
        username: name,
      },
    });
  }

  async setMaximum(id: number, maximum: number) {
    return await this.user.update({
      where: {
        id,
      },
      data: {
        maximum,
      },
    });
  }

  async findDailySpentByUsernameAndDate(
    username: string,
    date: string,
  ): Promise<number> {
    const result = await this.paymentTransaction.findMany({
      where: {
        accountHolder: username,
        paymentTime: {
          contains: date,
        },
      },
      select: {
        amount: true,
      },
    });

    return [result.map((x) => Number(x.amount))].reduce((sum, x) => {
      return sum + x[0];
    }, 0);
  }

  async getWeeklySpentWithBank(
    username: string,
    startDate: string,
    endDate: string,
  ) {
    const group: {
      bank: string;
      amount: number;
    }[] = await this.$queryRaw`
      SELECT bank, SUM(amount) as amount 
      FROM PaymentTransaction
      WHERE 
        username = ${username}
        AND STR_TO_DATE(paymentTime, '%Y-%m-%d') 
        BETWEEN STR_TO_DATE(${startDate}, '%Y-%m-%d') AND STR_TO_DATE(${endDate}, '%Y-%m-%d')
      GROUP BY bank
    `;

    const result = {
      kn: 0,
      kj: 0,
      kb: 0,
      ibk: 0,
      nh: 0,
      im: 0,
      busan: 0,
      suhyup: 0,
      shinhan: 0,
      woori: 0,
      jb: 0,
      sc: 0,
      jeju: 0,
      hana: 0,
      kdb: 0,
      koreaexim: 0,
      citi: 0,
      kbank: 0,
      toss: 0,
      keb: 0,
      kakao: 0,
    };

    group.map((x) => {
      result[x.bank] = x.amount;
    });

    return result;
  }
}
