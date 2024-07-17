import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { PaymentSaveRequestDto } from 'src/dto/request/paymentSave.request.dto';

@Controller('payment')
@UseGuards(AuthGuard)
export class PaymentController {
  constructor(
    private service: PaymentService,
  ) {}

  @Post()
  async savePayment(@Body() request: PaymentSaveRequestDto) {
    const data = await this.service.paymentSave(request);

    return data;
  }
}
