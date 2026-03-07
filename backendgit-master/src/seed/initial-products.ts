import type { CreateProductDto } from '../products/dto/create-product.dto';

export const initialProducts: CreateProductDto[] = [
  { id: 1, name: "Monstera Deliciosa", price: 690,
    imageUrl: "https://www.harmony-plants.com/cdn/shop/products/5BCD4C1A-3AC6-4651-87A5-4E3B4E534A39.jpg?v=1707750703q=80&w=800&auto=format&fit=crop",
    stock: 20, tag: "ยอดนิยม" },

  { id: 2, name: "Fiddle Leaf Fig", price: 1290,
    imageUrl: "https://www.dekorcompany.com/cdn/shop/files/HAL8615.png",
    stock: 15, tag: "แนะนำ" },

  { id: 3, name: "Snake Plant", price: 390,
    imageUrl: "https://shop-static.arborday.org/media/0004367_snake-plant.jpeg",
    stock: 30, tag: "ราคาดี" },

  { id: 4, name: "ZZ Plant", price: 590,
    imageUrl: "https://glasswingshop.com/cdn/shop/products/8D2A2069.jpg",
    stock: 25, tag: "ทนทาน" },

  { id: 5, name: "Pothos", price: 290,
    imageUrl: "https://abeautifulmess.com/wp-content/uploads/2023/06/GoldenPothos-1-1024x1024.jpg",
    stock: 40, tag: "มือใหม่" },

  { id: 6, name: "Peace Lily", price: 450,
    imageUrl: "https://radhakrishnaagriculture.in/cdn/shop/files/peacelily.jpg",
    stock: 18, tag: "ออกดอก" },

  { id: 7, name: "Calathea", price: 520,
    imageUrl: "https://cdn.shopify.com/s/files/1/0550/4771/6948/files/Spring_Starter_Pack_Flowers_Instagram_Post_Instagram_Post_7__mMLFt9674J.jpg",
    stock: 16, tag: "ลายสวย" },

  { id: 8, name: "Aloe Vera", price: 240,
    imageUrl: "https://m.media-amazon.com/images/I/41HjuO7VwjL._UF1000,1000_QL80_.jpg",
    stock: 35, tag: "ดูแลง่าย" },

  { id: 9, name: "Philodendron Birkin", price: 650,
    imageUrl: "https://www.moffatts.co.nz/cdn/shop/products/Birkin-whitepot.png?v=1659558097",
    stock: 14, tag: "ดูหรูหรา" },

  { id: 10, name: "Areca Palm", price: 1200,
    imageUrl: "https://potsforplants.ph/cdn/shop/products/areca-palm-palmera-849528_1200x1200.jpg?v=1697027415",
    stock: 12, tag: "ช่วยฟอกอากาศ" },

  { id: 11, name: "Rubber Plant", price: 850,
    imageUrl: "https://shop-static.arborday.org/media/0004362_tineke-variegated-rubber-tree_510.jpeg",
    stock: 17, tag: "สวยทน" },

  { id: 12, name: "Boston Fern", price: 390,
    imageUrl: "https://www.thejunglecollective.com.au/wp-content/uploads/2020/03/1829.-Boston-Fern-_.__e.m.i.l.y_.__.png",
    stock: 28, tag: "เพิ่มความชื้น" },
];
