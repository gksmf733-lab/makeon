"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Product, CATEGORY_LABELS } from "@/types/product";
import { useCartStore } from "@/store/cart-store";
import { useSiteStore } from "@/store/site-store";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const categories = useSiteStore((s) => s.content.categories);
  const categoryLabel = categories?.find((c) => c.key === product.category)?.label ?? CATEGORY_LABELS[product.category];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
  };

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <article className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg focus-within:shadow-lg transition-all duration-300 overflow-hidden">
        {/* Image Placeholder */}
        <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center" aria-hidden="true">
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
            {categoryLabel}
          </span>
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 group-focus-visible:text-blue-600 transition-colors">
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
              className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 active:bg-blue-800 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors cursor-pointer"
              aria-label={`${product.name} 장바구니에 담기`}
            >
              <ShoppingCart className="w-4 h-4" aria-hidden="true" />
              담기
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}
