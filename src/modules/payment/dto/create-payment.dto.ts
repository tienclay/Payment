import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Mã đơn hàng',
    example: '123',
  })
  @IsNumber()
  @IsNotEmpty()
  orderCode: number;

  @ApiProperty({
    description: 'Mô tả giao dịch',
    example: 'Thanh toán đơn hàng #123',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'URL trả về khi thanh toán thành công',
    example: 'http://example.com/return',
  })
  @IsString()
  @IsNotEmpty()
  returnUrl: string;

  @ApiProperty({
    description: 'URL hủy thanh toán',
    example: 'http://example.com/cancel',
  })
  @IsString()
  @IsNotEmpty()
  cancelUrl: string;

  @ApiProperty({
    description: 'Số tiền thanh toán',
    example: 100000,
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
