// src/auth/auth.service.ts
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from './schemas/user.schema';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwt: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        const exists = await this.userModel.findOne({ email: dto.email.toLowerCase() }).lean();
        if (exists) throw new BadRequestException('Email already in use');
        
        const passwordHash = await bcrypt.hash(dto.password, 10);
        
        // 1. สร้าง User ใหม่
        const newUser = await this.userModel.create({
            username: dto.username,
            email: dto.email.toLowerCase(),
            password: passwordHash,
            phone: dto.phone,
        });

        // 2. สร้าง Token
        const token = await this.signToken(newUser);

        // 3. ✅ สำคัญมาก: ต้อง return ข้อมูลกลับไปให้ Frontend ด้วย!
        return this.safeUser(newUser, token);
    }

    async login(dto: LoginDto) {
        const user = await this.userModel.findOne({ email: dto.email.toLowerCase() }).select('+password');
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const ok = await bcrypt.compare(dto.password, user.password);
        if (!ok) throw new UnauthorizedException('Invalid credentials');

        const token = await this.signToken(user);
        return this.safeUser(user, token);
    }

    // เพิ่มเข้าไปใน class AuthService
    async findAllUsers() {
    // ดึงข้อมูล User ทั้งหมดจาก MongoDB มาโชว์
    return this.userModel.find().exec();
    }

    async update(id: string, data: any) {
    return this.userModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }
    
    async remove(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
    }

    private safeUser(user: UserDocument, token: string) {
        return { 
            _id: user._id, 
            username: user.username, 
            email: user.email, 
            phone: user.phone,
            role: user.role,
            token 
        };
    }

    private async signToken(user: UserDocument): Promise<string> {
        // ✅ แก้ Error TS2769 ตรงนี้
        const payload = { sub: String(user._id), email: user.email, role: user.role};
        
        // ไม่ต้องครอบ (this.jwt as any) แล้ว กูแก้โครงสร้าง options ให้ถูกตามหลัก NestJS
        return this.jwt.signAsync(payload, {
            secret: process.env.JWT_SECRET || 'default_secret',
            expiresIn: '7d', // ใส่เป็น string ตรงๆ หรือดึงจาก env
        });
    }
}
