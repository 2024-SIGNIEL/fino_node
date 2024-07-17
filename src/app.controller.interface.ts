import { EmailValidationSignUpRequestDto } from './dto/request/emailValidationSignUp.request.dto';
import { ValidateSignUpCodeRequestDto } from './dto/request/validateSignUpCode.request.dto';
import { EmailValidationSignUpResponseDto } from './dto/response/emailValidationSignUp.response.dto';
import { ValidateSignUpCodeResponseDto } from './dto/response/validateSignUpCode.response.dto';

export interface IAppController {
  emailValidateForSignUp(
    request: EmailValidationSignUpRequestDto,
  ): Promise<EmailValidationSignUpResponseDto>;
  validateSignUpCode(
    request: ValidateSignUpCodeRequestDto,
  ): Promise<ValidateSignUpCodeResponseDto>;
}
