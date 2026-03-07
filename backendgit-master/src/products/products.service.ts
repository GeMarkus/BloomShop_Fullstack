// src/products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private model: Model<ProductDocument>) {}

  findAll() { return this.model.find().sort({ id: 1 }).lean(); }

  create(dto: CreateProductDto) { return this.model.create(dto); }

  async update(id: number, dto: UpdateProductDto) {
    const doc = await this.model.findOneAndUpdate({ id }, dto, { new: true }).lean();
    if (!doc) throw new NotFoundException('Product not found');
    return doc;
  }

  async remove(id: number) {
    const doc = await this.model.findOneAndDelete({ id }).lean();
    if (!doc) throw new NotFoundException('Product not found');
    return { deleted: true };
  }

  // ⬇️ insert หลายรายการ (ข้ามตัวซ้ำแล้วไปต่อ)
  async createMany(list: CreateProductDto[]) {
    return this.model.insertMany(list, { ordered: false });
  }
}
