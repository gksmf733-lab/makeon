export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-3">MakeOn</h3>
            <p className="text-sm leading-relaxed">
              자영업자를 위한 셀프 마케팅 플랫폼.
              <br />
              쉽고 합리적인 가격으로 마케팅을 시작하세요.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">서비스</h4>
            <ul className="space-y-2 text-sm">
              <li>SNS 마케팅</li>
              <li>블로그 마케팅</li>
              <li>리뷰 관리</li>
              <li>SEO 최적화</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">고객지원</h4>
            <ul className="space-y-2 text-sm">
              <li>이메일: support@makeon.kr</li>
              <li>전화: 02-1234-5678</li>
              <li>운영시간: 평일 09:00 ~ 18:00</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          &copy; 2024 MakeOn. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
