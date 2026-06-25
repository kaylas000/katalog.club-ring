import { create } from "zustand";
import type { Product } from "@/lib/types";

export interface CartItem {
  product: Product;
  quantity: number;
  variant: string;
}

interface CartState {
  items: CartItem[];
  addToCart: (product: Product, variant: string) => void;
  removeFromCart: (productId: string, variant: string) => void;
  updateQuantity: (productId: string, variant: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

export const useCart = create<CartState>((set, get) => ({
  items: [],

  addToCart: (product, variant) =>
    set((state) => {
      const existing = state.items.find(
        (i) => i.product.id === product.id && i.variant === variant
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id && i.variant === variant
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { items: [...state.items, { product, quantity: 1, variant }] };
    }),

  removeFromCart: (productId, variant) =>
    set((state) => ({
      items: state.items.filter(
        (i) => !(i.product.id === productId && i.variant === variant)
      ),
    })),

  updateQuantity: (productId, variant, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return {
          items: state.items.filter(
            (i) => !(i.product.id === productId && i.variant === variant)
          ),
        };
      }
      return {
        items: state.items.map((i) =>
          i.product.id === productId && i.variant === variant
            ? { ...i, quantity }
            : i
        ),
      };
    }),

  clearCart: () => set({ items: [] }),

  get totalItems() {
    return get().items.reduce((sum, i) => sum + i.quantity, 0);
  },

  get totalPrice() {
    return get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  },
}));
