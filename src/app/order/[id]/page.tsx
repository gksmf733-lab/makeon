"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingBag,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useProductStore } from "@/store/product-store";
import { useAuthStore } from "@/store/auth-store";
import { useOrderStore } from "@/store/order-store";
import { OrderFormField } from "@/types/product";

const inputClass =
  "w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm";

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export default function OrderPage() {
  const { id } = useParams();
  const router = useRouter();
  const getProductById = useProductStore((s) => s.getProductById);
  const currentUser = useAuthStore((s) => s.currentUser);
  const addOrder = useOrderStore((s) => s.addOrder);

  const product = getProductById(id as string);
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  if (!product) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          상품을 찾을 수 없습니다
        </h2>
        <Link
          href="/products"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors mt-4"
        >
          상품 목록으로
        </Link>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          로그인이 필요합니다
        </h2>
        <p className="text-gray-500 mb-6">
          주문서를 작성하려면 먼저 로그인해 주세요.
        </p>
        <Link
          href="/login"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
        >
          로그인하기
        </Link>
      </div>
    );
  }

  const fields: OrderFormField[] = product.orderFormFields || [];

  const updateField = (fieldId: string, value: string) => {
    setFormData({ ...formData, [fieldId]: value });
    if (errors[fieldId]) {
      setErrors({ ...errors, [fieldId]: false });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const newErrors: Record<string, boolean> = {};
    for (const field of fields) {
      if (field.required && !formData[field.id]?.trim()) {
        newErrors[field.id] = true;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newOrderId = addOrder({
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      quantity,
      formData,
      userId: currentUser.id,
      userName: currentUser.name,
      status: "pending",
    });

    setOrderId(newOrderId);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          주문이 접수되었습니다
        </h2>
        <p className="text-gray-500 mb-2">주문번호: {orderId}</p>
        <p className="text-gray-500 mb-6">
          확인 후 순차적으로 연락드리겠습니다.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/products"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            다른 상품 보기
          </Link>
          <Link
            href="/"
            className="inline-block bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
          >
            홈으로
          </Link>
        </div>
      </div>
    );
  }

  const renderField = (field: OrderFormField) => {
    const hasError = errors[field.id];
    const errorBorder = hasError ? "border-red-400 focus:ring-red-500" : "";

    switch (field.type) {
      case "textarea":
        return (
          <textarea
            rows={4}
            value={formData[field.id] || ""}
            onChange={(e) => updateField(field.id, e.target.value)}
            className={`${inputClass} ${errorBorder} resize-none`}
            placeholder={field.placeholder || ""}
          />
        );
      case "select":
        return (
          <select
            value={formData[field.id] || ""}
            onChange={(e) => updateField(field.id, e.target.value)}
            className={`${inputClass} ${errorBorder}`}
          >
            <option value="">선택하세요</option>
            {(field.options || []).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
      case "checkbox":
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData[field.id] === "true"}
              onChange={(e) =>
                updateField(field.id, e.target.checked ? "true" : "")
              }
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm text-gray-700">
              {field.placeholder || "동의합니다"}
            </span>
          </label>
        );
      case "phone":
        return (
          <input
            type="tel"
            value={formData[field.id] || ""}
            onChange={(e) =>
              updateField(field.id, formatPhone(e.target.value))
            }
            className={`${inputClass} ${errorBorder}`}
            placeholder={field.placeholder || "010-0000-0000"}
          />
        );
      case "date":
        return (
          <input
            type="date"
            value={formData[field.id] || ""}
            onChange={(e) => updateField(field.id, e.target.value)}
            className={`${inputClass} ${errorBorder}`}
          />
        );
      case "number":
        return (
          <input
            type="number"
            value={formData[field.id] || ""}
            onChange={(e) => updateField(field.id, e.target.value)}
            className={`${inputClass} ${errorBorder}`}
            placeholder={field.placeholder || ""}
          />
        );
      case "email":
        return (
          <input
            type="email"
            value={formData[field.id] || ""}
            onChange={(e) => updateField(field.id, e.target.value)}
            className={`${inputClass} ${errorBorder}`}
            placeholder={field.placeholder || "example@email.com"}
          />
        );
      case "file":
        return (
          <div>
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) updateField(field.id, file.name);
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-400 mt-1">
              {field.placeholder || "파일을 선택하세요"}
            </p>
          </div>
        );
      default:
        return (
          <input
            type="text"
            value={formData[field.id] || ""}
            onChange={(e) => updateField(field.id, e.target.value)}
            className={`${inputClass} ${errorBorder}`}
            placeholder={field.placeholder || ""}
          />
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">주문서 작성</h1>
          <p className="text-gray-500 text-sm mt-0.5">{product.name}</p>
        </div>
      </div>

      {/* 상품 정보 요약 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900">{product.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{product.description}</p>
          </div>
          <div className="text-right shrink-0 ml-4">
            <p className="text-lg font-extrabold text-blue-600">
              {product.price.toLocaleString()}원
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">수량</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600"
            >
              -
            </button>
            <span className="w-8 text-center font-bold">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600"
            >
              +
            </button>
          </div>
          <div className="ml-auto">
            <span className="text-sm text-gray-500">합계 </span>
            <span className="font-bold text-gray-900">
              {(product.price * quantity).toLocaleString()}원
            </span>
          </div>
        </div>
      </div>

      {/* 주문서 양식 */}
      <form onSubmit={handleSubmit}>
        {fields.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
              주문 정보 입력
            </h3>
            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  {renderField(field)}
                  {errors[field.id] && (
                    <p className="text-xs text-red-500 mt-1">
                      필수 항목입니다.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {fields.length === 0 && (
          <div className="bg-gray-50 rounded-2xl p-6 mb-6 text-center text-gray-500 text-sm">
            추가 입력 항목이 없습니다. 바로 주문하실 수 있습니다.
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors"
        >
          주문하기 ({(product.price * quantity).toLocaleString()}원)
        </button>
      </form>
    </div>
  );
}
