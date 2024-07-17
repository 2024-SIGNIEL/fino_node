import { Body, Controller, Get, Inject, Logger, Query } from '@nestjs/common';
import {
  GetWeeklyGraphDataRequestQueryDto,
  GetWeeklyGraphDataRequestBodyDto,
} from '../dto/request/getWeeklyGraphData.request.dto';
import { GetWeeklyGraphDataResponseDto } from '../dto/response/getWeeklyGraphData.response.dto';
import { SpendService } from './spend.service';

@Controller('spend')
export class SpendController {
  constructor(
    private readonly service: SpendService,
    @Inject(Logger) private logger: Logger,
  ) {}

  @Get('graph')
  async getWeeklyGraphData(
    @Query() requestQuery: GetWeeklyGraphDataRequestQueryDto,
    @Body() requestBody: GetWeeklyGraphDataRequestBodyDto,
  ): Promise<GetWeeklyGraphDataResponseDto> {
    this.logger.log('Get Weekly Data');
    const data = await this.service.getWeeklyGraphData(
      requestQuery,
      requestBody,
    );

    return data
  }
}
