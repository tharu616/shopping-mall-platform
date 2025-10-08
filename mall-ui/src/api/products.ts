import http from "./http";

export type ProductDto = {
  id?: number;
  sku: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  active: boolean;
};

export async function listProducts() {
  const { data } = await http.get<ProductDto[]>("/products");
  return data;
}

export async function getProduct(id: number) {
  const { data } = await http.get<ProductDto>(`/products/${id}`);
  return data;
}

export async function createProduct(p: ProductDto) {
  // Backend expects full object except id; ensure active default
  const payload = {
    sku: p.sku,
    name: p.name,
    description: p.description,
    price: p.price,
    stock: p.stock,
    active: p.active ?? true
  };
  const { data } = await http.post<ProductDto>("/products", payload);
  return data;
}

export async function updateProduct(id: number, p: ProductDto) {
  // Send path id and full body (without id) to avoid conflicts
  const payload = {
    sku: p.sku,
    name: p.name,
    description: p.description,
    price: p.price,
    stock: p.stock,
    active: p.active ?? true
  };
  const { data } = await http.put<ProductDto>(`/products/${id}`, payload);
  return data;
}

export async function deleteProduct(id: number) {
  await http.delete(`/products/${id}`);
}
