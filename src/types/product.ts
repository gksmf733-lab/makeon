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

export type OrderFieldType =
  | "text"
  | "textarea"
  | "number"
  | "email"
  | "phone"
  | "date"
  | "select"
  | "checkbox"
  | "file";

export const ORDER_FIELD_TYPE_LABELS: Record<OrderFieldType, string> = {
  text: "텍스트",
  textarea: "장문 텍스트",
  number: "숫자",
  email: "이메일",
  phone: "전화번호",
  date: "날짜",
  select: "선택 (드롭다운)",
  checkbox: "체크박스",
  file: "파일 첨부",
};

export interface OrderFormField {
  id: string;
  type: OrderFieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // select 타입일 때 선택지
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
  orderFormFields?: OrderFormField[];
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
