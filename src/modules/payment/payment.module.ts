import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { WebhookController } from './webhook.controller';
import { PaymentService } from './payment.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [PaymentController, WebhookController],
  providers: [PaymentService],
})
export class PaymentModule {}
