import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { IAppService } from './app.service.interface';
import { EmailValidationSignUpRequestDto } from './dto/request/emailValidationSignUp.request.dto';
import { EmailValidationSignUpResponseDto } from './dto/response/emailValidationSignUp.response.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { SignUpMailHtml } from './resource/signup/mail.html';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export class AppService implements IAppService {
  constructor(
    @Inject(MailerService) private readonly mail: MailerService,
    @InjectRedis() private readonly redis: Redis, // redis
  ) {}

  async emailValidateForSignUp(
    request: EmailValidationSignUpRequestDto,
  ): Promise<EmailValidationSignUpResponseDto> {
    const { to } = request;
    const { MAIL_FROM, MAIL_SIGNUP_SUBJECT } = process.env;

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
      throw new InternalServerErrorException(e);
    }

    await this.redis.set(`${to}@SIGN_UP`, code);

    return {
      code: String(code)
    };
  }
}
