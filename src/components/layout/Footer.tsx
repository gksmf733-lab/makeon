"use client";

import { useSiteStore } from "@/store/site-store";

export default function Footer() {
  const content = useSiteStore((s) => s.content);

  return (
    <footer className="bg-gray-900 text-gray-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-3">MakeOn</h3>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {content.footerDescription}
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">서비스</h4>
            <ul className="space-y-2 text-sm">
              {content.footerServices.map((service, i) => (
                <li key={i}>{service}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">고객지원</h4>
            <ul className="space-y-2 text-sm">
              <li>이메일: {content.footerEmail}</li>
              <li>전화: {content.footerPhone}</li>
              <li>운영시간: {content.footerHours}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          &copy; {content.footerCopyright}
        </div>
      </div>
    </footer>
  );
}
