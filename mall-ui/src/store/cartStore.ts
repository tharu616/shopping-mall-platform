// src/store/cartStore.ts
import { create } from 'zustand';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../api/cart';

type CartState = {
  count: number;
  total: number;
  loading: boolean;
  error?: string;
  refresh: () => Promise<void>;
  add: (productId: number, qty?: number) => Promise<void>;
  update: (itemId: number, qty: number) => Promise<void>;
  remove: (itemId: number) => Promise<void>;
  clear: () => Promise<void>;
};

export const useCart = create<CartState>((set) => ({
  count: 0,
  total: 0,
  loading: false,
  error: undefined,
  refresh: async () => {
    set({ loading: true, error: undefined });
    try {
      const cart = await getCart();
      const count = cart.items?.reduce((s, it) => s + it.quantity, 0) ?? 0;
      set({ count, total: cart.total ?? 0, loading: false });
    } catch (e: any) {
      set({ loading: false, error: e?.response?.data?.message || 'Failed to load cart' });
    }
  },
  add: async (pid, qty = 1) => {
    await addToCart(pid, qty);
    await useCart.getState().refresh();
  },
  update: async (iid, qty) => {
    await updateCartItem(iid, qty);
    await useCart.getState().refresh();
  },
  remove: async (iid) => {
    await removeFromCart(iid);
    await useCart.getState().refresh();
  },
  clear: async () => {
    await clearCart();
    await useCart.getState().refresh();
  },
}));
