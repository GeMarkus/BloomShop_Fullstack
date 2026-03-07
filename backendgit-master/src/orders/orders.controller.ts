import { Controller, Post, Get, Body, Param, Request, UseGuards, Query, Patch, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // 🛒 1. สร้างออเดอร์
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    const userId = req.user?.userId || req.user?.sub || req.user?._id; 
    return this.ordersService.createOrder(userId, createOrderDto);
  }

  // 📦 2. ดึงประวัติคำสั่งซื้อของตัวเอง (User)
  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMyOrders(@Request() req, @Query('page') page: number, @Query('limit') limit: number) {
    const userId = req.user?.userId || req.user?.sub || req.user?._id;
    return this.ordersService.findMyOrders(userId, page, limit);
  }

  // 📍 3. อัปเดตที่อยู่จัดส่ง
  @UseGuards(JwtAuthGuard)
  @Post(':id/shipping')
  addShippingAddress(
    @Request() req,
    @Param('id') orderId: string,
    @Body() body: { shippingAddress: string; shippingFee: number; total: number }
  ) {
    const userId = req.user?.userId || req.user?.sub || req.user?._id;
    return this.ordersService.addShippingAddress(orderId, userId, body.shippingAddress, body.shippingFee, body.total);
  }

  // 📋 4. สำหรับแอดมินดึงทุกออเดอร์ (ต้องวางไว้ก่อนตัวที่มี :id)
  @Get('admin/all')
  findAllForAdmin() {
    return this.ordersService.findAllOrdersForAdmin();
  }

  // 🛡️ 5. สำหรับแอดมินอัปเดตสถานะ (กูยุบรวมอันที่ซ้ำให้แล้ว)
  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(@Param('id') orderId: string, @Body('status') status: string) {
    return this.ordersService.updateOrderStatus(orderId, status);
  }

  // 🗑️ 6. สำหรับแอดมินลบออเดอร์
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  removeOrder(@Param('id') id: string) {
    return this.ordersService.removeOrder(id); 
  }
}