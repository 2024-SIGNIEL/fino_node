import { GetWeeklyGraphDataRequestQueryDto, GetWeeklyGraphDataRequestBodyDto } from "../dto/request/getWeeklyGraphData.request.dto";
import { GetWeeklyGraphDataResponseDto } from "../dto/response/getWeeklyGraphData.response.dto";

export interface ISpendController {
  getWeeklyGraphData(
    requestQuery: GetWeeklyGraphDataRequestQueryDto,
    requestBody: GetWeeklyGraphDataRequestBodyDto,
  ): Promise<GetWeeklyGraphDataResponseDto>;
}