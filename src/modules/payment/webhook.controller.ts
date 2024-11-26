import { Body, Controller, Post, Logger } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrderInfoDto } from './dto/order-info.dto';
import { WebhookDataDto } from './dto/webhook-data.dto';

@ApiTags('webhook')
@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private readonly paymentService: PaymentService) {}

  @Post('payos')
  @ApiOperation({ summary: 'Xử lý webhook từ PayOS' })
  @ApiResponse({
    status: 201,
    description: 'Webhook được xử lý thành công.',
    type: OrderInfoDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Xử lý webhook thất bại.',
    schema: {
      example: {
        error: -1,
        message: 'failed',
        data: null,
      },
    },
  })
  handlePayOSWebhook(@Body() body): Promise<WebhookDataDto> {
    return this.paymentService.handlePayOSWebhook(body);
  }
}
