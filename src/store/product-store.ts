"use client";

import { create } from "zustand";
import { Product, ProductCategory } from "@/types/product";
import { initialProducts } from "@/data/products";

interface ProductState {
  products: Product[];
  addProduct: (product: Omit<Product, "id" | "createdAt">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: ProductCategory) => Product[];
  getActiveProducts: () => Product[];
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: initialProducts,

  addProduct: (productData) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    set((state) => ({ products: [...state.products, newProduct] }));
  },

  updateProduct: (id, updates) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    }));
  },

  deleteProduct: (id) => {
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    }));
  },

  getProductById: (id) => {
    return get().products.find((p) => p.id === id);
  },

  getProductsByCategory: (category) => {
    return get().products.filter(
      (p) => p.category === category && p.isActive
    );
  },

  getActiveProducts: () => {
    return get().products.filter((p) => p.isActive);
  },
}));
