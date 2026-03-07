import 'dotenv/config';
import { connect, model } from 'mongoose';
import { ProductSchema } from '../products/schemas/product.schema';
import { initialProducts } from './initial-products';

const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/bloom_shop';
const Product = model('Product', ProductSchema);

async function run() {
  await connect(MONGO_URI);
  console.log(`🌱 Connected: ${MONGO_URI}`);

  // ลบของเก่าแล้วใส่ใหม่ให้ตรงกับ initialProducts
  await Product.deleteMany({});
  await Product.insertMany(initialProducts);

  // ย้ำ unique/index ของ id
  await Product.collection.createIndex({ id: 1 }, { unique: true });

  console.log(`✅ Seeded ${initialProducts.length} products`);
  process.exit(0);
}

run().catch((err) => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
