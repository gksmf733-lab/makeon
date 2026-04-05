"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Trash2,
  X,
  ArrowLeft,
  Save,
} from "lucide-react";
import { useSiteStore, ValueProp } from "@/store/site-store";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import { inputClass } from "@/lib/styles";

const COLOR_OPTIONS: { value: ValueProp["color"]; label: string; bg: string }[] = [
  { value: "blue", label: "파란색", bg: "bg-blue-100 text-blue-700" },
  { value: "green", label: "초록색", bg: "bg-green-100 text-green-700" },
  { value: "purple", label: "보라색", bg: "bg-purple-100 text-purple-700" },
  { value: "red", label: "빨간색", bg: "bg-red-100 text-red-700" },
  { value: "orange", label: "주황색", bg: "bg-orange-100 text-orange-700" },
  { value: "teal", label: "청록색", bg: "bg-teal-100 text-teal-700" },
];

export default function AdminSitePage() {
  return (
    <AdminAuthGuard>
      <AdminSiteContent />
    </AdminAuthGuard>
  );
}

function AdminSiteContent() {
  const {
    content,
    updateContent,
    addValueProp,
    updateValueProp,
    deleteValueProp,
  } = useSiteStore();

  const [saved, setSaved] = useState(false);

  // Local state for text fields
  const [valueSectionTitle, setValueSectionTitle] = useState(content.valueSectionTitle);
  const [ctaTitle, setCtaTitle] = useState(content.ctaTitle);
  const [ctaSubtitle, setCtaSubtitle] = useState(content.ctaSubtitle);
  const [ctaButtonText, setCtaButtonText] = useState(content.ctaButtonText);
  const [ctaLink, setCtaLink] = useState(content.ctaLink);
  const [featuredTitle, setFeaturedTitle] = useState(content.featuredTitle);
  const [footerDescription, setFooterDescription] = useState(content.footerDescription);
  const [footerServices, setFooterServices] = useState(content.footerServices.join(", "));
  const [footerEmail, setFooterEmail] = useState(content.footerEmail);
  const [footerPhone, setFooterPhone] = useState(content.footerPhone);
  const [footerHours, setFooterHours] = useState(content.footerHours);
  const [footerCopyright, setFooterCopyright] = useState(content.footerCopyright);

  const handleSaveAll = () => {
    updateContent({
      valueSectionTitle,
      ctaTitle,
      ctaSubtitle,
      ctaButtonText,
      ctaLink,
      featuredTitle,
      footerDescription,
      footerServices: footerServices.split(",").map((s) => s.trim()).filter(Boolean),
      footerEmail,
      footerPhone,
      footerHours,
      footerCopyright,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddValueProp = () => {
    addValueProp({
      title: "새 항목",
      description: "설명을 입력하세요",
      color: "blue",
    });
  };

  const colorBgMap: Record<string, string> = {
    blue: "bg-blue-50",
    green: "bg-green-50",
    purple: "bg-purple-50",
    red: "bg-red-50",
    orange: "bg-orange-50",
    teal: "bg-teal-50",
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
          <h1 className="text-3xl font-extrabold text-gray-900">사이트 콘텐츠 관리</h1>
          <p className="text-gray-500 mt-1">홈페이지와 푸터의 텍스트를 수정합니다.</p>
        </div>
        <button
          onClick={handleSaveAll}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-colors ${
            saved
              ? "bg-green-500 text-white"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          <Save className="w-5 h-5" />
          {saved ? "저장 완료!" : "전체 저장"}
        </button>
      </div>

      <div className="space-y-8">
        {/* 가치 제안 섹션 */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">가치 제안 섹션</h2>
            <button
              onClick={handleAddValueProp}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              항목 추가
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">섹션 제목</label>
              <input
                type="text"
                value={valueSectionTitle}
                onChange={(e) => setValueSectionTitle(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="space-y-3">
              {content.valueProps.map((prop) => (
                <div
                  key={prop.id}
                  className={`${colorBgMap[prop.color]} p-4 rounded-xl space-y-3`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={prop.title}
                        onChange={(e) =>
                          updateValueProp(prop.id, { title: e.target.value })
                        }
                        className={inputClass}
                        placeholder="제목"
                      />
                      <textarea
                        value={prop.description}
                        onChange={(e) =>
                          updateValueProp(prop.id, { description: e.target.value })
                        }
                        rows={2}
                        className={`${inputClass} resize-none`}
                        placeholder="설명"
                      />
                    </div>
                    <button
                      onClick={() => deleteValueProp(prop.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex gap-1.5">
                    {COLOR_OPTIONS.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => updateValueProp(prop.id, { color: c.value })}
                        className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${c.bg} ${
                          prop.color === c.value ? "ring-2 ring-offset-1 ring-gray-400" : "opacity-60 hover:opacity-100"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 인기 상품 섹션 */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">인기 상품 섹션</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">섹션 제목</label>
            <input
              type="text"
              value={featuredTitle}
              onChange={(e) => setFeaturedTitle(e.target.value)}
              className={inputClass}
            />
          </div>
        </section>

        {/* CTA 섹션 */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">CTA (행동 유도) 섹션</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
              <input
                type="text"
                value={ctaTitle}
                onChange={(e) => setCtaTitle(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">부제목</label>
              <input
                type="text"
                value={ctaSubtitle}
                onChange={(e) => setCtaSubtitle(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">버튼 텍스트</label>
                <input
                  type="text"
                  value={ctaButtonText}
                  onChange={(e) => setCtaButtonText(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">버튼 링크</label>
                <input
                  type="text"
                  value={ctaLink}
                  onChange={(e) => setCtaLink(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            {/* CTA Preview */}
            <div className="bg-gray-900 text-white rounded-xl p-6 text-center">
              <h3 className="text-lg font-bold">{ctaTitle || "CTA 제목"}</h3>
              <p className="text-gray-400 text-sm mt-1">{ctaSubtitle || "CTA 부제목"}</p>
              <span className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold">
                {ctaButtonText || "버튼"}
              </span>
            </div>
          </div>
        </section>

        {/* 푸터 */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">푸터 정보</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">회사 소개</label>
              <textarea
                value={footerDescription}
                onChange={(e) => setFooterDescription(e.target.value)}
                rows={2}
                className={`${inputClass} resize-none`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">서비스 목록 (쉼표로 구분)</label>
              <input
                type="text"
                value={footerServices}
                onChange={(e) => setFooterServices(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                <input
                  type="text"
                  value={footerEmail}
                  onChange={(e) => setFooterEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
                <input
                  type="text"
                  value={footerPhone}
                  onChange={(e) => setFooterPhone(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">운영시간</label>
                <input
                  type="text"
                  value={footerHours}
                  onChange={(e) => setFooterHours(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">저작권 표시</label>
                <input
                  type="text"
                  value={footerCopyright}
                  onChange={(e) => setFooterCopyright(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Save Button (bottom) */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveAll}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-colors ${
              saved
                ? "bg-green-500 text-white"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            <Save className="w-5 h-5" />
            {saved ? "저장 완료!" : "전체 저장"}
          </button>
        </div>
      </div>
    </div>
  );
}
