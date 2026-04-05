"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSiteStore } from "@/store/site-store";
import { getImage } from "@/lib/image-db";

export default function HeroBanner() {
  const banners = useSiteStore((s) => s.content.banners);
  const activeBanners = banners.filter((b) => b.isActive);

  const [current, setCurrent] = useState(0);
  const [bannerImages, setBannerImages] = useState<Record<string, string>>({});

  // IndexedDB에서 배너 이미지 로드
  useEffect(() => {
    const loadImages = async () => {
      const images: Record<string, string> = {};
      for (const banner of activeBanners) {
        if (banner.imageKey) {
          const dataUrl = await getImage(banner.imageKey);
          if (dataUrl) images[banner.id] = dataUrl;
        }
      }
      setBannerImages(images);
    };
    loadImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [banners]);

  const goTo = useCallback(
    (index: number) => {
      if (activeBanners.length === 0) return;
      setCurrent((index + activeBanners.length) % activeBanners.length);
    },
    [activeBanners.length]
  );

  const prev = () => goTo(current - 1);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, activeBanners.length]);

  if (activeBanners.length === 0) {
    return (
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold">MakeOn</h1>
          <p className="text-lg text-white/80 mt-4">마케팅 플랫폼</p>
        </div>
      </section>
    );
  }

  const slide = activeBanners[current];
  const slideImage = bannerImages[slide.id];

  return (
    <section className="relative overflow-hidden" aria-roledescription="캐러셀" aria-label="프로모션 배너">
      {slideImage ? (
        /* 이미지가 있으면 이미지 자체가 배너 */
        <Link href={slide.link} className="block">
          <div className="relative w-full h-[300px] md:h-[400px] bg-gray-100 border-b border-gray-200">
            <Image
              src={slideImage}
              alt={slide.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </Link>
      ) : (
        /* 이미지 없으면 기존 그라데이션 + 텍스트 */
        <div
          className={`bg-gradient-to-br ${slide.bgColor} text-white`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="max-w-2xl">
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
          </div>
        </div>
      )}

      {/* Navigation Arrows */}
      {activeBanners.length > 1 && (
        <>
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
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2" role="group" aria-label="배너 슬라이드 선택">
            {activeBanners.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-3 h-3 rounded-full transition ${
                  i === current ? "bg-white" : "bg-white/40"
                }`}
                aria-label={`배너 ${i + 1}`}
                aria-current={i === current ? "true" : undefined}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
