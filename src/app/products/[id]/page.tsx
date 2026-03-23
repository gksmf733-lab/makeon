"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShoppingCart,
  Check,
  Clock,
  FileText,
  MessageCircle,
  Star,
} from "lucide-react";
import { useProductStore } from "@/store/product-store";
import { useCartStore } from "@/store/cart-store";
import { CATEGORY_LABELS } from "@/types/product";
import ProductCard from "@/components/product/ProductCard";
import { useState } from "react";

const CATEGORY_EMOJI: Record<string, string> = {
  sns: "📱",
  blog: "📝",
  review: "⭐",
  ad: "📢",
  seo: "🔍",
  design: "🎨",
};

type Tab = "description" | "process" | "faq";

const defaultProcess = [
  { step: 1, title: "상담 및 분석", description: "비즈니스 현황을 파악하고 최적의 마케팅 전략을 수립합니다." },
  { step: 2, title: "기획 및 제작", description: "분석 결과를 바탕으로 맞춤형 콘텐츠를 기획하고 제작합니다." },
  { step: 3, title: "실행 및 운영", description: "제작된 콘텐츠를 최적의 타이밍에 배포하고 운영합니다." },
  { step: 4, title: "리포트 제공", description: "마케팅 성과를 분석하여 상세한 리포트를 제공합니다." },
];

const defaultFAQs = [
  { question: "작업 기간은 얼마나 걸리나요?", answer: "상품에 따라 다르지만, 보통 결제 후 3~7영업일 내에 첫 결과물이 전달됩니다." },
  { question: "수정은 가능한가요?", answer: "네, 기본 수정 횟수가 포함되어 있으며 추가 수정도 협의 가능합니다." },
  { question: "환불 규정은 어떻게 되나요?", answer: "작업 시작 전까지 전액 환불이 가능하며, 작업 시작 후에는 진행률에 따라 부분 환불됩니다." },
  { question: "결과물의 저작권은 누구에게 있나요?", answer: "납품 완료된 결과물의 저작권은 고객에게 귀속됩니다." },
];

const defaultRecommendations = [
  "마케팅을 처음 시작하는 자영업자",
  "비용 대비 효과적인 마케팅을 원하시는 분",
  "전문적인 마케팅 대행을 찾고 계신 분",
];

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const getProductById = useProductStore((s) => s.getProductById);
  const getProductsByCategory = useProductStore(
    (s) => s.getProductsByCategory
  );
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("description");

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

  const relatedProducts = getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const processSteps =
    product.processSteps?.length > 0 ? product.processSteps : defaultProcess;
  const faqs = product.faqs?.length > 0 ? product.faqs : defaultFAQs;
  const recommendations =
    product.recommendations?.length > 0
      ? product.recommendations
      : defaultRecommendations;

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    {
      key: "description",
      label: "상품 상세",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      key: "process",
      label: "진행 과정",
      icon: <Clock className="w-4 h-4" />,
    },
    {
      key: "faq",
      label: "자주 묻는 질문",
      icon: <MessageCircle className="w-4 h-4" />,
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">
              홈
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-blue-600">
              마케팅 상품
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Image + Tabs */}
          <div className="lg:col-span-3 space-y-6">
            {/* Product Image */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="h-72 md:h-96 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <span className="text-8xl">
                  {CATEGORY_EMOJI[product.category]}
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="flex border-b border-gray-100">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors ${
                      activeTab === tab.key
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6 md:p-8">
                {activeTab === "description" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        상품 소개
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* 블로그형 콘텐츠 블록 */}
                    {product.contentBlocks && product.contentBlocks.length > 0 && (
                      <div className="space-y-5">
                        {product.contentBlocks.map((block) => (
                          <div key={block.id}>
                            {block.type === "text" ? (
                              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {block.content}
                              </p>
                            ) : (
                              <div className="rounded-xl overflow-hidden">
                                <img
                                  src={block.content}
                                  alt=""
                                  className="w-full object-contain"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        포함 사항
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {product.features.map((feature, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 bg-green-50 p-3 rounded-lg"
                          >
                            <Check className="w-5 h-5 text-green-600 shrink-0" />
                            <span className="text-gray-700 font-medium">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        이런 분께 추천합니다
                      </h3>
                      <ul className="space-y-2 text-gray-600">
                        {recommendations.map((rec, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === "process" && (
                  <div className="space-y-1">
                    {processSteps.map((item) => (
                      <div
                        key={item.step}
                        className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition"
                      >
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">
                          {item.step}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">
                            {item.title}
                          </h4>
                          <p className="text-gray-500 text-sm mt-1">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "faq" && (
                  <div className="space-y-4">
                    {faqs.map((item, i) => (
                      <div
                        key={i}
                        className="border border-gray-100 rounded-xl p-5"
                      >
                        <h4 className="font-bold text-gray-900 mb-2">
                          Q. {item.question}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          A. {item.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Purchase Panel (sticky) */}
          <div className="lg:col-span-2">
            <div className="sticky top-20 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <span className="inline-block text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-3">
                  {CATEGORY_LABELS[product.category]}
                </span>
                <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                  {product.description}
                </p>

                <div className="border-t border-gray-100 pt-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">가격</span>
                    <span className="text-2xl font-extrabold text-gray-900">
                      {product.price.toLocaleString()}원
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm text-gray-500">수량</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setQuantity(Math.max(1, quantity - 1))
                        }
                        className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-lg font-bold hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-bold text-lg">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-lg font-bold hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl mb-5">
                    <span className="font-semibold text-gray-700">
                      총 금액
                    </span>
                    <span className="text-xl font-extrabold text-blue-600">
                      {(product.price * quantity).toLocaleString()}원
                    </span>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-lg transition-colors ${
                      added
                        ? "bg-green-500 text-white"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-5 h-5" />
                        장바구니에 담았습니다!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        장바구니 담기
                      </>
                    )}
                  </button>

                  <Link
                    href="/cart"
                    className="block text-center text-sm text-gray-500 hover:text-blue-600 mt-3 font-medium"
                  >
                    장바구니 바로가기 →
                  </Link>
                </div>
              </div>

              {/* Quick Info */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 mb-3 text-sm">
                  안내 사항
                </h3>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    평균 작업 기간: 3~7영업일
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    결과 리포트 제공
                  </li>
                  <li className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-blue-500" />
                    1:1 담당자 배정
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
              관련 상품
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
