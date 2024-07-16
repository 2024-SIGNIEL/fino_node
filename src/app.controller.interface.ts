import { EmailValidationSignUpRequestDto } from './dto/request/emailValidationSignUp.request.dto';
import { ControllerResponseDto } from './dto/response/controller.response.dto';
import { EmailValidationSignUpResponseDto } from './dto/response/emailValidationSignUp.response.dto';

export interface IAppController {
  emailValidateForSignUp(
    request: EmailValidationSignUpRequestDto,
  ): Promise<ControllerResponseDto<EmailValidationSignUpResponseDto>>;
}
