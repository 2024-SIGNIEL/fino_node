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
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService implements IAppService {
  constructor(
    @Inject(MailerService) private readonly mail: MailerService,
    @InjectRedis() private readonly redis: Redis, // redis
    private config: ConfigService,
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

}
