"use client";

import Link from "next/link";
import { Package, ImageIcon, FileText, Tag } from "lucide-react";
import { useProductStore } from "@/store/product-store";
import { useSiteStore } from "@/store/site-store";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";

export default function AdminDashboard() {
  return (
    <AdminAuthGuard>
      <AdminDashboardContent />
    </AdminAuthGuard>
  );
}

function AdminDashboardContent() {
  const products = useProductStore((s) => s.products);
  const content = useSiteStore((s) => s.content);

  const menuItems = [
    {
      title: "상품 관리",
      description: `등록된 상품 ${products.length}개`,
      icon: Package,
      href: "/admin/products",
      color: "blue",
    },
    {
      title: "카테고리 관리",
      description: `카테고리 ${content.categories?.length ?? 0}개`,
      icon: Tag,
      href: "/admin/categories",
      color: "orange",
    },
    {
      title: "배너 관리",
      description: `히어로 배너 ${content.banners.length}개`,
      icon: ImageIcon,
      href: "/admin/banners",
      color: "purple",
    },
    {
      title: "사이트 콘텐츠",
      description: "가치 제안, CTA, 푸터 등",
      icon: FileText,
      href: "/admin/site",
      color: "green",
    },
  ];

  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-green-50 text-green-600",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-500 mt-1">
          사이트의 모든 콘텐츠를 관리할 수 있습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:border-blue-200 transition-all group"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorMap[item.color]}`}
            >
              <item.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {item.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
