"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Trash2 } from "lucide-react";
import CartItemCard from "@/components/cart/CartItemCard";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { useHydrated } from "@/hooks/useHydrated";

export default function CartPage() {
  const router = useRouter();
  const { items, clearCart, getTotalPrice } = useCartStore();
  const totalPrice = getTotalPrice();
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="mt-4 text-gray-500 text-sm">로딩 중...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          장바구니가 비어있습니다
        </h2>
        <p className="text-gray-500 mb-6">마케팅 상품을 둘러보세요.</p>
        <Link
          href="/products"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
        >
          상품 보러 가기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">장바구니</h1>
        <button
          onClick={() => {
            if (window.confirm("장바구니를 비우시겠습니까?")) {
              clearCart();
            }
          }}
          className="flex items-center gap-1.5 text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          전체 삭제
        </button>
      </div>

      {/* Cart Items */}
      <div className="space-y-3 mb-8">
        {items.map((item) => (
          <CartItemCard key={item.product.id} item={item} />
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-500">상품 수</span>
          <span className="font-medium">{items.length}개</span>
        </div>
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4">
          <span className="text-lg font-bold text-gray-900">총 결제 금액</span>
          <span className="text-2xl font-extrabold text-blue-600">
            {totalPrice.toLocaleString()}원
          </span>
        </div>
        <button
          onClick={() => {
            const currentUser = useAuthStore.getState().currentUser;
            if (!currentUser) {
              if (window.confirm("로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?")) {
                router.push("/login");
              }
              return;
            }
            alert("결제 기능은 준비 중입니다. 빠른 시일 내에 제공하겠습니다.");
          }}
          className="w-full mt-6 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors"
        >
          구매하기
        </button>
      </div>
    </div>
  );
}
