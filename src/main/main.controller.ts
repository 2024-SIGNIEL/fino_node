import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { MainService } from './main.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserRequestDto } from 'src/dto/request/user.request.dto';

@UseGuards(AuthGuard)
@Controller('main')
export class MainController {
  constructor(private service: MainService) {}

  @Post('set')
  async setMaximum(@Body() request) {
    await this.service.setMaximum(request);

    return;
  }

  @Get('check')
  async isOverMaximum(
    @Query('date') date: string,
    @Body() request: UserRequestDto,
  ) {
    const data = await this.service.isOverMaximum(date, request);

    return data;
  }
}
