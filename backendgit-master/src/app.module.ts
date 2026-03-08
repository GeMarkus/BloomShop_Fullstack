// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRoot(
      'mongodb+srv://BloomShop:123456789Xd@bloomshop.xhhw8ty.mongodb.net/bloom_shop'
    ),

    ProductsModule,
    AuthModule,
    OrdersModule,
  ],
  controllers: [AppController],
})
export class AppModule {}