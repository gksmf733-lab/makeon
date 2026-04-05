"use client";

import Link from "next/link";
import { ShoppingCart, Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { useHydrated } from "@/hooks/useHydrated";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const hydrated = useHydrated();
  const getTotalItems = useCartStore((s) => s.getTotalItems);
  const clearCart = useCartStore((s) => s.clearCart);
  const totalItems = getTotalItems();
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const admin = isAdmin();

  const handleLogout = () => {
    logout();
    clearCart();
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            MakeOn
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/products"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              마케팅 상품
            </Link>
            {hydrated && admin && (
              <Link
                href="/admin"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                관리자
              </Link>
            )}
            <Link href="/cart" className="relative p-2">
              <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-blue-600 transition-colors" />
              {hydrated && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            {hydrated ? (
              currentUser ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {currentUser.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    로그아웃
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="text-sm text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/register"
                    className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    회원가입
                  </Link>
                </div>
              )
            ) : (
              <div className="w-20 h-8" />
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <Link href="/cart" className="relative p-2">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {hydrated && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <Link
              href="/products"
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
            >
              마케팅 상품
            </Link>
            {hydrated && admin && (
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
              >
                관리자
              </Link>
            )}
            <div className="pt-2 border-t border-gray-100">
              {hydrated && currentUser ? (
                <>
                  <div className="py-2 text-sm text-gray-600 flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {currentUser.name}님
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="block py-2 text-red-500 font-medium"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="block py-2 text-blue-600 font-medium"
                  >
                    회원가입
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
