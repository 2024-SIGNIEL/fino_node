import { Injectable } from '@nestjs/common';
import { PaymentSaveRequestDto } from 'src/dto/request/paymentSave.request.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async paymentSave(request: PaymentSaveRequestDto) {
    const { user, amount, paymentTime, accountHolder, recipient, bank } =
      request;

    await this.prisma.savePayment(
      user.id,
      amount,
      paymentTime,
      accountHolder,
      recipient,
      bank,
    );
  }
}
