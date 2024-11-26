import { ApiProperty } from '@nestjs/swagger';

export class OrderInfoDto {
  @ApiProperty({ example: '123456' })
  orderCode: number;

  @ApiProperty({ example: 'completed' })
  status: string;

  @ApiProperty({ example: 100000 })
  amount: number;

  // Thêm các trường khác tùy thuộc vào dữ liệu trả về
}
