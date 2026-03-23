"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Shield,
  ChevronDown,
  ChevronUp,
  Type,
  ImageIcon,
  GripVertical,
  ArrowUp,
  ArrowDown,
  ClipboardList,
} from "lucide-react";
import { useProductStore } from "@/store/product-store";
import { useAuthStore } from "@/store/auth-store";
import { useSiteStore } from "@/store/site-store";
import {
  Product,
  ProductCategory,
  ProductFAQ,
  ProductProcess,
  ContentBlock,
  OrderFormField,
  OrderFieldType,
  ORDER_FIELD_TYPE_LABELS,
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
  contentBlocks: ContentBlock[];
  orderFormFields: OrderFormField[];
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
  contentBlocks: [],
  orderFormFields: [],
  isActive: true,
};

const inputClass =
  "w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm";

function generateBlockId() {
  return `block_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const { products, addProduct, updateProduct, deleteProduct } =
    useProductStore();
  const currentUser = useAuthStore((s) => s.currentUser);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const siteCategories = useSiteStore((s) => s.content.categories);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [showDetail, setShowDetail] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

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
        product.faqs?.length > 0 ? product.faqs : emptyForm.faqs,
      contentBlocks: product.contentBlocks || [],
      orderFormFields: product.orderFormFields || [],
      isActive: product.isActive,
    });
    setEditingId(product.id);
    setShowDetail(false);
    setShowForm(true);
  };

  // Content block helpers
  const addContentBlock = (type: "text" | "image") => {
    const newBlock: ContentBlock = {
      id: generateBlockId(),
      type,
      content: "",
    };
    setForm({ ...form, contentBlocks: [...form.contentBlocks, newBlock] });
  };

  const updateContentBlock = (id: string, content: string) => {
    setForm({
      ...form,
      contentBlocks: form.contentBlocks.map((b) =>
        b.id === id ? { ...b, content } : b
      ),
    });
  };

  const removeContentBlock = (id: string) => {
    setForm({
      ...form,
      contentBlocks: form.contentBlocks.filter((b) => b.id !== id),
    });
  };

  const moveContentBlock = (index: number, direction: "up" | "down") => {
    const blocks = [...form.contentBlocks];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= blocks.length) return;
    [blocks[index], blocks[target]] = [blocks[target], blocks[index]];
    setForm({ ...form, contentBlocks: blocks });
  };

  const handleImageUpload = (blockId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      updateContentBlock(blockId, dataUrl);
    };
    reader.readAsDataURL(file);
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

  // Order form field helpers
  const addOrderField = () => {
    const newField: OrderFormField = {
      id: `field_${Date.now()}`,
      type: "text",
      label: "",
      placeholder: "",
      required: false,
      options: [],
    };
    setForm({
      ...form,
      orderFormFields: [...form.orderFormFields, newField],
    });
  };

  const updateOrderField = (
    index: number,
    updates: Partial<OrderFormField>
  ) => {
    const updated = [...form.orderFormFields];
    updated[index] = { ...updated[index], ...updates };
    setForm({ ...form, orderFormFields: updated });
  };

  const removeOrderField = (index: number) => {
    setForm({
      ...form,
      orderFormFields: form.orderFormFields.filter((_, i) => i !== index),
    });
  };

  const moveOrderField = (index: number, direction: "up" | "down") => {
    const fields = [...form.orderFormFields];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= fields.length) return;
    [fields[index], fields[target]] = [fields[target], fields[index]];
    setForm({ ...form, orderFormFields: fields });
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
      contentBlocks: form.contentBlocks.filter((b) => b.content.trim()),
      orderFormFields: form.orderFormFields.filter((f) => f.label.trim()),
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
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
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
                      {(siteCategories && siteCategories.length > 0
                        ? siteCategories.map((c) => [c.key, c.label] as const)
                        : Object.entries(CATEGORY_LABELS)
                      ).map(([key, label]) => (
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

              {/* 블로그형 콘텐츠 에디터 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <h3 className="text-sm font-bold text-gray-900">
                    상품 상세 콘텐츠
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => addContentBlock("text")}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Type className="w-3.5 h-3.5" />
                      글 추가
                    </button>
                    <button
                      type="button"
                      onClick={() => addContentBlock("image")}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      이미지 추가
                    </button>
                  </div>
                </div>

                {form.contentBlocks.length === 0 && (
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                    <div className="text-gray-400 mb-3">
                      <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    </div>
                    <p className="text-sm text-gray-500 mb-1">
                      블로그처럼 이미지와 글을 자유롭게 구성하세요
                    </p>
                    <p className="text-xs text-gray-400">
                      위의 &quot;글 추가&quot; 또는 &quot;이미지 추가&quot; 버튼을 클릭하여 시작하세요
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  {form.contentBlocks.map((block, index) => (
                    <div
                      key={block.id}
                      className="group relative border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors"
                    >
                      {/* Block toolbar */}
                      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-gray-400" />
                          <span className="text-xs font-semibold text-gray-500 uppercase">
                            {block.type === "text" ? "텍스트" : "이미지"}
                          </span>
                          <span className="text-xs text-gray-400">
                            {index + 1} / {form.contentBlocks.length}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveContentBlock(index, "up")}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed rounded"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveContentBlock(index, "down")}
                            disabled={index === form.contentBlocks.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed rounded"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeContentBlock(block.id)}
                            className="p-1 text-gray-400 hover:text-red-500 rounded ml-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Block content */}
                      <div className="p-3">
                        {block.type === "text" ? (
                          <textarea
                            value={block.content}
                            onChange={(e) =>
                              updateContentBlock(block.id, e.target.value)
                            }
                            rows={4}
                            className="w-full border-0 outline-none resize-none text-sm text-gray-700 placeholder-gray-400 leading-relaxed"
                            placeholder="텍스트 내용을 입력하세요..."
                          />
                        ) : (
                          <div>
                            {block.content ? (
                              <div className="relative">
                                <img
                                  src={block.content}
                                  alt="업로드된 이미지"
                                  className="w-full max-h-80 object-contain rounded-lg bg-gray-100"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const input = fileInputRefs.current[block.id];
                                    if (input) input.click();
                                  }}
                                  className="absolute bottom-2 right-2 px-3 py-1.5 text-xs font-medium bg-white/90 text-gray-700 rounded-lg shadow hover:bg-white transition-colors"
                                >
                                  이미지 변경
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  const input = fileInputRefs.current[block.id];
                                  if (input) input.click();
                                }}
                                className="w-full py-10 border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/30 transition-colors flex flex-col items-center gap-2"
                              >
                                <ImageIcon className="w-8 h-8 text-gray-300" />
                                <span className="text-sm text-gray-500">
                                  클릭하여 이미지를 업로드하세요
                                </span>
                                <span className="text-xs text-gray-400">
                                  JPG, PNG, GIF, WebP
                                </span>
                              </button>
                            )}
                            <input
                              ref={(el) => {
                                fileInputRefs.current[block.id] = el;
                              }}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(block.id, file);
                              }}
                            />
                            <input
                              type="text"
                              value={block.content.startsWith("data:") ? "" : block.content}
                              onChange={(e) =>
                                updateContentBlock(block.id, e.target.value)
                              }
                              className={`${inputClass} mt-2`}
                              placeholder="또는 이미지 URL을 직접 입력하세요"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {form.contentBlocks.length > 0 && (
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => addContentBlock("text")}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      글 추가
                    </button>
                    <button
                      type="button"
                      onClick={() => addContentBlock("image")}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      이미지 추가
                    </button>
                  </div>
                )}
              </div>

              {/* 주문서 양식 빌더 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-gray-500" />
                    <h3 className="text-sm font-bold text-gray-900">
                      주문서 양식
                    </h3>
                    <span className="text-xs text-gray-400">
                      ({form.orderFormFields.length}개 필드)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={addOrderField}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    필드 추가
                  </button>
                </div>

                {form.orderFormFields.length === 0 && (
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                    <ClipboardList className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm text-gray-500 mb-1">
                      주문서 양식이 없습니다
                    </p>
                    <p className="text-xs text-gray-400">
                      고객이 주문 시 작성할 항목을 추가하세요
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  {form.orderFormFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-gray-400" />
                          <span className="text-xs font-semibold text-gray-500">
                            필드 {index + 1}
                          </span>
                          {field.required && (
                            <span className="text-xs text-red-500 font-medium">
                              필수
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveOrderField(index, "up")}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 rounded"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveOrderField(index, "down")}
                            disabled={
                              index === form.orderFormFields.length - 1
                            }
                            className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 rounded"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeOrderField(index)}
                            className="p-1 text-gray-400 hover:text-red-500 rounded ml-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="p-3 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              필드명 *
                            </label>
                            <input
                              type="text"
                              value={field.label}
                              onChange={(e) =>
                                updateOrderField(index, {
                                  label: e.target.value,
                                })
                              }
                              className={inputClass}
                              placeholder="예: 사업자명, 연락처"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              필드 유형
                            </label>
                            <select
                              value={field.type}
                              onChange={(e) =>
                                updateOrderField(index, {
                                  type: e.target.value as OrderFieldType,
                                })
                              }
                              className={inputClass}
                            >
                              {Object.entries(ORDER_FIELD_TYPE_LABELS).map(
                                ([key, label]) => (
                                  <option key={key} value={key}>
                                    {label}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              플레이스홀더
                            </label>
                            <input
                              type="text"
                              value={field.placeholder || ""}
                              onChange={(e) =>
                                updateOrderField(index, {
                                  placeholder: e.target.value,
                                })
                              }
                              className={inputClass}
                              placeholder="입력 안내 문구"
                            />
                          </div>
                          <div className="flex items-end pb-1">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) =>
                                  updateOrderField(index, {
                                    required: e.target.checked,
                                  })
                                }
                                className="w-4 h-4 text-blue-600 rounded"
                              />
                              <span className="text-sm text-gray-700">
                                필수 항목
                              </span>
                            </label>
                          </div>
                        </div>
                        {field.type === "select" && (
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              선택 옵션 (쉼표로 구분)
                            </label>
                            <input
                              type="text"
                              value={(field.options || []).join(", ")}
                              onChange={(e) =>
                                updateOrderField(index, {
                                  options: e.target.value
                                    .split(",")
                                    .map((s) => s.trim())
                                    .filter(Boolean),
                                })
                              }
                              className={inputClass}
                              placeholder="옵션1, 옵션2, 옵션3"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {form.orderFormFields.length > 0 && (
                  <div className="flex justify-center pt-1">
                    <button
                      type="button"
                      onClick={addOrderField}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      필드 추가
                    </button>
                  </div>
                )}
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
                추가 정보 편집 (추천 대상, 진행 과정, FAQ)
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
                      {siteCategories?.find((c) => c.key === product.category)?.label ?? CATEGORY_LABELS[product.category]}
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
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        삭제
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
