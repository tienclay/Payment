import { ApiProperty } from '@nestjs/swagger';

export class PaymentResponseDto {
  @ApiProperty({ example: '123456' })
  bin: string;

  @ApiProperty({ example: 'http://checkout.url' })
  checkoutUrl: string;

  @ApiProperty({ example: '0987654321' })
  accountNumber: string;

  @ApiProperty({ example: 'Tên tài khoản' })
  accountName: string;

  @ApiProperty({ example: 100000 })
  amount: number;

  @ApiProperty({ example: 'Thanh toán đơn hàng #123' })
  description: string;

  @ApiProperty({ example: 123456 })
  orderCode: number;

  @ApiProperty({ example: 'data:image/png;base64,...' })
  qrCode: string;
}
