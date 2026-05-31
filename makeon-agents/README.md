# 마케온 멀티 에이전트 — 사용법

Claude Code(터미널)에서 마케온 홈페이지를 여러 전문 에이전트로 나눠 작업하기 위한 구성입니다.

## 설치
1. 이 폴더의 내용을 마케온 프로젝트 루트에 복사합니다.
   - `CLAUDE.md` → 프로젝트 루트
   - `.claude/agents/*.md` → 프로젝트의 `.claude/agents/`
2. 프로젝트 루트에서 Claude Code를 실행합니다:
   ```
   claude
   ```
3. Claude Code가 `CLAUDE.md`와 `.claude/agents/`를 자동으로 인식합니다.

## 폴더 구조
```
프로젝트루트/
├─ CLAUDE.md                  # 전체 작업 가이드(에이전트 오케스트레이션)
├─ .claude/
│  └─ agents/
│     ├─ 01-planner.md        # 철수 · 기획
│     ├─ 02-designer.md       # 유리 · 디자인
│     ├─ 03-frontend.md       # 훈이 · 프론트
│     ├─ 04-backend.md        # 백엔드
│     ├─ 05-qa.md             # 짱구·맹구 · QA
│     ├─ 06-content.md        # 콘텐츠
│     ├─ 07-integration.md    # 연동(알림톡·결제)
│     └─ 08-devops.md         # 배포·운영
├─ index.html                 # (기존) 마케온 쇼핑몰
├─ categories.json
└─ products.json
```

## 에이전트 호출
대화에서 역할을 지정해 부릅니다. 예:
- "planner 에이전트로 마이페이지 주문 저장 기능을 설계해줘"
- "frontend 에이전트로 상세 갤러리 이미지 교체 기능을 구현해줘"
- "qa 에이전트로 장바구니 흐름을 점검해줘"

## 권장 작업 순서
planner → designer → (frontend ∥ backend) → content/integration → qa → devops

## 주의
- 비밀번호·토큰·API 키 같은 자격증명은 코드나 대화에 넣지 마세요. `.env`로 관리하고 `.gitignore`에 등록합니다.
- 깃 푸시·배포 인증 같은 작업은 직접 하셔야 합니다(에이전트는 절차만 안내).
