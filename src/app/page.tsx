"use client";

import Link from "next/link";
import { ArrowRight, Zap, Target, TrendingUp } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { useProductStore } from "@/store/product-store";

export default function HomePage() {
  const getActiveProducts = useProductStore((s) => s.getActiveProducts);
  const featured = getActiveProducts().slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              자영업자를 위한
              <br />
              <span className="text-yellow-300">셀프 마케팅</span> 플랫폼
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
              복잡한 마케팅, 이제 MakeOn에서 원하는 상품을 골라
              <br className="hidden md:block" />
              간편하게 구매하고 바로 시작하세요.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors"
              >
                상품 둘러보기
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">
            왜 MakeOn인가요?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-blue-50">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                원클릭 구매
              </h3>
              <p className="text-gray-600">
                복잡한 상담 없이 원하는 마케팅 상품을 바로 장바구니에 담고
                구매하세요.
              </p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-green-50">
              <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                맞춤형 상품
              </h3>
              <p className="text-gray-600">
                업종과 규모에 맞는 다양한 마케팅 상품을 합리적인 가격에
                제공합니다.
              </p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-purple-50">
              <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                성과 확인
              </h3>
              <p className="text-gray-600">
                마케팅 진행 후 상세 리포트를 제공하여 투자 대비 효과를 확인할 수
                있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900">
              인기 마케팅 상품
            </h2>
            <Link
              href="/products"
              className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1"
            >
              전체보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold mb-4">
            지금 바로 마케팅을 시작하세요
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            MakeOn과 함께라면 마케팅이 어렵지 않습니다.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors"
          >
            상품 보러 가기
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
