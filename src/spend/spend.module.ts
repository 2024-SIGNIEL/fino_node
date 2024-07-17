import { Logger, Module } from '@nestjs/common';
import { SpendController } from './spend.controller';
import { SpendService } from './spend.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SpendController],
  providers: [SpendService, PrismaService, Logger]
})
export class SpendModule {}
