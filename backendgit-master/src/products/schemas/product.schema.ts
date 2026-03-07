// backend/src/products/schemas/product.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ type: Number, required: true, unique: true, index: true }) // ⬅️ ระบุ type+index
  id!: number; // ใช้เลข id สำหรับ mapping กับ frontend

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ default: '' })
  description!: string;

  @Prop({ type: Number, required: true, min: 0 })
  price!: number;

  @Prop({ type: Number, default: 0, min: 0 })
  stock!: number;

  @Prop({ default: '' })
  imageUrl!: string;

  @Prop({ default: '' })
  tag!: string;
}
export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ id: 1 }, { unique: true }); // เผื่อความชัดเจน
