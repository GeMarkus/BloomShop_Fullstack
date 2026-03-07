// backend/src/auth/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  username: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;
  // ในไฟล์ src/auth/schemas/user.schema.ts
  @Prop({ type: String, required: true }) // ตั้งเป็น true ถ้าต้องการให้ทุกคนต้องมีเบอร์
  phone: string;
  
  @Prop({ required: true, select: false }) // ซ่อนรหัสผ่านเวลา query ปกติ
  password: string;

  @Prop({ default: 'user' }) // ค่าเริ่มต้นให้ทุกคนเป็น user ไว้ก่อน
  role: string;

}

export const UserSchema = SchemaFactory.createForClass(User);
