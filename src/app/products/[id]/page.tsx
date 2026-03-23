"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ShoppingCart, Check } from "lucide-react";
import { useProductStore } from "@/store/product-store";
import { useCartStore } from "@/store/cart-store";
import { CATEGORY_LABELS } from "@/types/product";
import { useState } from "react";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const getProductById = useProductStore((s) => s.getProductById);
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = getProductById(id as string);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 text-lg">상품을 찾을 수 없습니다.</p>
        <button
          onClick={() => router.push("/products")}
          className="mt-4 text-blue-600 font-medium hover:underline"
        >
          상품 목록으로 돌아가기
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        뒤로가기
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="h-80 md:h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center">
          <span className="text-7xl">
            {product.category === "sns" && "📱"}
            {product.category === "blog" && "📝"}
            {product.category === "review" && "⭐"}
            {product.category === "ad" && "📢"}
            {product.category === "seo" && "🔍"}
            {product.category === "design" && "🎨"}
          </span>
        </div>

        {/* Info */}
        <div>
          <span className="inline-block text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4">
            {CATEGORY_LABELS[product.category]}
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
            {product.name}
          </h1>
          <p className="text-gray-600 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Features */}
          <div className="mb-8">
            <h3 className="font-bold text-gray-900 mb-3">포함 사항</h3>
            <ul className="space-y-2">
              {product.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-600">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Price & Cart */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center justify-between mb-6">
              <span className="text-3xl font-extrabold text-gray-900">
                {product.price.toLocaleString()}원
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-lg font-bold hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-lg font-bold hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-lg transition-colors ${
                  added
                    ? "bg-green-500 text-white"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    담았습니다!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    장바구니 담기
                  </>
                )}
              </button>
            </div>
            <p className="text-right text-gray-500 mt-3 text-sm">
              합계:{" "}
              <span className="font-bold text-gray-900">
                {(product.price * quantity).toLocaleString()}원
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
