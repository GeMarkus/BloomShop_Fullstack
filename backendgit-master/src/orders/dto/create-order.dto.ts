// src/orders/dto/create-order.dto.ts
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, Min, ValidateNested } from 'class-validator';

export enum PaymentMethod {
  Visa = 'visa',
  Mastercard = 'mastercard',
  Paypal = 'paypal',
  Promptpay = 'promptpay',
}

class OrderItemDto {
  @Type(() => Number) // ✅ แปลง string → number อัตโนมัติ
  @IsInt()
  @Min(1)
  productId!: number;

  @Type(() => Number) // ✅ แปลง string → number อัตโนมัติ
  @IsInt()
  @Min(1)
  qty!: number;
}

export class CreateOrderDto {
  @IsEnum(PaymentMethod)
  method!: PaymentMethod;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}
