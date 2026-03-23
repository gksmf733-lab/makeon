export interface Order {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  formData: Record<string, string | string[]>; // field id -> value
  userId?: string;
  userName?: string;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
}

export const ORDER_STATUS_LABELS: Record<Order["status"], string> = {
  pending: "대기",
  confirmed: "확인",
  in_progress: "진행중",
  completed: "완료",
  cancelled: "취소",
};
