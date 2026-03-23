"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  link: string;
  bgColor: string;
  isActive: boolean;
}

export interface ValueProp {
  id: string;
  title: string;
  description: string;
  color: "blue" | "green" | "purple" | "red" | "orange" | "teal";
}

export interface SiteContent {
  // 히어로 배너
  banners: BannerSlide[];
  // 가치 제안 섹션
  valueSectionTitle: string;
  valueProps: ValueProp[];
  // CTA 섹션
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonText: string;
  ctaLink: string;
  // 인기 상품 섹션
  featuredTitle: string;
  // 푸터
  footerDescription: string;
  footerServices: string[];
  footerEmail: string;
  footerPhone: string;
  footerHours: string;
  footerCopyright: string;
}

const defaultContent: SiteContent = {
  banners: [
    {
      id: "b1",
      title: "자영업자를 위한 셀프 마케팅 플랫폼",
      subtitle: "복잡한 마케팅, 이제 MakeOn에서 간편하게 시작하세요.",
      link: "/products",
      bgColor: "from-blue-600 via-blue-700 to-indigo-800",
      isActive: true,
    },
    {
      id: "b2",
      title: "신규 마케팅 상품 출시",
      subtitle: "SNS 마케팅부터 검색광고까지, 다양한 상품을 만나보세요.",
      link: "/products",
      bgColor: "from-purple-600 via-purple-700 to-indigo-800",
      isActive: true,
    },
    {
      id: "b3",
      title: "이번 달 특별 할인",
      subtitle: "인기 마케팅 상품을 할인된 가격에 만나보세요.",
      link: "/products",
      bgColor: "from-green-600 via-teal-700 to-cyan-800",
      isActive: true,
    },
  ],
  valueSectionTitle: "왜 MakeOn인가요?",
  valueProps: [
    {
      id: "v1",
      title: "원클릭 구매",
      description: "복잡한 상담 없이 원하는 마케팅 상품을 바로 장바구니에 담고 구매하세요.",
      color: "blue",
    },
    {
      id: "v2",
      title: "맞춤형 상품",
      description: "업종과 규모에 맞는 다양한 마케팅 상품을 합리적인 가격에 제공합니다.",
      color: "green",
    },
    {
      id: "v3",
      title: "성과 확인",
      description: "마케팅 진행 후 상세 리포트를 제공하여 투자 대비 효과를 확인할 수 있습니다.",
      color: "purple",
    },
  ],
  ctaTitle: "지금 바로 마케팅을 시작하세요",
  ctaSubtitle: "MakeOn과 함께라면 마케팅이 어렵지 않습니다.",
  ctaButtonText: "상품 보러 가기",
  ctaLink: "/products",
  featuredTitle: "인기 마케팅 상품",
  footerDescription: "자영업자를 위한 셀프 마케팅 플랫폼.\n쉽고 합리적인 가격으로 마케팅을 시작하세요.",
  footerServices: ["SNS 마케팅", "블로그 마케팅", "리뷰 관리", "SEO 최적화"],
  footerEmail: "support@makeon.kr",
  footerPhone: "02-1234-5678",
  footerHours: "평일 09:00 ~ 18:00",
  footerCopyright: "2024 MakeOn. All rights reserved.",
};

interface SiteState {
  content: SiteContent;
  updateContent: (updates: Partial<SiteContent>) => void;
  addBanner: (banner: Omit<BannerSlide, "id">) => void;
  updateBanner: (id: string, updates: Partial<BannerSlide>) => void;
  deleteBanner: (id: string) => void;
  addValueProp: (prop: Omit<ValueProp, "id">) => void;
  updateValueProp: (id: string, updates: Partial<ValueProp>) => void;
  deleteValueProp: (id: string) => void;
}

export const useSiteStore = create<SiteState>()(
  persist(
    (set) => ({
      content: defaultContent,

      updateContent: (updates) =>
        set((state) => ({
          content: { ...state.content, ...updates },
        })),

      addBanner: (banner) =>
        set((state) => ({
          content: {
            ...state.content,
            banners: [
              ...state.content.banners,
              { ...banner, id: `b_${Date.now()}` },
            ],
          },
        })),

      updateBanner: (id, updates) =>
        set((state) => ({
          content: {
            ...state.content,
            banners: state.content.banners.map((b) =>
              b.id === id ? { ...b, ...updates } : b
            ),
          },
        })),

      deleteBanner: (id) =>
        set((state) => ({
          content: {
            ...state.content,
            banners: state.content.banners.filter((b) => b.id !== id),
          },
        })),

      addValueProp: (prop) =>
        set((state) => ({
          content: {
            ...state.content,
            valueProps: [
              ...state.content.valueProps,
              { ...prop, id: `v_${Date.now()}` },
            ],
          },
        })),

      updateValueProp: (id, updates) =>
        set((state) => ({
          content: {
            ...state.content,
            valueProps: state.content.valueProps.map((v) =>
              v.id === id ? { ...v, ...updates } : v
            ),
          },
        })),

      deleteValueProp: (id) =>
        set((state) => ({
          content: {
            ...state.content,
            valueProps: state.content.valueProps.filter((v) => v.id !== id),
          },
        })),
    }),
    {
      name: "makeon-site",
    }
  )
);
