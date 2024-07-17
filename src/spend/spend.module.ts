import { Logger, Module } from '@nestjs/common';
import { SpendController } from './spend.controller';
import { SpendService } from './spend.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [SpendController],
  providers: [SpendService, PrismaService, JwtService, Logger]
})
export class SpendModule {}
