"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, UserRegisterInput } from "@/types/user";

interface AuthState {
  users: User[];
  currentUser: User | null;
  register: (input: UserRegisterInput) => { success: boolean; message: string };
  login: (username: string, password: string) => { success: boolean; message: string };
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: [],
      currentUser: null,

      register: (input) => {
        const { users } = get();

        if (users.some((u) => u.username === input.username)) {
          return { success: false, message: "이미 사용 중인 아이디입니다." };
        }

        const newUser: User = {
          ...input,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };

        set((state) => ({ users: [...state.users, newUser] }));
        return { success: true, message: "회원가입이 완료되었습니다." };
      },

      login: (username, password) => {
        const { users } = get();
        const user = users.find(
          (u) => u.username === username && u.password === password
        );

        if (!user) {
          return { success: false, message: "아이디 또는 비밀번호가 일치하지 않습니다." };
        }

        set({ currentUser: user });
        return { success: true, message: "로그인 되었습니다." };
      },

      logout: () => {
        set({ currentUser: null });
      },
    }),
    {
      name: "makeon-auth",
    }
  )
);
