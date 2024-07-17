import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MainService {
  constructor(
    private prisma: PrismaService,
  ){}

  async setMaximum(request) {
    const { maximum, user } = request;

    await this.prisma.setMaximum(user.id, maximum);

    return
  }
}
