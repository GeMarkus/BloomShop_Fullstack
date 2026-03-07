import { Controller, Get, Delete, Param, Patch, Body } from '@nestjs/common'; // 🌟 เพิ่ม Patch, Body
import { AuthService } from './auth.service';

@Controller('users') 
export class UsersController {
  constructor(private readonly auth: AuthService) {}

  @Get()
  findAll() {
    return this.auth.findAllUsers(); 
  }

  // 🌟 เพิ่มอันนี้แทนที่ของเก่า หรือจะเก็บไว้ก็ได้ แต่มึงบอกอยากเอาปุ่มออก
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: any) {
    // เรียกไปที่ Service ที่มึงสร้างไว้แล้ว
    return this.auth.update(id, updateData); 
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.auth.remove(id); // เรียกไปที่ service ที่มึงเพิ่งเช็ค
  }
}