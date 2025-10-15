// src/api/products.ts
import http from '../api/http';

export type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
};

export async function listProducts(): Promise<Product[]> {
  const { data } = await http.get('/products');
  return data;
}
