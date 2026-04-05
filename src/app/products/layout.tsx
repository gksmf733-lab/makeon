import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "마케팅 상품",
  description:
    "자영업자를 위한 SNS 마케팅, 블로그 마케팅, 리뷰 관리, SEO 최적화 등 다양한 마케팅 상품을 만나보세요.",
  openGraph: {
    title: "마케팅 상품 | MakeOn",
    description:
      "자영업자를 위한 SNS 마케팅, 블로그 마케팅, 리뷰 관리, SEO 최적화 등 다양한 마케팅 상품을 만나보세요.",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
