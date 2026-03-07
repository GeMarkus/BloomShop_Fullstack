// orders.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order } from './schemas/order.schema';
import { Product } from '../products/schemas/product.schema';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order.name) private readonly orderModel: Model<Order>,
        @InjectModel(Product.name) private readonly productModel: Model<Product>,
    ) { }

    async createOrder(userId: string | Types.ObjectId, dto: CreateOrderDto) {
        const uid = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
        if (!uid) throw new BadRequestException('Invalid user');

        const map = new Map<number, number>();
        for (const it of dto.items ?? []) {
            const pid = Number(it.productId);
            const qty = Number(it.qty);
            if (!Number.isInteger(pid) || !Number.isInteger(qty) || qty < 1) continue;
            map.set(pid, (map.get(pid) ?? 0) + qty);
        }
        if (map.size === 0) throw new BadRequestException('No valid items');

        const ids = [...map.keys()];
        const prods = await this.productModel
            .find({ id: { $in: ids } }, { id: 1, price: 1, name: 1 })
            .lean();

        const priceById = new Map<number, number>(prods.map(p => [p.id as number, p.price as number]));
        const missing = ids.filter(id => !priceById.has(id));
        if (missing.length) {
            throw new BadRequestException(`Unknown product ids: ${missing.join(', ')}`);
        }

        let serverTotal = 0;
        const items = ids.map(id => {
            const qty = map.get(id)!;
            const unitPrice = priceById.get(id)!;
            const lineTotal = unitPrice * qty;
            serverTotal += lineTotal;
            return { productId: id, qty, unitPrice, lineTotal };
        });

        const doc = await this.orderModel.create({
            userId: uid,
            method: dto.method,
            items,
            total: serverTotal,
            status: 'pending',
            createdAt: new Date(),
        });

        return {
            _id: doc._id,
            total: serverTotal,
            items,
            status: doc.status,
        };
    }

    async findMyOrders(userId: string, page = 1, limit = 10) {
        if (!userId) throw new BadRequestException('No user');
        const uid = new Types.ObjectId(userId);

        const p = Math.max(1, page);
        const l = Math.min(50, Math.max(1, limit));

        const [items, total] = await Promise.all([
            this.orderModel
                .find(
                    { userId: uid }, 
                    // ✅ ดึง shippingAddress ออกมาโชว์ที่หน้า "คำสั่งซื้อของฉัน"
                    { items: 1, total: 1, status: 1, createdAt: 1, method: 1, shippingAddress: 1 } 
                )
                .sort({ createdAt: -1 })
                .skip((p - 1) * l)
                .limit(l)
                .lean(),
            this.orderModel.countDocuments({ userId: uid }), 
        ]);

        return { page: p, limit: l, total, pages: Math.ceil(total / l), items };
    }
    
    // ✅ ฟังก์ชันอัปเดตที่อยู่ (ปรับปรุงให้เขียนลง DB ได้แม่นยำขึ้น)
    async addShippingAddress(orderId: string, userId: string, shippingAddress: string , shippingFee: number, total: number) {
        if (!shippingAddress || !shippingAddress.trim()) {
            throw new BadRequestException('Shipping address is required');
        }

        if (!Types.ObjectId.isValid(orderId)) {
            throw new BadRequestException('Invalid order id');
        }

        const uid = new Types.ObjectId(userId);

        // ✅ ใช้ findOneAndUpdate เพื่อบันทึกลง Database ทันทีและแม่นยำกว่า
        const updatedOrder = await this.orderModel.findOneAndUpdate(
            { 
                _id: new Types.ObjectId(orderId), 
                userId: uid 
            },
            { 
                $set: { 
                    shippingAddress: shippingAddress,
                    shippingFee: shippingFee, // บันทึกค่าขนส่งลง DB
                    total: total              // อัปเดตยอดรวมให้ถูกต้อง
                } 
            },
            { new: true }
        );

        if (!updatedOrder) {
            throw new NotFoundException('Order not found or not belonging to user');
        }

        return {
            message: 'Shipping and Total updated successfully',
            orderId: updatedOrder._id,
            shippingAddress: updatedOrder.shippingAddress,
            total: updatedOrder.total, // ส่งค่าใหม่กลับไปยืนยัน
        };
    }
    
    // เพิ่มเข้าไปใน class OrdersService
    async findAllOrdersForAdmin() {
    return this.orderModel
        .find()
        .populate('userId', 'username') // ดึงชื่อลูกค้า
        .populate('items.productId')    // 🌟 สำคัญ! ต้อง populate ตรงนี้เพื่อให้ได้ 'name' และ 'image' ของต้นไม้มาโชว์
        .sort({ createdAt: -1 })
        .lean();
    }

    async updateOrderStatus(orderId: string, status: string) {
    // อัปเดตสถานะ เช่น pending -> paid
    return this.orderModel.findByIdAndUpdate(
        orderId, 
        { status }, 
        { new: true }
    ).exec();
    }
    
    // backend/src/orders/orders.service.ts

    async removeOrder(orderId: string) {
        if (!Types.ObjectId.isValid(orderId)) {
            throw new BadRequestException('ID ออเดอร์ไม่ถูกต้องนะมึง');
        }
        const result = await this.orderModel.findByIdAndDelete(orderId);
        if (!result) throw new NotFoundException('ไม่เจอออเดอร์ที่จะลบ');
        return { message: 'ลบออเดอร์เรียบร้อยแล้ว' };
    }
}