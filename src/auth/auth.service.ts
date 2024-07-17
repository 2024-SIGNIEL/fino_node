import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { compare } from 'bcrypt';
import { Strategy } from 'passport-local';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SignInRequestDto } from 'src/dto/request/signIn.request.dto';
import { SignInResponseDto } from 'src/dto/response/signIn.response.dto';
import { GenAccessTokenDto } from 'src/dto/response/token.response.dto';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/prisma/client';
import { SignUpReq } from 'src/dto/request/signup.request.dto';

@Injectable()
export class AuthService extends PassportStrategy(Strategy) {
  constructor(
    @Inject(Logger) private logger: Logger,
    @Inject(JwtService) private readonly jwt: JwtService,
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    super();
  }

  async signUp(request: SignUpReq): Promise<null> {
    this.logger.log('try signUp');
    const { email, name, password } = request;

    if (await this.prisma.findUserByEmail(email))
      throw new ConflictException('이미 존재하는 Id');

    await this.prisma.user.create({
      data: {
        email,
        username: name,
        password: await bcrypt.hash(password, Number(process.env.HASH)),
        role: Role.BASIC,
      },
    });

    return null;
  }

  async genAccessToken(userId: number): Promise<GenAccessTokenDto> {
    return {
      accessToken: await this.jwt.signAsync(
        {
          id: userId,
        },
        {
          secret: this.config.get<string>('JWT_SECRET'),
          privateKey: this.config.get<string>('JWT_PRIVATE'),
        },
      ),
      expiredAt: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
    };
  }

  async signIn(req: SignInRequestDto): Promise<SignInResponseDto> {
    this.logger.log('Try to signIn');

    const { email, password } = req;

    const thisUser = await this.prisma.findUserByEmail(email);
    if (!thisUser) throw new NotFoundException();

    if (!(await compare(password, thisUser.password)))
      throw new BadRequestException('비밀번호 오입력');

    const accessToken = await this.genAccessToken(thisUser.id);

    return {
      id: thisUser.id,
      accessToken: accessToken.accessToken,
      expiredAt: accessToken.expiredAt,
    };
  }
}
