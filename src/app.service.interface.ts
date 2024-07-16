import { EmailValidationSignUpRequestDto } from "./dto/request/emailValidationSignUp.request.dto";
import { EmailValidationSignUpResponseDto } from "./dto/response/emailValidationSignUp.response.dto";

export interface IAppService {
  emailValidateForSignUp (request: EmailValidationSignUpRequestDto): Promise<EmailValidationSignUpResponseDto>
  // emailValidateFor (request:): 
}