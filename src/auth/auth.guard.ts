import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = await context.switchToHttp().getRequest();

    const token: string = req.headers['authorization'];

    if (!token) throw new UnauthorizedException('토큰 필요');
    if (!token.includes(' ')) throw new UnauthorizedException('토큰 형식 오류');

    const { id } = await this.jwt.decode(token.split(' ')[1]);

    if (!(await this.redis.get(`${id}@AccessToken`)))
      throw new ForbiddenException();

    const thisUser = await this.prisma.findUserById(id);
    if (!thisUser) throw new NotFoundException('존재하지 않는 유저');

    req.body.user = thisUser;

    return true;
  }
}
