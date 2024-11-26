import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Logger,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CancelPaymentDto } from './dto/cancel-payment.dto';
import { ConfirmWebhookDto } from './dto/confirm-webhook.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { OrderInfoDto } from './dto/order-info.dto';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  @ApiOperation({ summary: 'Tạo một liên kết thanh toán mới' })
  @ApiResponse({
    status: 201,
    description: 'Liên kết thanh toán được tạo thành công.',
    type: PaymentResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Tạo liên kết thanh toán thất bại.',
    schema: {
      example: {
        error: -1,
        message: 'fail',
        data: null,
      },
    },
  })
  createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<PaymentResponseDto> {
    return this.paymentService.createPayment(createPaymentDto);
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Lấy thông tin liên kết thanh toán theo orderId' })
  @ApiParam({ name: 'orderId', description: 'Mã đơn hàng', example: '123456' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin liên kết thanh toán được trả về.',
    type: OrderInfoDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy liên kết thanh toán.',
    schema: {
      example: {
        error: -1,
        message: 'failed',
        data: null,
      },
    },
  })
  getPayment(@Param('orderId') orderId: string): Promise<OrderInfoDto> {
    return this.paymentService.getPayment(orderId);
  }

  @Put(':orderId')
  @ApiOperation({ summary: 'Hủy liên kết thanh toán theo orderId' })
  @ApiParam({ name: 'orderId', description: 'Mã đơn hàng', example: '123456' })
  @ApiResponse({
    status: 200,
    description: 'Liên kết thanh toán được hủy thành công.',
    type: OrderInfoDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy liên kết thanh toán.',
    schema: {
      example: {
        error: -1,
        message: 'failed',
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Hủy liên kết thanh toán thất bại.',
    schema: {
      example: {
        error: -1,
        message: 'failed',
        data: null,
      },
    },
  })
  cancelPayment(
    @Param('orderId') orderId: string,
    @Body() cancelPaymentDto: CancelPaymentDto,
  ): Promise<OrderInfoDto> {
    return this.paymentService.cancelPayment(orderId, cancelPaymentDto);
  }

  @Post('confirm-webhook')
  @ApiOperation({ summary: 'Xác nhận webhook' })
  @ApiResponse({
    status: 201,
    description: 'Webhook được xác nhận thành công.',
    schema: {
      example: {
        error: 0,
        message: 'ok',
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Xác nhận webhook thất bại.',
    schema: {
      example: {
        error: -1,
        message: 'failed',
        data: null,
      },
    },
  })
  confirmWebhook(@Body() confirmWebhookDto: ConfirmWebhookDto): Promise<null> {
    return this.paymentService.confirmWebhook(confirmWebhookDto);
  }
}
