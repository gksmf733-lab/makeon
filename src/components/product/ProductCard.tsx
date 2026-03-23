"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Product, CATEGORY_LABELS } from "@/types/product";
import { useCartStore } from "@/store/cart-store";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
  };

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
        {/* Image Placeholder */}
        <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <span className="text-4xl">
            {product.category === "sns" && "📱"}
            {product.category === "blog" && "📝"}
            {product.category === "review" && "⭐"}
            {product.category === "ad" && "📢"}
            {product.category === "seo" && "🔍"}
            {product.category === "design" && "🎨"}
          </span>
        </div>

        <div className="p-5">
          <span className="inline-block text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full mb-3">
            {CATEGORY_LABELS[product.category]}
          </span>
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mb-4 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">
              {product.price.toLocaleString()}원
            </span>
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              담기
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
