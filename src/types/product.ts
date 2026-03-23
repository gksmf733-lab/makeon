export interface ContentBlock {
  id: string;
  type: "text" | "image";
  content: string; // text content or image URL
}

export interface ProductFAQ {
  question: string;
  answer: string;
}

export interface ProductProcess {
  step: number;
  title: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  image: string;
  features: string[];
  recommendations: string[];
  processSteps: ProductProcess[];
  faqs: ProductFAQ[];
  contentBlocks: ContentBlock[];
  isActive: boolean;
  createdAt: string;
}

export type ProductCategory =
  | "sns"
  | "blog"
  | "review"
  | "ad"
  | "seo"
  | "design";

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  sns: "SNS 마케팅",
  blog: "블로그 마케팅",
  review: "리뷰 마케팅",
  ad: "광고 대행",
  seo: "SEO 최적화",
  design: "디자인 제작",
};

export interface CartItem {
  product: Product;
  quantity: number;
}
