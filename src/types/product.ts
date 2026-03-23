export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  image: string;
  features: string[];
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
