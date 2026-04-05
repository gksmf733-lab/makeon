import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "회원가입",
  description: "MakeOn에 가입하고 자영업자를 위한 마케팅 서비스를 시작하세요.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
