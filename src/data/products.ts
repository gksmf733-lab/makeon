import { Product } from "@/types/product";

export const initialProducts: Product[] = [
  {
    id: "1",
    name: "인스타그램 릴스 패키지",
    description:
      "인스타그램 릴스 영상 기획부터 촬영, 편집, 업로드까지 한번에 해결하는 올인원 패키지입니다. 트렌드에 맞는 숏폼 콘텐츠로 고객 유입을 극대화합니다.",
    price: 290000,
    category: "sns",
    image: "/images/instagram-reels.svg",
    features: [
      "릴스 영상 5편 제작",
      "해시태그 전략 수립",
      "최적 시간대 업로드",
      "성과 리포트 제공",
    ],
    isActive: true,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "네이버 블로그 상위노출",
    description:
      "네이버 블로그 SEO 최적화를 통해 검색 상위에 노출시키는 마케팅 상품입니다. 키워드 분석부터 콘텐츠 작성까지 포함됩니다.",
    price: 350000,
    category: "blog",
    image: "/images/blog-marketing.svg",
    features: [
      "키워드 분석 리포트",
      "SEO 최적화 포스팅 10편",
      "이미지 제작 포함",
      "월간 순위 리포트",
    ],
    isActive: true,
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    name: "네이버 플레이스 리뷰 관리",
    description:
      "네이버 플레이스 리뷰를 체계적으로 관리하여 매장 평점과 신뢰도를 높이는 서비스입니다.",
    price: 190000,
    category: "review",
    image: "/images/review-manage.svg",
    features: [
      "리뷰 모니터링",
      "답글 관리 대행",
      "부정 리뷰 대응 전략",
      "월간 리뷰 분석 리포트",
    ],
    isActive: true,
    createdAt: "2024-02-01",
  },
  {
    id: "4",
    name: "구글/네이버 키워드 광고",
    description:
      "구글과 네이버 검색 광고를 세팅하고 최적화하여 광고 효율을 극대화하는 대행 서비스입니다.",
    price: 450000,
    category: "ad",
    image: "/images/keyword-ad.svg",
    features: [
      "키워드 리서치",
      "광고 세팅 및 최적화",
      "A/B 테스트",
      "주간 성과 리포트",
    ],
    isActive: true,
    createdAt: "2024-02-10",
  },
  {
    id: "5",
    name: "홈페이지 SEO 패키지",
    description:
      "홈페이지의 검색엔진 최적화를 통해 자연 유입을 늘리는 종합 SEO 패키지입니다.",
    price: 550000,
    category: "seo",
    image: "/images/seo-package.svg",
    features: [
      "사이트 SEO 진단",
      "메타태그 최적화",
      "콘텐츠 SEO 전략",
      "백링크 구축",
    ],
    isActive: true,
    createdAt: "2024-02-15",
  },
  {
    id: "6",
    name: "매장 로고 & 메뉴판 디자인",
    description:
      "매장의 브랜드 아이덴티티를 살린 로고와 메뉴판을 전문 디자이너가 제작합니다.",
    price: 380000,
    category: "design",
    image: "/images/logo-design.svg",
    features: [
      "로고 디자인 3안",
      "메뉴판 디자인",
      "명함 디자인",
      "원본 파일 제공",
    ],
    isActive: true,
    createdAt: "2024-03-01",
  },
  {
    id: "7",
    name: "카카오톡 채널 운영",
    description:
      "카카오톡 채널을 활용한 고객 소통 및 마케팅 메시지 발송 대행 서비스입니다.",
    price: 250000,
    category: "sns",
    image: "/images/kakao-channel.svg",
    features: [
      "채널 세팅 및 최적화",
      "주 2회 콘텐츠 발행",
      "자동응답 설정",
      "친구 유입 전략",
    ],
    isActive: true,
    createdAt: "2024-03-05",
  },
  {
    id: "8",
    name: "SNS 배너 & 카드뉴스",
    description:
      "인스타그램, 페이스북 등에 활용할 수 있는 고퀄리티 배너 및 카드뉴스를 제작합니다.",
    price: 180000,
    category: "design",
    image: "/images/sns-banner.svg",
    features: [
      "배너 디자인 5장",
      "카드뉴스 1세트(8장)",
      "수정 2회 포함",
      "SNS 최적 사이즈",
    ],
    isActive: true,
    createdAt: "2024-03-10",
  },
];
