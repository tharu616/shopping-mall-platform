import http from './http';

export type CartItemDto = {
  id: number;
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
  subtotal: number;
};

export type CartDto = {
  id: number;
  items: CartItemDto[];
  total: number;
};

export async function getCart(): Promise<CartDto> {
  const { data } = await http.get('/cart');
  return data;
}

export async function addToCart(productId: number, quantity: number = 1) {
  const { data } = await http.post('/cart/items', { productId, quantity });
  return data;
}

export async function updateCartItem(itemId: number, quantity: number) {
  const { data } = await http.patch(`/cart/items/${itemId}`, { quantity });
  return data;
}

export async function removeFromCart(itemId: number) {
  await http.delete(`/cart/items/${itemId}`);
}

export async function clearCart() {
  await http.delete('/cart');
}

export async function checkout(shippingAddress?: string) {
  const { data } = await http.post('/cart/checkout', { shippingAddress });
  return data;
}
