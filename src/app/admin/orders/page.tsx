"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Shield,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ClipboardList,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useOrderStore } from "@/store/order-store";
import { useProductStore } from "@/store/product-store";
import { Order, ORDER_STATUS_LABELS } from "@/types/order";

const STATUS_COLORS: Record<Order["status"], string> = {
  pending: "bg-yellow-50 text-yellow-700",
  confirmed: "bg-blue-50 text-blue-700",
  in_progress: "bg-purple-50 text-purple-700",
  completed: "bg-green-50 text-green-700",
  cancelled: "bg-gray-100 text-gray-500",
};

export default function AdminOrdersPage() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const { orders, updateOrderStatus } = useOrderStore();
  const getProductById = useProductStore((s) => s.getProductById);

  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!currentUser || !isAdmin()) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <Shield className="w-16 h-16 text-red-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          접근 권한이 없습니다
        </h2>
        <Link
          href="/"
          className="inline-block bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors mt-4"
        >
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getFieldLabel = (order: Order, fieldId: string) => {
    const product = getProductById(order.productId);
    const field = product?.orderFormFields?.find((f) => f.id === fieldId);
    return field?.label || fieldId;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin"
          className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold text-gray-900">주문 관리</h1>
          <p className="text-gray-500 mt-1">
            접수된 주문을 확인하고 상태를 관리합니다.
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>접수된 주문이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleExpand(order.id)}
                className="w-full p-5 flex items-center gap-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-400 font-mono">
                      {order.id}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status]}`}
                    >
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 truncate">
                    {order.productName}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span>주문자: {order.userName || "-"}</span>
                    <span>수량: {order.quantity}</span>
                    <span className="font-semibold text-gray-900">
                      {(order.productPrice * order.quantity).toLocaleString()}원
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(order.createdAt).toLocaleString("ko-KR")}
                  </p>
                </div>
                {expandedId === order.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                )}
              </button>

              {expandedId === order.id && (
                <div className="border-t border-gray-100 p-5 bg-gray-50 space-y-4">
                  {/* 주문서 데이터 */}
                  {Object.keys(order.formData).length > 0 ? (
                    <div>
                      <h4 className="text-sm font-bold text-gray-700 mb-3">
                        주문서 정보
                      </h4>
                      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
                        {Object.entries(order.formData).map(
                          ([fieldId, value]) => (
                            <div
                              key={fieldId}
                              className="flex items-start px-4 py-3"
                            >
                              <span className="text-sm font-medium text-gray-500 w-32 shrink-0">
                                {getFieldLabel(order, fieldId)}
                              </span>
                              <span className="text-sm text-gray-900 flex-1">
                                {Array.isArray(value)
                                  ? value.join(", ")
                                  : value || "-"}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">
                      추가 주문 정보가 없습니다.
                    </p>
                  )}

                  {/* 상태 변경 */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-700 mb-2">
                      주문 상태 변경
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(
                        Object.keys(ORDER_STATUS_LABELS) as Order["status"][]
                      ).map((status) => (
                        <button
                          key={status}
                          onClick={() =>
                            updateOrderStatus(order.id, status)
                          }
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                            order.status === status
                              ? `${STATUS_COLORS[status]} ring-2 ring-offset-1 ring-blue-400`
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {ORDER_STATUS_LABELS[status]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
