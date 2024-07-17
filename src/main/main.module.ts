import { Logger, Module } from '@nestjs/common';
import { MainController } from './main.controller';
import { MainService } from './main.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MainController],
  providers: [MainService, PrismaService, JwtService, Logger]
})
export class MainModule {}
