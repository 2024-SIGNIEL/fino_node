import { GetWeeklyGraphDataRequestQueryDto, GetWeeklyGraphDataRequestBodyDto } from "../dto/request/getWeeklyGraphData.request.dto";
import { ControllerResponseDto } from "../dto/response/controller.response.dto";
import { GetWeeklyGraphDataResponseDto } from "../dto/response/getWeeklyGraphData.response.dto";

export interface ISpendController {
  getWeeklyGraphData(
    requestQuery: GetWeeklyGraphDataRequestQueryDto,
    requestBody: GetWeeklyGraphDataRequestBodyDto,
  ): Promise<ControllerResponseDto<GetWeeklyGraphDataResponseDto>>;
}