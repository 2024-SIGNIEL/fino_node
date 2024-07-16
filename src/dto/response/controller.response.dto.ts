export class ControllerResponseDto<T> {
  data: T;
  statusCode: number;
  statusMsg: string;
}
