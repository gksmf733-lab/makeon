"use client";

import Link from "next/link";
import { ArrowRight, Zap, Target, TrendingUp, Heart, Flame, Compass } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { useProductStore } from "@/store/product-store";
import { useSiteStore } from "@/store/site-store";
import HeroBanner from "@/components/home/HeroBanner";

const ICON_MAP: Record<string, React.ElementType> = {
  blue: Zap,
  green: Target,
  purple: TrendingUp,
  red: Heart,
  orange: Flame,
  teal: Compass,
};

const COLOR_MAP: Record<string, { bg: string; icon: string }> = {
  blue: { bg: "bg-blue-50", icon: "bg-blue-600" },
  green: { bg: "bg-green-50", icon: "bg-green-600" },
  purple: { bg: "bg-purple-50", icon: "bg-purple-600" },
  red: { bg: "bg-red-50", icon: "bg-red-600" },
  orange: { bg: "bg-orange-50", icon: "bg-orange-600" },
  teal: { bg: "bg-teal-50", icon: "bg-teal-600" },
};

export default function HomePage() {
  const getActiveProducts = useProductStore((s) => s.getActiveProducts);
  const content = useSiteStore((s) => s.content);
  const featured = getActiveProducts().slice(0, 4);

  return (
    <div>
      {/* Hero Banner Carousel */}
      <HeroBanner />

      {/* Value Props */}
      {content.valueProps.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">
              {content.valueSectionTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {content.valueProps.map((prop) => {
                const Icon = ICON_MAP[prop.color] || Zap;
                const colors = COLOR_MAP[prop.color] || COLOR_MAP.blue;
                return (
                  <div
                    key={prop.id}
                    className={`text-center p-8 rounded-2xl ${colors.bg}`}
                  >
                    <div
                      className={`w-14 h-14 ${colors.icon} rounded-xl flex items-center justify-center mx-auto mb-4`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {prop.title}
                    </h3>
                    <p className="text-gray-600">{prop.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900">
              {content.featuredTitle}
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
          <h2 className="text-3xl font-extrabold mb-4">{content.ctaTitle}</h2>
          <p className="text-gray-400 mb-8 text-lg">{content.ctaSubtitle}</p>
          <Link
            href={content.ctaLink}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors"
          >
            {content.ctaButtonText}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
