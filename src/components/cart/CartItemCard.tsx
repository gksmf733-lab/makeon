"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem, CATEGORY_LABELS } from "@/types/product";
import { useCartStore, MAX_QUANTITY } from "@/store/cart-store";
import { useSiteStore } from "@/store/site-store";

interface CartItemCardProps {
  item: CartItem;
}

export default function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const categories = useSiteStore((s) => s.content.categories);
  const categoryLabel = categories?.find((c) => c.key === item.product.category)?.label ?? CATEGORY_LABELS[item.product.category];

  return (
    <article className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 p-4 shadow-sm" aria-label={`${item.product.name}, ${item.quantity}개`}>
      {/* Icon */}
      <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center shrink-0" aria-hidden="true">
        <span className="text-2xl">
          {item.product.category === "sns" && "📱"}
          {item.product.category === "blog" && "📝"}
          {item.product.category === "review" && "⭐"}
          {item.product.category === "ad" && "📢"}
          {item.product.category === "seo" && "🔍"}
          {item.product.category === "design" && "🎨"}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <span className="text-xs font-semibold text-blue-600">
          {categoryLabel}
        </span>
        <h3 className="font-bold text-gray-900 truncate">
          {item.product.name}
        </h3>
        <p className="text-sm text-gray-500">
          {item.product.price.toLocaleString()}원
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2" role="group" aria-label={`${item.product.name} 수량 조절`}>
        <button
          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label={`${item.product.name} 수량 줄이기`}
        >
          <Minus className="w-4 h-4" aria-hidden="true" />
        </button>
        <span className="w-8 text-center font-bold" aria-live="polite" aria-atomic="true">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
          disabled={item.quantity >= MAX_QUANTITY}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label={`${item.product.name} 수량 늘리기`}
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Subtotal & Delete */}
      <div className="text-right shrink-0">
        <p className="font-bold text-gray-900">
          {(item.product.price * item.quantity).toLocaleString()}원
        </p>
        <button
          onClick={() => removeItem(item.product.id)}
          className="text-red-400 hover:text-red-600 focus-visible:text-red-600 mt-1 transition-colors"
          aria-label={`${item.product.name} 장바구니에서 삭제`}
        >
          <Trash2 className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
