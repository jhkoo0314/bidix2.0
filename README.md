<div align="center">
  <br />

  <div>
    <img src="https://img.shields.io/badge/-Next.JS_15-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=black" alt="next.js" />
    <img src="https://img.shields.io/badge/-React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="react" />
    <img src="https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="typescript" />
    <img src="https://img.shields.io/badge/-Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="tailwind" />
    <img src="https://img.shields.io/badge/-Clerk-6C47FF?style=for-the-badge&logoColor=white&logo=clerk" alt="clerk" />
    <img src="https://img.shields.io/badge/-Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="supabase" />
  </div>

  <h1 align="center">BIDIX</h1>
  <h3 align="center">Fail Safe, Bid Better</h3>

  <p align="center">
    초보 투자자가 실패의 두려움 없이 무한히 실전 경험을 쌓아,<br />
    스스로 좋은 의사결정을 내릴 수 있는 판단력을 기르도록 돕는<br />
    AI 기반 실전 훈련 시뮬레이터
  </p>
</div>

## 📋 목차

1. [소개](#소개)
2. [핵심 가치](#핵심-가치)
3. [기술 스택](#기술-스택)
4. [주요 기능](#주요-기능)
5. [시작하기](#시작하기)
6. [프로젝트 구조](#프로젝트-구조)
7. [개발 가이드](#개발-가이드)
8. [문서 인덱스](#문서-인덱스)

## 소개

BIDIX는 단순한 경매 정보 제공 서비스가 아닙니다. 이것은 **초보 투자자가 '실패의 두려움' 없이 무한히 실전 경험을 쌓아, 스스로 '좋은 의사결정'을 내릴 수 있는 판단력을 기르도록 돕는 AI 기반 '실전 훈련 시뮬레이터'**입니다.

우리는 '정답'을 알려주는 것이 아니라, 사용자가 **'생각하는 과정'**을 훈련시킵니다. 실패는 좌절이 아닌, 가장 가치 있는 학습 데이터가 됩니다.

> **브랜드 에센스:** 당신의 경험을, 데이터로 증명하다.

## 핵심 가치

### BIDIX 가치 사슬: 'ix'의 의미

BIDIX의 'ix'는 사용자의 실력이 완성되는 3단계 가치 사슬을 상징합니다:

1. **Infinite eXperience (무한한 경험)**: 난이도별 시나리오에서 안전하게 실패하며 경험을 쌓습니다.
2. **Insight (날카로운 통찰)**: 데이터 기반의 상세 복기 리포트를 통해 '왜' 그런 결과가 나왔는지 통찰을 얻습니다.
3. **Index (성장의 지표)**: 모든 경험과 통찰을 정확성/수익성/안정성 3가지 기준으로 객관적인 점수와 레벨로 변환합니다.

## 기술 스택

### 프레임워크 & 라이브러리

- **[Next.js 15.5.6](https://nextjs.org/)** - React 프레임워크 (App Router, Server Components)
- **[React 19](https://react.dev/)** - UI 라이브러리
- **[TypeScript](https://www.typescriptlang.org/)** - 타입 안정성 (strict mode)

### 인증 & 데이터베이스

- **[Clerk](https://clerk.com/)** - 사용자 인증 및 관리
  - Google, 이메일 등 다양한 로그인 방식 지원
  - 한국어 UI 지원
  - Supabase와 네이티브 통합
- **[Supabase](https://supabase.com/)** - PostgreSQL 데이터베이스
  - 실시간 데이터 동기화
  - Row Level Security (RLS)
  - 파일 스토리지

### UI & 스타일링

- **[Tailwind CSS v4](https://tailwindcss.com/)** - 유틸리티 우선 CSS 프레임워크
- **[shadcn/ui](https://ui.shadcn.com/)** - 재사용 가능한 컴포넌트 라이브러리
- **[Radix UI](https://www.radix-ui.com/)** - 접근성 높은 헤드리스 컴포넌트
- **[lucide-react](https://lucide.dev/)** - 아이콘 라이브러리

### 폼 & 검증

- **[React Hook Form](https://react-hook-form.com/)** - 폼 상태 관리
- **[Zod](https://zod.dev/)** - 스키마 검증

### 테스트

- **[Vitest](https://vitest.dev/)** - 단위/통합 테스트
- **[Playwright](https://playwright.dev/)** - E2E 테스트

## 주요 기능

### 🎯 시뮬레이션 생성

- 난이도별 시나리오 생성 (Easy / Normal / Hard)
- 일관성 있는 가상 매물 및 법원 문서 생성
- Policy 기반 계산 규칙 적용

### 💰 입찰 및 분석

- 사용자 입찰가 기반 결과 재계산
- 정확성/수익성/안정성 3가지 기준으로 평가
- 1000점 만점 점수 시스템 및 등급 산출

### 📊 결과 제공

- 입찰 결과 요약 정보 (무료)
- 매각물건명세서 해설판 (일 1회 무료)
- 권리분석/수익분석/경매분석 리포트 (프리미엄)

### 📈 기록 및 성장

- 모든 시뮬레이션 결과 히스토리 저장
- 점수 및 등급 추적
- 성장 지표 시각화

### 🔐 인증 시스템

- Clerk를 통한 안전한 사용자 인증
- 소셜 로그인 지원 (Google 등)
- Clerk 사용자 자동으로 Supabase DB에 동기화
- 한국어 UI 지원

### 🎨 UI/UX

- shadcn/ui 기반 모던 컴포넌트
- 완전한 반응형 디자인
- 다크/라이트 모드 지원
- 접근성 준수 (WCAG 2.1 AA)
- SEO 최적화 (메타데이터, OG 이미지)

## 시작하기

### 필수 요구사항

시스템에 다음이 설치되어 있어야 합니다:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en) (v18 이상)
- [pnpm](https://pnpm.io/) (권장 패키지 매니저)

```bash
# pnpm 설치
npm install -g pnpm
```

### 프로젝트 초기화

#### 1. 저장소 클론 및 의존성 설치

```bash
git clone <your-repository-url>
cd bidix-v2.0
pnpm install
```

#### 2. Supabase 프로젝트 생성

1. [Supabase Dashboard](https://supabase.com/dashboard)에 접속하여 로그인
2. **"New Project"** 클릭
3. 프로젝트 정보 입력:
   - **Name**: 원하는 프로젝트 이름
   - **Database Password**: 안전한 비밀번호 생성
   - **Region**: `Northeast Asia (Seoul)` 선택 (한국 서비스용)
   - **Pricing Plan**: Free 또는 Pro 선택
4. **"Create new project"** 클릭하고 프로젝트가 준비될 때까지 대기 (~2분)

#### 3. Clerk 프로젝트 생성

1. [Clerk Dashboard](https://dashboard.clerk.com/)에 접속하여 로그인
2. **"Create application"** 클릭
3. 애플리케이션 정보 입력:
   - **Application name**: 원하는 이름 (예: `BIDIX`)
   - **Sign-in options**: Email, Google 등 원하는 인증 방식 선택
4. **"Create application"** 클릭

#### 4. Clerk + Supabase 통합

> **중요**: 2025년 4월부터 Clerk의 네이티브 Supabase 통합을 사용합니다. JWT Template은 더 이상 필요하지 않습니다.

**4-1. Clerk Frontend API URL 확인**

1. Clerk Dashboard → **API Keys** 메뉴
2. **"Frontend API"** URL 복사 (예: `https://your-app-12.clerk.accounts.dev`)

**4-2. Supabase에서 Clerk 인증 제공자 설정**

1. Supabase Dashboard → **Settings** → **Authentication** → **Providers**
2. 페이지 하단으로 스크롤하여 **"Third-Party Auth"** 섹션 찾기
3. **"Enable Custom Access Token"** 또는 **"Add Provider"** 클릭
4. 다음 정보 입력:
   - **Provider Name**: `Clerk`
   - **JWT Issuer (Issuer URL)**: `https://your-app-12.clerk.accounts.dev`
   - **JWKS Endpoint (JWKS URI)**: `https://your-app-12.clerk.accounts.dev/.well-known/jwks.json`
5. **"Save"** 클릭

#### 5. Supabase Storage 생성 및 설정

1. Supabase Dashboard → **Storage** 메뉴
2. **"New bucket"** 클릭
3. 버킷 정보 입력:
   - **Name**: `uploads`
   - **Public bucket**: 필요에 따라 선택
4. **"Create bucket"** 클릭

#### 6. 데이터베이스 스키마 적용

1. Supabase Dashboard → **SQL Editor** 메뉴
2. **"New query"** 클릭
3. `supabase/migrations/mvp_schema.sql` 파일 내용을 복사하여 붙여넣기
4. **"Run"** 클릭하여 실행

#### 7. 환경 변수 설정

**7-1. .env 파일 생성**

```bash
cp .env.example .env
```

**7-2. Supabase 환경 변수 설정**

1. Supabase Dashboard → **Settings** → **API**
2. 다음 값들을 복사하여 `.env` 파일에 입력:

```env
NEXT_PUBLIC_SUPABASE_URL="<Project URL>"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<anon public key>"
SUPABASE_SERVICE_ROLE_KEY="<service_role secret key>"
NEXT_PUBLIC_STORAGE_BUCKET="uploads"
```

> **⚠️ 주의**: `service_role` 키는 모든 RLS를 우회하는 관리자 권한이므로 절대 공개하지 마세요!

**7-3. Clerk 환경 변수 설정**

1. Clerk Dashboard → **API Keys**
2. 다음 값들을 복사하여 `.env` 파일에 입력:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="<Publishable Key>"
CLERK_SECRET_KEY="<Secret Key>"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL="/"
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL="/"
```

#### 8. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인합니다.

### 개발 명령어

```bash
# 개발 서버 실행 (Turbopack)
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start

# 린팅
pnpm lint

# 테스트 실행
pnpm test
```

## 프로젝트 구조

```
bidix-v2.0/
├── app/                          # Next.js App Router
│   ├── action/                   # Server Actions
│   │   ├── generatesimulation.ts # 시뮬레이션 생성 액션
│   │   ├── savehistory.ts        # 히스토리 저장 액션
│   │   └── submitbid.ts          # 입찰 제출 액션
│   ├── api/                      # API Routes
│   │   ├── sync-user/           # Clerk → Supabase 사용자 동기화
│   │   └── ...
│   ├── dashboard/                # 대시보드 페이지
│   ├── simulations/              # 시뮬레이션 관련 페이지
│   │   ├── [id]/                # 동적 라우트
│   │   │   ├── page.tsx         # 시뮬레이션 상세
│   │   │   ├── bid/             # 입찰 페이지
│   │   │   └── result/          # 결과 페이지
│   │   └── page.tsx             # 시뮬레이션 목록
│   ├── history/                  # 히스토리 페이지
│   ├── layout.tsx                # Root Layout
│   ├── page.tsx                  # Landing Page
│   └── globals.css               # Tailwind CSS v4 설정
│
├── components/                   # React 컴포넌트
│   ├── ui/                       # shadcn/ui 컴포넌트
│   ├── bid/                      # 입찰 관련 컴포넌트
│   ├── common/                    # 공통 컴포넌트
│   ├── dashboard/                # 대시보드 컴포넌트
│   ├── history/                  # 히스토리 컴포넌트
│   ├── providers/                # React Context Providers
│   ├── reports/                  # 리포트 컴포넌트
│   ├── result/                   # 결과 페이지 컴포넌트
│   ├── simulations/              # 시뮬레이션 관련 컴포넌트
│   └── Navbar.tsx                # 네비게이션 바
│
├── lib/                          # 핵심 비즈니스 로직
│   ├── types/                    # 타입 SSOT
│   ├── policy/                   # 정책 레이어 (계산 규칙)
│   ├── engines/                  # 계산 엔진 레이어 (Pure Function)
│   ├── generators/               # 랜덤/모의 데이터 생성 레이어
│   ├── services/                 # 서비스 레이어 (DB + 엔진)
│   ├── supabase/                 # Supabase 클라이언트 (환경별 분리)
│   └── utils/                    # 유틸리티 함수
│
├── hooks/                        # 커스텀 React Hooks
│   └── use-sync-user.ts          # Clerk 사용자 동기화 훅
│
├── supabase/                     # Supabase 설정 및 마이그레이션
│   ├── migrations/               # SQL 마이그레이션 파일들
│   └── config.toml              # Supabase 프로젝트 설정
│
├── docs/                         # 프로젝트 문서 (SSOT)
│   ├── domain/                   # 도메인 지식
│   ├── engine/                   # 엔진 명세
│   ├── product/                  # 제품 기획
│   ├── ui/                       # UI/UX 명세
│   └── meta/                     # 메타 문서
│
├── tests/                        # 테스트 파일
│   ├── e2e/                      # E2E 테스트 (Playwright)
│   └── integration/              # 통합 테스트
│
├── middleware.ts                 # Next.js 미들웨어 (Clerk)
├── components.json                # shadcn/ui 설정
├── package.json                  # 의존성 관리
├── tsconfig.json                 # TypeScript 설정
├── AGENTS.md                     # AI 에이전트 가이드
└── README.md                     # 이 파일
```

## 개발 가이드

### 아키텍처 원칙

1. **SSOT (Single Source of Truth)**

   - 타입: `lib/types/` (절대 수정 금지)
   - 정책: `lib/policy/` (절대 수정 금지)
   - 엔진: `lib/engines/` (절대 수정 금지)

2. **단방향 의존성**

   - UI → Server Actions → Services → Engines → Policy/Types
   - 하위 레이어는 상위 레이어를 import할 수 없음

3. **엔진의 순수성**

   - 외부 I/O 금지 (DB, API, 랜덤 등)
   - 모든 의존성은 파라미터로 주입

4. **정책 기반 유연성**
   - 모든 비즈니스 규칙은 `policy/` 파일에서 제어

### 파일명 규칙

- **일반 소스 코드**: alllowercase.ts (예: `auctionengine.ts`)
- **컴포넌트**: PascalCase.tsx (예: `PropertyCard.tsx`)
- **Server Actions**: kebab-case.ts (예: `generatesimulation.ts`)
- **단위 테스트**: camelCase.test.ts (예: `simulationservice.test.ts`)
- **E2E 테스트**: kebab-case.spec.ts (예: `competitor-analysis.spec.ts`)

### 코딩 컨벤션

- **JSDoc**: 모든 공개 API 및 복잡한 로직에 명확한 주석 작성
- **타입 안정성**: TypeScript strict mode 사용, `any` 사용 금지
- **접근성**: WCAG 2.1 AA 기준 준수
- **성능**: 불필요한 리렌더링 방지, 동적 로딩 활용

자세한 내용은 다음 문서를 참고하세요:

- [AGENTS.md](./AGENTS.md) - 개발 환경 설정 및 컨벤션
- [docs/product/project-structure.md](./docs/product/project-structure.md) - 프로젝트 구조 상세
- [docs/index.ts](./docs/index.ts) - 프로젝트 전체 구조도

## 문서 인덱스

프로젝트의 모든 문서는 `docs/` 디렉토리에 있습니다:

### 제품 기획 문서

- [PRD v2.0](./docs/product/prdv2.md) - 제품 요구사항 문서
- [프로젝트 구조](./docs/product/project-structure.md) - lib 폴더 구조 및 아키텍처
- [TODO v3](./docs/product/todov3.md) - 빌드 계획 및 작업 목록

### UI/UX 문서

- [디자인 시스템](./docs/ui/design-system.md) - 브랜드 통합 디자인 시스템
- [컴포넌트 명세](./docs/ui/component-spec.md) - 컴포넌트 상세 명세
- [컴포넌트 아키텍처](./docs/ui/component-architecture.md) - 컴포넌트 구조

### 엔진 명세

- [API 계약](./docs/engine/api-contracts.md) - 엔진 API 명세
- [경매 플로우](./docs/engine/auction-flow.md) - 경매 엔진 플로우
- [JSON 스키마](./docs/engine/json-schema.md) - 데이터 스키마

### 메타 문서

- [문서 인덱스](./docs/meta/index.md) - 모든 문서의 SSOT
- [CHANGELOG](./docs/meta/changelog.md) - 변경 이력

전체 문서 목록은 [docs/meta/index.md](./docs/meta/index.md)를 참고하세요.

## 추가 리소스

- [Next.js 15 문서](https://nextjs.org/docs)
- [Clerk 문서](https://clerk.com/docs)
- [Supabase 문서](https://supabase.com/docs)
- [shadcn/ui 문서](https://ui.shadcn.com/)
- [Tailwind CSS v4 문서](https://tailwindcss.com/docs)

---

**BIDIX** - Fail Safe, Bid Better. 당신의 경험을, 데이터로 증명하다.
