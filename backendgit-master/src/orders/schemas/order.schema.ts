// backend/src/orders/schemas/order.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ _id: false }) // ⬅️ ย่อย ไม่ต้องมี _id แยก (ถ้าอยากมีเปลี่ยนเป็น true ได้)
export class OrderItem {
  @Prop({ type: Number, required: true })
  productId!: number;

  @Prop({ type: Number, required: true, min: 1 })
  qty!: number;

  @Prop({ type: Number, required: true }) // snapshot ราคา ณ วันที่สั่ง
  unitPrice!: number;

  @Prop({ type: Number, required: true }) // unitPrice * qty
  lineTotal!: number;
  
}
export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ type: String, enum: ['visa','mastercard','paypal','promptpay'], required: true })
  method!: string;

  @Prop({ type: String, required: false })
  shippingAddress?: string;

  @Prop({ type: Number, default: 0 })
  shippingFee!: number;

  // ⬅️ ใช้ Schema ย่อย
  @Prop({ type: [OrderItemSchema], default: [] })
  items!: OrderItem[];

  @Prop({ type: Number, required: true })
  total!: number;

  @Prop({ type: String, enum: ['pending','paid','cancelled'], default: 'pending' })
  status!: 'pending' | 'paid' | 'cancelled';
  
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// (แนะนำ) ใส่ index ให้ค้นหาง่าย
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ 'items.productId': 1 });
