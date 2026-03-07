import { Body, Controller, Post, Get, UseGuards, Req, Delete, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  // ✅ 1. สำหรับดึงรายชื่อ User ทั้งหมดมาโชว์ในตาราง
  @Get('users') 
  getAllUsers() {
    return this.auth.findAllUsers();
  }


  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  me(@Req() req) {
    return req.user;
  }
}