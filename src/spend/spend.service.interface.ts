import { GetWeeklyGraphDataRequestQueryDto, GetWeeklyGraphDataRequestBodyDto } from "src/dto/request/getWeeklyGraphData.request.dto";
import { GetWeeklyGraphDataResponseDto } from "src/dto/response/getWeeklyGraphData.response.dto";

export interface ISpendService {
  getWeeklyGraphData(
    requestQuery: GetWeeklyGraphDataRequestQueryDto,
    requestBody: GetWeeklyGraphDataRequestBodyDto,
  ): Promise<GetWeeklyGraphDataResponseDto>;
}