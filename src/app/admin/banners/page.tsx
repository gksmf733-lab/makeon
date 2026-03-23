"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Shield,
  ArrowLeft,
  Eye,
  EyeOff,
  Upload,
  ImageIcon,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useSiteStore, BannerSlide } from "@/store/site-store";

const inputClass =
  "w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm";

const BG_OPTIONS = [
  { value: "from-blue-600 via-blue-700 to-indigo-800", label: "파란색" },
  { value: "from-purple-600 via-purple-700 to-indigo-800", label: "보라색" },
  { value: "from-green-600 via-teal-700 to-cyan-800", label: "초록색" },
  { value: "from-red-500 via-rose-600 to-pink-700", label: "빨간색" },
  { value: "from-orange-500 via-amber-600 to-yellow-700", label: "주황색" },
  { value: "from-gray-700 via-gray-800 to-gray-900", label: "다크" },
];

type FormData = {
  title: string;
  subtitle: string;
  link: string;
  bgColor: string;
  isActive: boolean;
  image?: string;
};

const emptyForm: FormData = {
  title: "",
  subtitle: "",
  link: "/products",
  bgColor: BG_OPTIONS[0].value,
  isActive: true,
  image: undefined,
};

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

function resizeImage(file: File, maxWidth = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ratio = Math.min(maxWidth / img.width, 1);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/webp", 0.8));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminBannersPage() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const { content, addBanner, updateBanner, deleteBanner } = useSiteStore();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const openEditForm = (banner: BannerSlide) => {
    setForm({
      title: banner.title,
      subtitle: banner.subtitle,
      link: banner.link,
      bgColor: banner.bgColor,
      isActive: banner.isActive,
      image: banner.image,
    });
    setEditingId(banner.id);
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE * 5) {
      alert("파일 크기가 너무 큽니다. (최대 10MB)");
      return;
    }
    try {
      const dataUrl = await resizeImage(file, 1920);
      setForm({ ...form, image: dataUrl });
    } catch {
      alert("이미지 처리 중 오류가 발생했습니다.");
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateBanner(editingId, form);
    } else {
      addBanner(form);
    }
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("이 배너를 삭제하시겠습니까?")) {
      deleteBanner(id);
    }
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
          <h1 className="text-3xl font-extrabold text-gray-900">배너 관리</h1>
          <p className="text-gray-500 mt-1">
            홈페이지 히어로 배너를 관리합니다.
          </p>
        </div>
        <button
          onClick={openNewForm}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          배너 추가
        </button>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {editingId ? "배너 수정" : "새 배너 추가"}
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
                  제목 *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={inputClass}
                  placeholder="배너 제목"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  부제목 *
                </label>
                <input
                  type="text"
                  required
                  value={form.subtitle}
                  onChange={(e) =>
                    setForm({ ...form, subtitle: e.target.value })
                  }
                  className={inputClass}
                  placeholder="배너 부제목"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  링크 URL
                </label>
                <input
                  type="text"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  className={inputClass}
                  placeholder="/products"
                />
              </div>
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  배너 이미지
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {form.image ? (
                  <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    <Image
                      src={form.image}
                      alt="배너 이미지"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white/90 hover:bg-white text-gray-700 text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-sm transition-colors"
                      >
                        변경
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, image: undefined })}
                        className="bg-red-500/90 hover:bg-red-500 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-sm transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-[16/9] rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 transition-colors flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-blue-500"
                  >
                    <Upload className="w-8 h-8" />
                    <span className="text-sm font-medium">
                      클릭하여 이미지 업로드
                    </span>
                    <span className="text-xs">
                      JPG, PNG, WebP (최대 10MB, 자동 리사이즈)
                    </span>
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  배경 색상
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {BG_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm({ ...form, bgColor: opt.value })}
                      className={`h-10 rounded-lg bg-gradient-to-r ${opt.value} text-white text-xs font-semibold flex items-center justify-center transition-all ${
                        form.bgColor === opt.value
                          ? "ring-2 ring-offset-2 ring-blue-500 scale-105"
                          : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="bannerActive"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label
                  htmlFor="bannerActive"
                  className="text-sm text-gray-700"
                >
                  활성화 (홈페이지에 노출)
                </label>
              </div>

              {/* Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  미리보기
                </label>
                <div
                  className={`bg-gradient-to-br ${form.bgColor} text-white rounded-xl p-6 flex items-center gap-4`}
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">
                      {form.title || "배너 제목"}
                    </h3>
                    <p className="text-white/80 text-sm mt-1">
                      {form.subtitle || "배너 부제목"}
                    </p>
                  </div>
                  {form.image && (
                    <div className="relative w-24 h-18 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={form.image}
                        alt="미리보기"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                {editingId ? "수정 완료" : "배너 추가"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Banner List */}
      <div className="space-y-4">
        {content.banners.map((banner) => (
          <div
            key={banner.id}
            className={`bg-gradient-to-r ${banner.bgColor} rounded-2xl overflow-hidden shadow-sm`}
          >
            <div className="p-6 flex items-center gap-4">
              {banner.image ? (
                <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0 bg-white/10">
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-14 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <ImageIcon className="w-6 h-6 text-white/40" />
                </div>
              )}
              <div className="flex-1 text-white">
                <div className="flex items-center gap-2 mb-1">
                  {banner.isActive ? (
                    <Eye className="w-4 h-4 text-white/60" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-white/60" />
                  )}
                  <span className="text-xs text-white/60 font-medium">
                    {banner.isActive ? "활성" : "비활성"}
                  </span>
                </div>
                <h3 className="text-xl font-bold">{banner.title}</h3>
                <p className="text-white/70 text-sm mt-1">{banner.subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditForm(banner)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  수정
                </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-white/20 hover:bg-red-500/80 text-white rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  삭제
                </button>
              </div>
            </div>
          </div>
        ))}

        {content.banners.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p>등록된 배너가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
