"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Order } from "@/types/order";

interface OrderState {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "createdAt">) => string;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  getOrdersByUser: (userId: string) => Order[];
  getOrderById: (id: string) => Order | undefined;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (orderData) => {
        const id = `order_${Date.now()}`;
        const newOrder: Order = {
          ...orderData,
          id,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ orders: [newOrder, ...state.orders] }));
        return id;
      },

      updateOrderStatus: (id, status) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, status } : o
          ),
        }));
      },

      getOrdersByUser: (userId) => {
        return get().orders.filter((o) => o.userId === userId);
      },

      getOrderById: (id) => {
        return get().orders.find((o) => o.id === id);
      },
    }),
    {
      name: "makeon-orders",
    }
  )
);
