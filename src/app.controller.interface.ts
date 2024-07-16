import { EmailValidationSignUpRequestDto } from "./dto/request/emailValidationSignUp.request.dto";
import { EmailValidationSignUpResponseDto } from "./dto/response/emailValidationSignUp.response.dto";

export interface IAppController {
  emailValidateForSignUp (request: EmailValidationSignUpRequestDto): EmailValidationSignUpResponseDto
  // 이메일 인증
  // 이메일 발송 
}