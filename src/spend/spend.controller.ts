import {
  Body,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Logger,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  GetWeeklyGraphDataRequestQueryDto,
  GetWeeklyGraphDataRequestBodyDto,
} from '../dto/request/getWeeklyGraphData.request.dto';
import { GetWeeklyGraphDataResponseDto } from '../dto/response/getWeeklyGraphData.response.dto';
import { SpendService } from './spend.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserRequestDto } from 'src/dto/request/user.request.dto';

@Controller('spend')
@UseGuards(AuthGuard)
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

    return data;
  }

  @Get('day')
  async getDataForDay(
    @Query('date') date: string,
    @Body() request: UserRequestDto,
  ) {
    const data = await this.service.getDataForDay(date, request);

    return data;
  }
}
