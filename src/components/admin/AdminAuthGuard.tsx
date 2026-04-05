"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const isAdmin = useAuthStore((s) => s.isAdmin);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          로그인이 필요합니다
        </h2>
        <Link
          href="/login"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors mt-4"
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
        <Link
          href="/"
          className="inline-block bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors mt-4"
        >
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
