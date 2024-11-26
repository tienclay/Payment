import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CancelPaymentDto } from './dto/cancel-payment.dto';
import { ConfirmWebhookDto } from './dto/confirm-webhook.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { PaymentLinkDto } from './dto/payment-link.dto';
import { WebhookDataDto } from './dto/webhook-data.dto';
import PayOS from '@payos/node';
import * as dotenv from 'dotenv';
dotenv.config({
  path: '.env',
});
@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private payOS: PayOS;
  constructor(private configService: ConfigService) {
    this.payOS = new PayOS(
      process.env.PAYOS_CLIENT_ID,
      process.env.PAYOS_API_KEY,
      process.env.PAYOS_CHECKSUM_KEY,
    );
  }

  async createPayment(
    createPaymentDto: CreatePaymentDto,
  ): Promise<PaymentResponseDto> {
    const { orderCode, description, returnUrl, cancelUrl, amount } =
      createPaymentDto;
    const body = {
      orderCode,
      amount,
      description,
      cancelUrl,
      returnUrl,
    };

    try {
      console.log('1 :>> ', 1);
      const paymentLinkRes = await this.payOS.createPaymentLink(body);

      return {
        bin: paymentLinkRes.bin,
        checkoutUrl: paymentLinkRes.checkoutUrl,
        accountNumber: paymentLinkRes.accountNumber,
        accountName: paymentLinkRes.accountName,
        amount: paymentLinkRes.amount,
        description: paymentLinkRes.description,
        orderCode: paymentLinkRes.orderCode,
        qrCode: paymentLinkRes.qrCode,
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        {
          error: -1,
          message: 'fail',
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPayment(orderId: string): Promise<PaymentLinkDto> {
    try {
      const order = await this.payOS.getPaymentLinkInfomation(orderId);
      if (!order) {
        throw new HttpException(
          {
            error: -1,
            message: 'failed',
            data: null,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      // Giả sử order có cấu trúc tương tự OrderInfoDto
      return order;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        {
          error: -1,
          message: 'failed',
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async cancelPayment(
    orderId: string,
    cancelPaymentDto: CancelPaymentDto,
  ): Promise<PaymentLinkDto> {
    const { cancellationReason } = cancelPaymentDto;

    try {
      const order = await this.payOS.cancelPaymentLink(
        orderId,
        cancellationReason,
      );
      if (!order) {
        throw new HttpException(
          {
            error: -1,
            message: 'failed',
            data: null,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      // Giả sử order có cấu trúc tương tự OrderInfoDto
      return order;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        {
          error: -1,
          message: 'failed',
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async confirmWebhook(confirmWebhookDto: ConfirmWebhookDto): Promise<null> {
    const { webhookUrl } = confirmWebhookDto;
    try {
      console.log('webhookUrl :>> ', webhookUrl);
      await this.payOS.confirmWebhook(webhookUrl);
      return null;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        {
          error: -1,
          message: 'failed',
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  verifyPaymentWebhookData(data): WebhookDataDto {
    return this.payOS.verifyPaymentWebhookData(data);
  }

  async handlePayOSWebhook(body: any): Promise<WebhookDataDto> {
    this.logger.log('Payment handler triggered');
    const webhookData = this.verifyPaymentWebhookData(body);
    console.log('webhookData :>> ', webhookData);
    if (
      ['Ma giao dich thu nghiem', 'VQRIO123'].includes(webhookData.description)
    ) {
      return webhookData;
    }

    // Xử lý webhookData tại đây
    // Ví dụ: cập nhật trạng thái đơn hàng, gửi thông báo, v.v.

    return webhookData;
  }
  //   webhookData :>>  {
  //   accountNumber: '0004100038280006',
  //   amount: 2000,
  //   description: 'CSDC1JHN3H7 Thanh toan don hang 123',
  //   reference: 'FT24331Q8MDW',
  //   transactionDateTime: '2024-11-26 01:49:00',
  //   virtualAccountNumber: 'CAS004100038280006',
  //   counterAccountBankId: '',
  //   counterAccountBankName: '',
  //   counterAccountName: null,
  //   counterAccountNumber: null,
  //   virtualAccountName: '',
  //   currency: 'VND',
  //   orderCode: 12344,
  //   paymentLinkId: '6b35442f2e334863bb01ea0d8d17caec',
  //   code: '00',
  //   desc: 'success'
  // }
}
