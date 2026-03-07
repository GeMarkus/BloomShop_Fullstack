export type Product = {
  id: number;
  name: string;
  price: number;
  stock?: number;
  tag?: string;
  img?: string;        // ✅ เดิมใน frontend
  imageUrl?: string;   // ✅ จาก backend
  description?: string;
};

export type Cart = Record<number, number>;

export type User = {
  _id: string;
  username: string;
  email: string;
};