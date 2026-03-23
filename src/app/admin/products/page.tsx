"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useProductStore } from "@/store/product-store";
import {
  Product,
  ProductCategory,
  CATEGORY_LABELS,
} from "@/types/product";

type FormData = {
  name: string;
  description: string;
  price: string;
  category: ProductCategory;
  features: string;
  isActive: boolean;
};

const emptyForm: FormData = {
  name: "",
  description: "",
  price: "",
  category: "sns",
  features: "",
  isActive: true,
};

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } =
    useProductStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);

  const openNewForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      features: product.features.join(", "),
      isActive: product.isActive,
    });
    setEditingId(product.id);
    setShowForm(true);
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
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  상품명
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="예: 인스타그램 릴스 패키지"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  설명
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  placeholder="상품 설명을 입력하세요"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    가격 (원)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
