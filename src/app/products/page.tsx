"use client";

import { useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import { useProductStore } from "@/store/product-store";
import { useSiteStore } from "@/store/site-store";
import { CATEGORY_LABELS } from "@/types/product";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const getActiveProducts = useProductStore((s) => s.getActiveProducts);
  const getProductsByCategory = useProductStore(
    (s) => s.getProductsByCategory
  );
  const categories = useSiteStore((s) => s.content.categories);

  const activeCategories = categories?.filter((c) => c.isActive) ?? [];

  const products =
    selectedCategory === "all"
      ? getActiveProducts()
      : getProductsByCategory(selectedCategory as never);

  // 동적 카테고리 라벨 (store 우선, fallback으로 기존 CATEGORY_LABELS)
  const getCategoryLabel = (key: string) => {
    const found = categories?.find((c) => c.key === key);
    return found?.label ?? CATEGORY_LABELS[key as keyof typeof CATEGORY_LABELS] ?? key;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
        마케팅 상품
      </h1>
      <p className="text-gray-500 mb-8">
        비즈니스에 딱 맞는 마케팅 상품을 선택하세요.
      </p>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === "all"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          전체
        </button>
        {activeCategories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat.key
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          해당 카테고리에 상품이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
