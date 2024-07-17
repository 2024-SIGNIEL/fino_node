import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MainService } from './main.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('main')
export class MainController {
  constructor(
    private service: MainService,
  ){}

  @Post('set')
  @UseGuards(AuthGuard)
  async setMaximum(@Body() request) {
    await this.service.setMaximum(request);

    return
  }
}
