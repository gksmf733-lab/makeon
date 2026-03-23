"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BannerSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  link: string;
  bgColor: string;
}

const bannerSlides: BannerSlide[] = [
  {
    id: 1,
    image: "/banners/banner1.png",
    title: "자영업자를 위한 셀프 마케팅 플랫폼",
    subtitle: "복잡한 마케팅, 이제 MakeOn에서 간편하게 시작하세요.",
    link: "/products",
    bgColor: "from-blue-600 via-blue-700 to-indigo-800",
  },
  {
    id: 2,
    image: "/banners/banner2.png",
    title: "신규 마케팅 상품 출시",
    subtitle: "SNS 마케팅부터 검색광고까지, 다양한 상품을 만나보세요.",
    link: "/products",
    bgColor: "from-purple-600 via-purple-700 to-indigo-800",
  },
  {
    id: 3,
    image: "/banners/banner3.png",
    title: "이번 달 특별 할인",
    subtitle: "인기 마케팅 상품을 할인된 가격에 만나보세요.",
    link: "/products",
    bgColor: "from-green-600 via-teal-700 to-cyan-800",
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const goTo = useCallback(
    (index: number) => {
      setCurrent((index + bannerSlides.length) % bannerSlides.length);
    },
    []
  );

  const prev = () => goTo(current - 1);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = bannerSlides[current];

  return (
    <section className="relative overflow-hidden">
      <div
        className={`bg-gradient-to-br ${slide.bgColor} text-white transition-colors duration-700`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Text */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-6">
                {slide.subtitle}
              </p>
              <Link
                href={slide.link}
                className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors"
              >
                자세히 보기 →
              </Link>
            </div>

            {/* Image */}
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden bg-white/10">
                {!imageErrors[slide.id] ? (
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority={current === 0}
                    onError={() =>
                      setImageErrors((prev) => ({
                        ...prev,
                        [slide.id]: true,
                      }))
                    }
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white/50 text-sm">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🖼️</div>
                      <p>배너 이미지</p>
                      <p className="text-xs mt-1">{slide.image}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur transition"
        aria-label="이전 배너"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur transition"
        aria-label="다음 배너"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {bannerSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-3 h-3 rounded-full transition ${
              i === current ? "bg-white" : "bg-white/40"
            }`}
            aria-label={`배너 ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
