"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { UserRegisterInput } from "@/types/user";

const INDUSTRY_OPTIONS = [
  "음식점/카페",
  "미용/뷰티",
  "병원/의원",
  "학원/교육",
  "숙박/펜션",
  "쇼핑몰",
  "부동산",
  "자동차",
  "인테리어",
  "기타",
];

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);

  const [form, setForm] = useState<UserRegisterInput>({
    username: "",
    password: "",
    name: "",
    phone: "",
    businessName: "",
    industry: "",
    url: "",
    businessNumber: "",
    address: "",
  });
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const formatPhone = (value: string) => {
    const nums = value.replace(/\D/g, "").slice(0, 11);
    if (nums.length <= 3) return nums;
    if (nums.length <= 7) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
    return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`;
  };

  const formatBusinessNumber = (value: string) => {
    const nums = value.replace(/\D/g, "").slice(0, 10);
    if (nums.length <= 3) return nums;
    if (nums.length <= 5) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
    return `${nums.slice(0, 3)}-${nums.slice(3, 5)}-${nums.slice(5)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }
    if (form.password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    const result = register(form);
    if (!result.success) {
      setError(result.message);
      return;
    }

    alert("회원가입이 완료되었습니다. 로그인해 주세요.");
    router.push("/login");
  };

  const inputClass =
    "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition";

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            회원가입
          </h1>
          <p className="text-gray-500 mb-8">
            MakeOn에 가입하고 마케팅을 시작하세요.
          </p>

          {error && (
            <div id="register-error" role="alert" className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 계정 정보 */}
            <fieldset>
              <legend className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200 w-full">
                계정 정보
              </legend>
              <div className="space-y-4">
                <div>
                  <label htmlFor="reg-username" className="block text-sm font-semibold text-gray-700 mb-1">
                    아이디 <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="reg-username"
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="영문, 숫자 조합 4자 이상"
                    required
                    aria-required="true"
                    aria-describedby={error ? "register-error" : undefined}
                    minLength={4}
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="reg-password" className="block text-sm font-semibold text-gray-700 mb-1">
                      비밀번호 <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="reg-password"
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="6자 이상"
                      required
                      aria-required="true"
                      minLength={6}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-password-confirm" className="block text-sm font-semibold text-gray-700 mb-1">
                      비밀번호 확인 <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="reg-password-confirm"
                      type="password"
                      name="passwordConfirm"
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      placeholder="비밀번호 재입력"
                      required
                      aria-required="true"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </fieldset>

            {/* 기본 정보 */}
            <fieldset>
              <legend className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200 w-full">
                기본 정보
              </legend>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="reg-name" className="block text-sm font-semibold text-gray-700 mb-1">
                      이름 <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="reg-name"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="실명 입력"
                      required
                      aria-required="true"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-phone" className="block text-sm font-semibold text-gray-700 mb-1">
                      연락처 <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="reg-phone"
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: formatPhone(e.target.value) })
                      }
                      placeholder="010-0000-0000"
                      required
                      aria-required="true"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="reg-businessName" className="block text-sm font-semibold text-gray-700 mb-1">
                      상호명 <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="reg-businessName"
                      type="text"
                      name="businessName"
                      value={form.businessName}
                      onChange={handleChange}
                      placeholder="사업장 이름"
                      required
                      aria-required="true"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-industry" className="block text-sm font-semibold text-gray-700 mb-1">
                      업종 <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <select
                      id="reg-industry"
                      name="industry"
                      value={form.industry}
                      onChange={handleChange}
                      required
                      aria-required="true"
                      className={inputClass}
                    >
                      <option value="">업종 선택</option>
                      {INDUSTRY_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </fieldset>

            {/* 사업 정보 */}
            <fieldset>
              <legend className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200 w-full">
                사업 정보
              </legend>
              <div className="space-y-4">
                <div>
                  <label htmlFor="reg-url" className="block text-sm font-semibold text-gray-700 mb-1">
                    URL (쇼핑몰 또는 플레이스)
                  </label>
                  <input
                    id="reg-url"
                    type="url"
                    name="url"
                    value={form.url}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    aria-describedby="reg-url-hint"
                    className={inputClass}
                  />
                  <p id="reg-url-hint" className="text-xs text-gray-400 mt-1">
                    네이버 스마트스토어, 네이버 플레이스, 자사몰 등
                  </p>
                </div>
                <div>
                  <label htmlFor="reg-businessNumber" className="block text-sm font-semibold text-gray-700 mb-1">
                    사업자등록번호 <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="reg-businessNumber"
                    type="text"
                    name="businessNumber"
                    value={form.businessNumber}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        businessNumber: formatBusinessNumber(e.target.value),
                      })
                    }
                    placeholder="000-00-00000"
                    required
                    aria-required="true"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="reg-address" className="block text-sm font-semibold text-gray-700 mb-1">
                    사업장 주소 <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="reg-address"
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="사업장 주소를 입력하세요"
                    required
                    aria-required="true"
                    className={inputClass}
                  />
                </div>
              </div>
            </fieldset>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-blue-700 active:bg-blue-800 transition-colors"
            >
              가입하기
            </button>
          </form>

          <p className="text-center text-gray-500 mt-6">
            이미 계정이 있으신가요?{" "}
            <Link
              href="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
