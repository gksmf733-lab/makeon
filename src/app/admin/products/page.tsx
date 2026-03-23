"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, Trash2, X, Shield, ChevronDown, ChevronUp } from "lucide-react";
import { useProductStore } from "@/store/product-store";
import { useAuthStore } from "@/store/auth-store";
import {
  Product,
  ProductCategory,
  ProductFAQ,
  ProductProcess,
  CATEGORY_LABELS,
} from "@/types/product";

type FormData = {
  name: string;
  description: string;
  price: string;
  category: ProductCategory;
  features: string;
  recommendations: string;
  processSteps: ProductProcess[];
  faqs: ProductFAQ[];
  isActive: boolean;
};

const emptyForm: FormData = {
  name: "",
  description: "",
  price: "",
  category: "sns",
  features: "",
  recommendations: "",
  processSteps: [
    { step: 1, title: "", description: "" },
    { step: 2, title: "", description: "" },
    { step: 3, title: "", description: "" },
    { step: 4, title: "", description: "" },
  ],
  faqs: [
    { question: "", answer: "" },
    { question: "", answer: "" },
  ],
  isActive: true,
};

const inputClass =
  "w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm";

export default function AdminProductsPage() {
  const router = useRouter();
  const { products, addProduct, updateProduct, deleteProduct } =
    useProductStore();
  const currentUser = useAuthStore((s) => s.currentUser);
  const isAdmin = useAuthStore((s) => s.isAdmin);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [showDetail, setShowDetail] = useState(false);

  // Auth guard
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          로그인이 필요합니다
        </h2>
        <p className="text-gray-500 mb-6">
          관리자 페이지에 접근하려면 로그인해 주세요.
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

  if (!isAdmin()) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <Shield className="w-16 h-16 text-red-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          접근 권한이 없습니다
        </h2>
        <p className="text-gray-500 mb-6">
          관리자 계정으로 로그인해 주세요.
        </p>
        <Link
          href="/"
          className="inline-block bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors"
        >
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  const openNewForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowDetail(false);
    setShowForm(true);
  };

  const openEditForm = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      features: product.features.join(", "),
      recommendations: (product.recommendations || []).join(", "),
      processSteps:
        product.processSteps?.length > 0
          ? product.processSteps
          : emptyForm.processSteps,
      faqs:
        product.faqs?.length > 0
          ? product.faqs
          : emptyForm.faqs,
      isActive: product.isActive,
    });
    setEditingId(product.id);
    setShowDetail(false);
    setShowForm(true);
  };

  const updateProcessStep = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    const updated = [...form.processSteps];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, processSteps: updated });
  };

  const addProcessStep = () => {
    setForm({
      ...form,
      processSteps: [
        ...form.processSteps,
        { step: form.processSteps.length + 1, title: "", description: "" },
      ],
    });
  };

  const removeProcessStep = (index: number) => {
    const updated = form.processSteps
      .filter((_, i) => i !== index)
      .map((s, i) => ({ ...s, step: i + 1 }));
    setForm({ ...form, processSteps: updated });
  };

  const updateFAQ = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    const updated = [...form.faqs];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, faqs: updated });
  };

  const addFAQ = () => {
    setForm({
      ...form,
      faqs: [...form.faqs, { question: "", answer: "" }],
    });
  };

  const removeFAQ = (index: number) => {
    setForm({ ...form, faqs: form.faqs.filter((_, i) => i !== index) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      category: form.category,
      image: "",
      features: form.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      recommendations: form.recommendations
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean),
      processSteps: form.processSteps.filter((s) => s.title.trim()),
      faqs: form.faqs.filter((f) => f.question.trim() && f.answer.trim()),
      isActive: form.isActive,
    };

    if (editingId) {
      updateProduct(editingId, productData);
    } else {
      addProduct(productData);
    }
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      deleteProduct(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">상품 관리</h1>
          <p className="text-gray-500 mt-1">
            마케팅 상품을 추가, 수정, 삭제할 수 있습니다.
          </p>
        </div>
        <button
          onClick={openNewForm}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          상품 추가
        </button>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {editingId ? "상품 수정" : "새 상품 추가"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 기본 정보 */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 pb-2 border-b border-gray-200">
                  기본 정보
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    상품명 *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className={inputClass}
                    placeholder="예: 인스타그램 릴스 패키지"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    상품 설명 *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className={`${inputClass} resize-none`}
                    placeholder="상품에 대한 상세 설명을 입력하세요"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      가격 (원) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                      className={inputClass}
                      placeholder="290000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      카테고리
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          category: e.target.value as ProductCategory,
                        })
                      }
                      className={inputClass}
                    >
                      {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    포함 사항 (쉼표로 구분)
                  </label>
                  <input
                    type="text"
                    value={form.features}
                    onChange={(e) =>
                      setForm({ ...form, features: e.target.value })
                    }
                    className={inputClass}
                    placeholder="기능1, 기능2, 기능3"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={form.isActive}
                    onChange={(e) =>
                      setForm({ ...form, isActive: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">
                    활성화 (상품 목록에 노출)
                  </label>
                </div>
              </div>

              {/* 상세 정보 토글 */}
              <button
                type="button"
                onClick={() => setShowDetail(!showDetail)}
                className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 w-full py-2"
              >
                {showDetail ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
                상세페이지 내용 편집 (추천 대상, 진행 과정, FAQ)
              </button>

              {showDetail && (
                <div className="space-y-6 border-t border-gray-100 pt-5">
                  {/* 추천 대상 */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 pb-2 border-b border-gray-200 mb-3">
                      추천 대상 (쉼표로 구분)
                    </h3>
                    <input
                      type="text"
                      value={form.recommendations}
                      onChange={(e) =>
                        setForm({ ...form, recommendations: e.target.value })
                      }
                      className={inputClass}
                      placeholder="마케팅을 처음 시작하는 자영업자, 비용 대비 효과적인 마케팅을 원하시는 분"
                    />
                  </div>

                  {/* 진행 과정 */}
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-gray-200 mb-3">
                      <h3 className="text-sm font-bold text-gray-900">
                        진행 과정
                      </h3>
                      <button
                        type="button"
                        onClick={addProcessStep}
                        className="text-xs text-blue-600 font-semibold hover:text-blue-700"
                      >
                        + 단계 추가
                      </button>
                    </div>
                    <div className="space-y-3">
                      {form.processSteps.map((step, i) => (
                        <div
                          key={i}
                          className="flex gap-3 items-start bg-gray-50 p-3 rounded-lg"
                        >
                          <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={step.title}
                              onChange={(e) =>
                                updateProcessStep(i, "title", e.target.value)
                              }
                              className={inputClass}
                              placeholder="단계 제목"
                            />
                            <input
                              type="text"
                              value={step.description}
                              onChange={(e) =>
                                updateProcessStep(
                                  i,
                                  "description",
                                  e.target.value
                                )
                              }
                              className={inputClass}
                              placeholder="설명"
                            />
                          </div>
                          {form.processSteps.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeProcessStep(i)}
                              className="text-gray-400 hover:text-red-500 mt-0.5"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* FAQ */}
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-gray-200 mb-3">
                      <h3 className="text-sm font-bold text-gray-900">
                        자주 묻는 질문 (FAQ)
                      </h3>
                      <button
                        type="button"
                        onClick={addFAQ}
                        className="text-xs text-blue-600 font-semibold hover:text-blue-700"
                      >
                        + 질문 추가
                      </button>
                    </div>
                    <div className="space-y-3">
                      {form.faqs.map((faq, i) => (
                        <div
                          key={i}
                          className="bg-gray-50 p-3 rounded-lg space-y-2"
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-xs font-bold text-blue-600 mt-2.5 shrink-0">
                              Q.
                            </span>
                            <input
                              type="text"
                              value={faq.question}
                              onChange={(e) =>
                                updateFAQ(i, "question", e.target.value)
                              }
                              className={`${inputClass} flex-1`}
                              placeholder="질문을 입력하세요"
                            />
                            {form.faqs.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeFAQ(i)}
                                className="text-gray-400 hover:text-red-500 mt-2"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-xs font-bold text-gray-500 mt-2.5 shrink-0">
                              A.
                            </span>
                            <textarea
                              value={faq.answer}
                              onChange={(e) =>
                                updateFAQ(i, "answer", e.target.value)
                              }
                              rows={2}
                              className={`${inputClass} flex-1 resize-none`}
                              placeholder="답변을 입력하세요"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                {editingId ? "수정 완료" : "상품 추가"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  상품명
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  카테고리
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  가격
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  상태
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                      {CATEGORY_LABELS[product.category]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {product.price.toLocaleString()}원
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        product.isActive
                          ? "bg-green-50 text-green-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {product.isActive ? "활성" : "비활성"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditForm(product)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
