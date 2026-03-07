// backend/src/auth/dto/auth.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString() @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'กรุณากรอกเบอร์โทรศัพท์' })
  // @IsMobilePhone('th-TH') // (Optional) ถ้าต้องการเช็คว่าเป็นรูปแบบเบอร์ไทยไหม
  phone: string;
  
  @IsEmail()
  email: string;

  @IsString() @MinLength(6)
  password: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
