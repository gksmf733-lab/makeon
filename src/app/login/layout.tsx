import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인",
  description: "MakeOn 계정에 로그인하여 마케팅 상품을 이용하세요.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
