import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
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
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { GetInformResponseDto } from 'src/dto/response/getInform.response.dto';
import { ModifyInformRequestDto } from 'src/dto/request/modifyInform.request.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailValidationSignUpRequestDto } from 'src/dto/request/emailValidationSignUp.request.dto';
import { ValidateSignUpCodeRequestDto } from 'src/dto/request/validateSignUpCode.request.dto';
import { EmailValidationSignUpResponseDto } from 'src/dto/response/emailValidationSignUp.response.dto';
import { ValidateSignUpCodeResponseDto } from 'src/dto/response/validateSignUpCode.response.dto';
import { SignUpMailHtml } from 'src/resource/signup/mail.html';

@Injectable()
export class AuthService extends PassportStrategy(Strategy) {
  constructor(
    @Inject(Logger) private logger: Logger,
    @Inject(JwtService) private readonly jwt: JwtService,
    @InjectRedis() private readonly redis: Redis,
    @Inject(MailerService) private readonly mail: MailerService,
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

    await this.redis.set(`${thisUser.id}@AccessToken`, accessToken.accessToken);

    return {
      id: thisUser.id,
      accessToken: accessToken.accessToken,
      expiredAt: accessToken.expiredAt,
    };
  }

  async getInform(request): Promise<GetInformResponseDto> {
    const { user } = request;

    return {
      email: user.email,
      name: user.username,
      maximum: user.maximum,
    };
  }

  async modifyInform(request: ModifyInformRequestDto) {
    let { email, name, user } = request;

    if (!email) email = user.email;
    if (!name) name = user.username;

    await this.prisma.updateUser(user.id, email, name);

    const newUser = await this.prisma.findUserById(user.id);

    return {
      email: newUser.email,
      name: newUser.username,
    };
  }

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

  async logout(request) {
    const { user } = request;

    await this.redis.del(`${user.id}@AccessToken`);
  }
}
