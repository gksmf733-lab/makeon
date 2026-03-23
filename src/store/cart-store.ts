"use client";

import { create } from "zustand";
import { CartItem, Product } from "@/types/product";

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("makeon-cart");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (items: CartItem[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("makeon-cart", JSON.stringify(items));
};

export const useCartStore = create<CartState>((set, get) => ({
  items: loadCartFromStorage(),

  addItem: (product, quantity = 1) => {
    set((state) => {
      const existing = state.items.find(
        (item) => item.product.id === product.id
      );
      let newItems: CartItem[];
      if (existing) {
        newItems = state.items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, { product, quantity }];
      }
      saveCartToStorage(newItems);
      return { items: newItems };
    });
  },

  removeItem: (productId) => {
    set((state) => {
      const newItems = state.items.filter(
        (item) => item.product.id !== productId
      );
      saveCartToStorage(newItems);
      return { items: newItems };
    });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity < 1) return;
    set((state) => {
      const newItems = state.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      saveCartToStorage(newItems);
      return { items: newItems };
    });
  },

  clearCart: () => {
    saveCartToStorage([]);
    set({ items: [] });
  },

  getTotalPrice: () => {
    return get().items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  },

  getTotalItems: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
