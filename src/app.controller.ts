import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { IAppController } from './app.controller.interface';

@Controller()
export class AppController implements IAppController {
  constructor(
    private readonly appService: AppService
  ) {}
}
