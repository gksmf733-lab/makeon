"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Shield,
  ArrowLeft,
  Eye,
  EyeOff,
  Tag,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useSiteStore, CategoryItem } from "@/store/site-store";

const inputClass =
  "w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm";

type FormData = {
  key: string;
  label: string;
  isActive: boolean;
};

const emptyForm: FormData = {
  key: "",
  label: "",
  isActive: true,
};

export default function AdminCategoriesPage() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const { content, addCategory, updateCategory, deleteCategory } =
    useSiteStore();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);

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

  const openNewForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (category: CategoryItem) => {
    setForm({
      key: category.key,
      label: category.label,
      isActive: category.isActive,
    });
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.key.trim() || !form.label.trim()) {
      alert("카테고리 키와 이름을 모두 입력해 주세요.");
      return;
    }
    // 키 중복 검사 (수정 시 자기 자신 제외)
    const duplicate = content.categories.find(
      (c) => c.key === form.key.trim() && c.id !== editingId
    );
    if (duplicate) {
      alert("이미 동일한 키가 존재합니다.");
      return;
    }
    if (editingId) {
      updateCategory(editingId, {
        key: form.key.trim(),
        label: form.label.trim(),
        isActive: form.isActive,
      });
    } else {
      addCategory({
        key: form.key.trim(),
        label: form.label.trim(),
        isActive: form.isActive,
      });
    }
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = (id: string, label: string) => {
    if (confirm(`"${label}" 카테고리를 삭제하시겠습니까?`)) {
      deleteCategory(id);
    }
  };

  const handleToggleActive = (category: CategoryItem) => {
    updateCategory(category.id, { isActive: !category.isActive });
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
          <h1 className="text-3xl font-extrabold text-gray-900">
            카테고리 관리
          </h1>
          <p className="text-gray-500 mt-1">
            상품 카테고리를 추가, 수정, 삭제할 수 있습니다.
          </p>
        </div>
        <button
          onClick={openNewForm}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          카테고리 추가
        </button>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {editingId ? "카테고리 수정" : "새 카테고리 추가"}
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
                  카테고리 키 (영문) *
                </label>
                <input
                  type="text"
                  required
                  value={form.key}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      key: e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9_-]/g, ""),
                    })
                  }
                  className={inputClass}
                  placeholder="예: sns, blog, review"
                  disabled={!!editingId}
                />
                {editingId && (
                  <p className="text-xs text-gray-400 mt-1">
                    키는 수정할 수 없습니다.
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  카테고리 이름 *
                </label>
                <input
                  type="text"
                  required
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  className={inputClass}
                  placeholder="예: SNS 마케팅"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="categoryActive"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label
                  htmlFor="categoryActive"
                  className="text-sm text-gray-700"
                >
                  활성화 (상품 페이지에 노출)
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                {editingId ? "수정 완료" : "카테고리 추가"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Category List */}
      <div className="space-y-3">
        {content.categories.map((category) => (
          <div
            key={category.id}
            className={`bg-white rounded-xl border ${
              category.isActive
                ? "border-gray-200"
                : "border-gray-100 opacity-60"
            } shadow-sm p-5 flex items-center gap-4`}
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <Tag className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900">
                  {category.label}
                </h3>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded font-mono">
                  {category.key}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                {category.isActive ? (
                  <>
                    <Eye className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-xs text-green-600 font-medium">
                      활성
                    </span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-400 font-medium">
                      비활성
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleActive(category)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  category.isActive
                    ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    : "bg-green-50 text-green-600 hover:bg-green-100"
                }`}
              >
                {category.isActive ? "비활성화" : "활성화"}
              </button>
              <button
                onClick={() => openEditForm(category)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                수정
              </button>
              <button
                onClick={() => handleDelete(category.id, category.label)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                삭제
              </button>
            </div>
          </div>
        ))}

        {content.categories.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p>등록된 카테고리가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
