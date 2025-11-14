# 📋 BIDIX v2.0 상세 빌드 계획 (TODO v3.0)

**Version:** 3.0  
**Strategy:** Skeleton Hybrid (스켈레톤 먼저 → 진짜 구현)  
**Last Updated:** 2025-01-28  
**Status:** 🚧 **Ready for Build**

---

## 📌 전략 개요

### 스켈레톤 하이브리드 전략

1. **Phase 1:** 전체 페이지 구조 및 뼈대 스켈레톤 구축
2. **Phase 2:** 컴포넌트 스켈레톤 배치 (Props만 정의, UI는 placeholder)
3. **Phase 3:** 진짜 구현 (페이지별 + 컴포넌트별)

### 핵심 원칙

- ✅ **`lib/` 계산 로직 절대 수정 금지** (engines, types, policy, generators, services)
- ✅ **UI 레이어만 구축** (app/ 디렉토리)
- ✅ **Design System v2.2 엄격 준수**
- ✅ **Component Spec v2.2 Props 1:1 매핑**
- ✅ **엔진 타입 직접 사용** (DTO/Adapter 생성 금지)

---

## 🚀 Phase 0: 참고 문서 및 개발 규칙 (필독)

### 개발 규칙 준수사항

**참조**: `.cursor/rules/` 폴더의 모든 규칙

#### 1. 파일명 규칙 (Naming Conventions)

- **컴포넌트 파일**: `PascalCase.tsx` (예: `PropertyCard.tsx`)
- **일반 코드 파일**: `camelCase.ts` (예: `auctionEngine.ts`)
- **액션 파일**: `kebab-case.ts` (예: `generate-simulation.ts`)
- **페이지 파일**: `kebab-case.tsx` (예: `page.tsx`, `not-found.tsx`)
- **문서 파일**: `kebab-case.md` (예: `report-result.md`)
- **테스트 파일**: `camelCase.test.ts` (예: `auctionEngine.test.ts`)

#### 2. 아키텍처 원칙 (Architecture)

- **단방향 의존성**: `generators → engines → services → actions → UI`
- **UI에서 금지**: 엔진/서비스 직접 호출, Supabase 직접 호출, 비즈니스 계산
- **엔진 순수성**: DB, fetch, random(), Date.now() 금지
- **Server Actions 우선**: API Routes는 불가피한 경우에만 사용

#### 3. 코드 문서화 (Context Management)

- **파일 상단 100줄 이내**: JSDoc 형식으로 문서화 필수
  ```typescript
  /**
   * @file ComponentName.tsx
   * @description 컴포넌트 설명
   *
   * 주요 기능:
   * 1. 기능 1
   * 2. 기능 2
   *
   * 핵심 구현 로직:
   * - 로직 설명
   *
   * @dependencies
   * - 패키지명 참조
   */
  ```
- **핵심 로직 로그**: `console.group`, `console.log` 추가
  - 서버 및 클라이언트 환경 모두
  - 디버깅 목적 (안정화 후 최소화 고려)

#### 4. TDD 원칙 (Test-Driven Development)

- **테스트 우선**: 기능 구현 전 테스트 케이스 생성
- **Red → Green → Refactor**: 실패 테스트 → 통과 코드 → 리팩토링
- **Tidy First**: 구조의 변경과 동작의 변경 분리
- **테스트 범위**: 긍정/부정적 케이스 모두 포함

#### 5. Supabase 개발 규칙

- **RLS 비활성화**: 개발 환경에서는 RLS 비활성화
- **마이그레이션**: RLS 생성 구문 포함하지 않음

#### 6. 프리미엄 기능 표시

- **잠금 아이콘**: 🔒 이모지 표시
- **브랜드 메시지**: "프리미엄", "해설판" 단어 사용
- **CTA 메시지**: "당신은 이미 물건의 '사실'을 파악했습니다. 이제 '분석'을 시작할 준비가 되셨나요?"

---

## 📚 Phase 0-1: 참고 문서 (필독)

### 핵심 문서 목록

| 문서                   | 경로                                 | 용도                           |
| :--------------------- | :----------------------------------- | :----------------------------- |
| API Contracts          | `docs/engine/api-contracts.md`       | Server Actions/API Routes 명세 |
| User Flow              | `docs/product/user-flow.md`          | 사용자 플로우 차트             |
| Point & Level System   | `docs/product/point-level-system.md` | 점수/레벨 계산 로직            |
| Difficulty Modes       | `docs/system/difficulty-modes.md`    | 난이도별 정책 차이             |
| Report Result          | `docs/product/report-result.md`      | 4종 리포트 상세 명세           |
| JSON Schema            | `docs/engine/json-schema.md`         | AuctionAnalysisResult 구조     |
| Auction Flow           | `docs/engine/auction-flow.md`        | 엔진 실행 흐름                 |
| Design System          | `docs/ui/design-system.md`           | UI/UX 디자인 토큰              |
| Component Spec         | `docs/ui/component-spec.md`          | 컴포넌트 Props 명세            |
| Component Architecture | `docs/ui/component-architecture.md`  | 컴포넌트 구조                  |

### 구현 시 참조 방법

1. **페이지 구현 시**: User Flow 확인
2. **컴포넌트 Props 생성**: Component Spec + JSON Schema 참조
3. **Server Actions 구현**: API Contracts 명세 준수
4. **점수/레벨 표시**: Point & Level System 공식 사용
5. **난이도 필터**: Difficulty Modes 정책 참조
6. **시뮬레이션 흐름 확인**: Auction Flow 다이어그램 이해

---

## 🏗️ Phase 1: 프로젝트 기반 구축 (Foundation)

**📚 필수 참조 문서**:

- `.cursor/rules/web/nextjs-convention.mdc` - Next.js 디렉토리 구조 및 파일명 규칙
- `docs/product/project-structure.md` - 프로젝트 구조 SSOT
- `docs/ui/component-architecture.md` - 컴포넌트 폴더 구조

### 1.1 디렉토리 구조 생성

- [x] `/app` 페이지 라우팅 구조 생성

  - [x] `/app/page.tsx` (Landing) - 브랜드 메시지 중심
  - [x] `/app/dashboard/page.tsx` - 사용자 대시보드
  - [x] `/app/simulations/page.tsx` - 시뮬레이션 목록
  - [x] `/app/simulations/[id]/page.tsx` - 시뮬레이션 상세
  - [x] `/app/simulations/[id]/bid/page.tsx` - 입찰 페이지
  - [x] `/app/simulations/[id]/result/page.tsx` - 결과 페이지 (핵심)
  - [x] `/app/history/page.tsx` - 히스토리 페이지

- [x] `/components` 컴포넌트 폴더 구조 생성
  - [x] `/components/ui/` (shadcn - 이미 존재)
  - [x] `/components/common/` - 공통 컴포넌트
  - [x] `/components/dashboard/` - 대시보드 전용
  - [x] `/components/simulations/` - 시뮬레이션 관련
  - [x] `/components/bid/` - 입찰 관련
  - [x] `/components/result/` - 결과 관련
  - [x] `/components/reports/` - 리포트 관련 (Premium)

### 1.2 공통 레이아웃 구성

- [x] RootLayout 확인 및 개선 (`app/layout.tsx`)

  - [x] Navbar 통합 확인
  - [x] ClerkProvider 확인
  - [x] SyncUserProvider 확인
  - [x] 메타데이터 업데이트 (BIDIX 브랜드)
  - [x] 다크모드 Provider (선택적)

- [x] Navbar 컴포넌트 개선 (`components/Navbar.tsx`)
  - [x] 로고 및 브랜드명 표시 ("BIDIX")
  - [x] 내비게이션 링크 (Dashboard, Simulations, History)
  - [x] 사용자 정보 및 로그아웃
  - [ ] 사용량 표시 (예: 5회 제한) - 선택적

### 1.3 shadcn/ui 컴포넌트 설치 확인

- [x] 이미 설치된 컴포넌트 확인
  - [x] Button
  - [x] Card
  - [x] Input
  - [x] Label
  - [x] Form
  - [x] Dialog
  - [x] Accordion
  - [x] Textarea
- [x] 추가 필요 컴포넌트 설치
  - [x] `npx shadcn@latest add table`
  - [x] `npx shadcn@latest add badge`
  - [x] `npx shadcn@latest add separator`
  - [x] `npx shadcn@latest add tabs`
  - [x] `npx shadcn@latest add alert`
  - [x] `npx shadcn@latest add skeleton`

---

## 🧩 Phase 2: 컴포넌트 스켈레톤 생성

**📚 필수 참조 문서**:

- `docs/ui/component-spec.md` - 모든 컴포넌트 Props 타입 정의 (SSOT)
- `docs/ui/component-architecture.md` - 컴포넌트 폴더 구조 및 레이아웃
- `docs/engine/json-schema.md` - AuctionAnalysisResult 구조 (타입 검증)
- `.cursor/rules/common/bidix-custom-rules.mdc` - 컴포넌트 파일명 규칙 (PascalCase)

**개발 규칙 준수**:

- ✅ 파일명 `PascalCase.tsx` (예: `SectionHeader.tsx`)
- ✅ 파일 상단 100줄 이내 JSDoc 문서화
- ✅ Props 타입 Component Spec v2.2 엄격 준수
- ✅ UI에서 엔진/서비스 직접 호출 금지
- ✅ 엔진 타입 직접 import (`@/lib/types`)

### 2.1 Common Components (공통)

- [ ] `components/common/SectionHeader.tsx`
  ```typescript
  interface SectionHeaderProps {
    title: string;
    description?: string;
  }
  ```
- [ ] `components/common/SectionCard.tsx`
  ```typescript
  interface SectionCardProps {
    children: React.ReactNode;
    title?: string;
  }
  ```
- [ ] `components/common/DataRow.tsx`
  ```typescript
  interface DataRowProps {
    label: string;
    value: string | number;
    type?: "text" | "currency" | "percentage";
  }
  ```
- [ ] `components/common/Badge.tsx` (난이도/등급 표시)
- [ ] `components/common/ErrorState.tsx`
- [ ] `components/common/EmptyState.tsx`

### 2.2 Dashboard Components

- [ ] `components/dashboard/QuickStats.tsx`
  ```typescript
  interface QuickStatsProps {
    level: number;
    totalScore: number;
    simulationCount: number;
  }
  ```
- [ ] `components/dashboard/RecentSimulations.tsx`
  ```typescript
  interface RecentSimulationsProps {
    simulations: SimulationListItem[];
  }
  ```
- [ ] `components/dashboard/UsageIndicator.tsx`
  ```typescript
  interface UsageIndicatorProps {
    used: number;
    limit: number;
  }
  ```

### 2.3 Simulation Components

- [ ] `components/simulations/SimulationList.tsx` (Client Component)
- [ ] `components/simulations/FilterBar.tsx`
  ```typescript
  interface FilterBarProps {
    onFilterChange: (filters: FilterState) => void;
  }
  ```
- [ ] `components/simulations/PropertyCard.tsx`
  ```typescript
  import { Property } from "@/lib/types";
  interface PropertyCardProps {
    property: Property;
    valuation: { minBid: number };
  }
  ```
- [ ] `components/simulations/SaleStatementSummary.tsx`
  ```typescript
  import { Property, CourtDocsNormalized } from "@/lib/types";
  interface SaleStatementSummaryProps {
    property: Property;
    courtDocs: CourtDocsNormalized;
  }
  ```
- [ ] `components/simulations/RightsSummary.tsx`
  ```typescript
  import { Rights } from "@/lib/types";
  interface RightsSummaryProps {
    rights: Rights;
  }
  ```

### 2.4 Bid Components

- [ ] `components/bid/QuickFacts.tsx`
  ```typescript
  import { Valuation } from "@/lib/types";
  interface QuickFactsProps {
    valuation: Valuation; // exitPrice3m/6m/12m 포함
  }
  ```
- [ ] `components/bid/BidAmountInput.tsx`
  ```typescript
  interface BidAmountInputProps {
    initialValue?: number;
    onSubmit: (bid: number) => void;
  }
  ```
- [ ] `components/bid/BidGuidanceBox.tsx`
  ```typescript
  import { Valuation } from "@/lib/types";
  interface BidGuidanceBoxProps {
    valuation: Valuation;
  }
  ```

### 2.5 Result Components

- [ ] `components/result/BidOutcomeBlock.tsx`
  ```typescript
  import { AuctionSummary } from "@/lib/types";
  interface BidOutcomeBlockProps {
    summary: AuctionSummary; // isProfitable3m/6m/12m 포함
    userBid: number;
  }
  ```
- [ ] `components/result/MetricsStrip.tsx`
  ```typescript
  import { Profit, ScoreBreakdown } from "@/lib/types";
  interface MetricsStripProps {
    profit: Profit; // initialSafetyMargin, scenarios[]
    score: ScoreBreakdown;
  }
  ```
- [ ] `components/result/ExitScenarioTable.tsx`
  ```typescript
  import { ProfitScenario } from "@/lib/types";
  interface ExitScenarioTableProps {
    scenarios: ProfitScenario[]; // 3개 보유기간 모두 표시
  }
  ```
- [ ] `components/result/PremiumReportCTA.tsx`
  ```typescript
  interface PremiumReportCTAProps {
    type: "rights" | "profit" | "auction";
  }
  ```
- [ ] `components/result/ResultActions.tsx`
  ```typescript
  interface ResultActionsProps {
    simulationId: string;
  }
  ```

### 2.6 Premium Report Components (아직 잠금 상태)

- [ ] `components/reports/RightsAnalysisReport.tsx` (잠금 UI만)
- [ ] `components/reports/ProfitAnalysisReport.tsx` (잠금 UI만)
- [ ] `components/reports/AuctionAnalysisReport.tsx` (잠금 UI만)
- [ ] `components/reports/SaleStatementReport.tsx` (첫 1회 무료)

---

## 🎨 Phase 3: 페이지별 진짜 구현

**📚 공통 필수 참조 문서**:

- `docs/product/user-flow.md` - 사용자 플로우 차트 (페이지 순서 확인)
- `docs/ui/design-system.md` - UI/UX 디자인 토큰 및 가이드
- `.cursor/rules/web/nextjs-convention.mdc` - Next.js 파일명 규칙 (kebab-case)
- `.cursor/rules/common/vibe-coding.mdc` - 코드 문서화 및 로그 추가 규칙

**개발 규칙 준수**:

- ✅ 파일명 `kebab-case.tsx` (예: `page.tsx`, `not-found.tsx`)
- ✅ 컴포넌트는 `PascalCase`
- ✅ 파일 상단 100줄 이내 JSDoc 문서화 필수
- ✅ 핵심 로직에 `console.group`, `console.log` 추가
- ✅ Server Actions 우선 사용 (API Routes는 불가피한 경우만)
- ✅ UI에서 엔진/서비스 직접 호출 절대 금지

### 3.1 Landing Page (`/`)

**우선순위:** ⭐⭐  
**📚 추가 참조 문서**: `docs/product/prdv2.md` - 브랜드 메시지 및 프로로고

- [ ] 히어로 섹션
  - [ ] 브랜드 로고 및 프로로고("Fail Safe, Bid Better")
  - [ ] 주요 가치 제안 메시지
  - [ ] CTA 버튼 (원가로 시작하기)
- [ ] 주요 기능 소개 섹션
- [ ] Footer

**예상 소요:** 2-3시간

---

### 3.2 Dashboard (`/dashboard`)

**우선순위:** ⭐⭐⭐⭐  
**📚 필수 참조 문서**:

- `docs/product/user-flow.md` - Usage 조회 및 시뮬레이션 생성 플로우
- `docs/product/point-level-system.md` - 점수/레벨/티어 계산 로직 (SSOT)
- `docs/engine/api-contracts.md` - `/api/scores`, `/api/usage` 명세
- `docs/ui/component-spec.md` - QuickStats, UsageIndicator Props

- [ ] **Server Component로 구현**
- [ ] 데이터 Fetch
  - [ ] 사용자 통계 (레벨, 점수, 총 시뮬레이션 수)
    - API 호출: `GET /api/scores`
    - 표시: 레벨, 티어(Bronze/Silver/Gold...), 총 점수
  - [ ] 최근 시뮬레이션 3개
    - Supabase `simulations` 테이블에서 조회
    - `ORDER BY created_at DESC LIMIT 3`
  - [ ] 일일 사용량 (5회 제한)
    - API 호출: `GET /api/usage`
    - 표시: `used / limit` (예: 2/5)
- [ ] UI 구성
  - [ ] 환영 메시지 헤더
    - "안녕하세요 {userName}님"
    - 현재 레벨 및 티어 표시
  - [ ] `<UsageIndicator used={2} limit={5} />` 배치
    - 프로그레스바 형태
    - 남은 횟수 강조
    - 5회 초과 시 "일일 표시 제도해주세요" 메시지
  - [ ] `<QuickStats level={3} totalScore={1240} simulationCount={47} />` 배치
    - 3개 카드 레이아웃 (레벨 / 점수 / 총 시뮬레이션 수)
    - 점수 계산 공식: `point-level-system.md` 참조
  - [ ] `<RecentSimulations simulations={[...]} />` 배치
    - PropertyCard 형태로 표시
    - 클릭 시 결과 페이지로 이동
  - [ ] "새로운 시뮬레이션 생성" 버튼 (Server Action 연결)
    - 난이도 선택 드롭다운 (Easy/Normal/Hard)
    - 사용량 체크 (5회 초과 시 비활성화)
- [ ] Server Action 연결
  - [ ] `generateSimulationAction(difficulty)` 호출
  - [ ] 로딩 상태 표시
  - [ ] 생성 시 `/simulations/[id]`로 리다이렉트
  - [ ] 에러 처리 (사용량 초과, 네트워크 에러 등)
- [ ] 로그 추가
  - [ ] 사용량 조회 로그
  - [ ] 시뮬레이션 생성 요청 로그
  - [ ] 리다이렉트 로그

**예상 소요:** 4-5시간

---

### 3.3 Simulation List (`/simulations`)

**우선순위:** ⭐⭐⭐⭐  
**📚 필수 참조 문서**:

- `docs/system/difficulty-modes.md` - Easy/Normal/Hard 모드 설명 및 정책 차이
- `docs/ui/component-spec.md` - PropertyCard, FilterBar Props
- `docs/engine/json-schema.md` - Property, Valuation 타입 구조

- [ ] **Hybrid:** Server Component (데이터 fetch) + Client Component (필터)
- [ ] 데이터 Fetch
  - [ ] Supabase에서 모든 시뮬레이션 조회
  - [ ] Property 및 Valuation 데이터 포함
  - [ ] `difficulty`, `property.type`, `address` 필드 포함
- [ ] UI 구성
  - [ ] 페이지 헤더
    - 제목: "시뮬레이션 목록"
    - 전체 개수 표시
  - [ ] `<FilterBar />` (Client Component)
    - 난이도 필터: All / Easy / Normal / Hard
      - Easy: 🟢 튜토리얼
      - Normal: 🟡 일반 연습
      - Hard: 🔴 고화 챌린지
    - 매물 타입 필터: All / Apartment / Officetel / Villa / Land 등
    - 지역별 필터 (선택적): 서울/경기/부천 등
    - 필터 상태를 URL query에 반영 (`?difficulty=easy&type=apartment`)
  - [ ] `<PropertyCard />` 그리드 레이아웃
    - 2-3열 그리드 레이아웃 (Desktop)
    - 1열 레이아웃 (Mobile)
    - 각 카드 표시 정보:
      - 매물 타입 및 주소
      - 감정가 (`appraisalValue`)
      - 최저 입찰가 (`minBid`)
      - 난이도 배지 (시각 구분)
    - 빈 상태: "시뮬레이션이 없습니다" EmptyState
  - [ ] "새로운 시뮬레이션 생성" 버튼
    - 페이지 하단 고정
    - 난이도 선택 드롭다운으로 이동
- [ ] 필터링 로직 (Client)
  - [ ] 난이도별 필터 (Easy/Normal/Hard)
    - `difficulty-modes.md` 설명 툴팁 추가
  - [ ] 매물 타입별 필터 (Apartment/Villa/Land...)
  - [ ] 지역별 필터 (선택적)
  - [ ] 필터 변경 시 즉시 반영
- [ ] 클릭 시 `/simulations/[id]`로 이동

**예상 소요:** 5-6시간

---

### 3.4 Simulation Detail (`/simulations/[id]`)

**우선순위:** ⭐⭐⭐⭐  
**📚 필수 참조 문서**:

- `docs/ui/component-spec.md` - SaleStatementSummary, RightsSummary Props
- `docs/engine/json-schema.md` - Property, CourtDocsNormalized, Rights 타입
- `docs/engine/auction-flow.md` - 입찰 전 초기 시뮬레이션 구조

- [ ] **Server Component**
- [ ] 데이터 Fetch
  - [ ] Supabase에서 시뮬레이션 데이터 조회
  - [ ] Property, CourtDocs, Rights 데이터 포함
- [ ] UI 구성
  - [ ] 헤더 (사건번호, 난이도 배지)
  - [ ] `<SaleStatementSummary property={} courtDocs={} />`
  - [ ] `<RightsSummary rights={} />`
  - [ ] "입찰하기" CTA 버튼 → `/simulations/[id]/bid`
- [ ] 반응형 레이아웃
  - [ ] 2열 레이아웃 (Desktop)
  - [ ] 1열 레이아웃 (Mobile)

**예상 소요:** 4-5시간

---

### 3.5 Bid Page (`/simulations/[id]/bid`)

**우선순위:** ⭐⭐⭐⭐  
**📚 필수 참조 문서**:

- `docs/ui/component-spec.md` - QuickFacts, BidAmountInput, BidGuidanceBox Props
- `docs/engine/json-schema.md` - Valuation 타입(exitPrice3m/6m/12m 구조)
- `docs/engine/api-contracts.md` - `submitBidAction` 명세
- `docs/engine/auction-flow.md` - 입찰 제출 시뮬레이션 흐름

- [ ] **Hybrid:** Server Component (데이터) + Client Component (입력)
- [ ] 데이터 Fetch
  - [ ] Property, Valuation 데이터 조회
- [ ] UI 구성
  - [ ] 페이지 헤더
  - [ ] `<QuickFacts valuation={} />`
    - [ ] adjustedFMV 표시
    - [ ] minBid 표시
    - [ ] exitPrice3m/6m/12m 표시 (v2.2 핵심 변경)
  - [ ] `<BidGuidanceBox valuation={} />`
    - [ ] 안전마진 설명
    - [ ] 권장 입찰가 범위
  - [ ] `<BidAmountInput onSubmit={} />` (Client Component)
    - [ ] 숫자 입력 검증
    - [ ] 최저 입찰가 검증
- [ ] Server Action 연결
  - [ ] `submitBidAction(simulationId, userBid)` 호출
  - [ ] 제출 시 `/simulations/[id]/result`로 리다이렉트
- [ ] 로그 추가
  - [ ] 입찰가 입력 로그
  - [ ] Server Action 호출 로그
  - [ ] 결과 리다이렉트 로그

**예상 소요:** 5-6시간

---

### 3.6 Result Page (`/simulations/[id]/result`) - 핵심 페이지

**우선순위:** ⭐⭐⭐⭐ (핵심 페이지)  
**📚 필수 참조 문서**:

- `docs/product/report-result.md` - 4종 리포트 상세 명세 (Premium CTA 메시지)
- `docs/product/point-level-system.md` - 점수 계산 공식 및 등급 체계 (SSOT)
- `docs/engine/auction-flow.md` - 결과 페이지 데이터 플로우
- `docs/engine/json-schema.md` - AuctionAnalysisResult 전체 구조 (SSOT)
- `docs/ui/component-spec.md` - 모든 Result 컴포넌트 Props
- `docs/ui/design-system.md` - 색상 토큰 (등급별 색상: S/A/B/C/D)

- [ ] **Server Component**
- [ ] 데이터 Fetch
  - [ ] Supabase에서 시뮬레이션 결과 조회
  - [ ] 필수 데이터 `AuctionAnalysisResult` 전체
    - property, valuation, rights, costs, profit, courtDocs, summary
  - [ ] userBid, score 데이터 포함
  - [ ] 데이터 검증 `json-schema.md` 구조 확인
- [ ] UI 구성 (단계별 순서)

  1. [ ] `<BidOutcomeBlock summary={} userBid={} />`

     - [ ] 입찰 성공/실패/근접 표시
       - userBid vs minBid 비교
       - 상태별 색상 (success: green, fail: red, close: yellow)
     - [ ] summary.grade 표시 (S/A/B/C/D)
       - 등급별 색상: `point-level-system.md` 참조
     - [ ] summary.isProfitable3m/6m/12m 표시
       - 3개 체크마크 (✅/ ❌)
     - [ ] 브랜드 메시지 표시
       - 성공: "축하합니다! 입찰에 성공하셨습니다."
       - 실패: "입찰에 실패하셨습니다. 하지만 괜찮으니 이게 바로 BIDIX가 존재하는 이유입니다."

  2. [ ] `<MetricsStrip profit={} score={} />`

     - [ ] 3개 주요 지표 카드
       - 초기 안전마진 (profit.initialSafetyMargin)
         - 백분율 표시 (예: 7.8%)
         - 설명: "FMV 대비 초기 마진"
       - 최적 ROI (profit.scenarios 중 최고값)
         - 백분율 표시 (예: 22.4%)
         - 보유기간 표시 (예: "12개월 기준")
       - 최종 점수 (score.finalScore)
         - 1000점 만점
         - 등급 표시 (S/A/B/C/D)
     - [ ] 점수 구성 상세 (접기/펼치기)
       - Accuracy Score: X/400
       - Profitability Score: X/400
       - Risk Control Score: X/200
       - 총 점수 계산 근거: `point-level-system.md`

  3. [ ] `<ExitScenarioTable scenarios={profit.scenarios} />`

     - [ ] 3개월/6개월/12개월 비교 테이블
     - [ ] 컬럼:
       - 보유기간 (months)
       - 매각가 (exitPrice)
       - 총비용 (totalCost)
       - 순이익 (netProfit)
       - ROI (roi)
       - 연환산 ROI (annualizedRoi)
     - [ ] 최적 시나리오 하이라이트
       - bestHoldingPeriod 강조
     - [ ] 금액 포맷: `toLocaleString()`
     - [ ] 모바일 스크롤 가능한 테이블

  4. [ ] Premium Report CTAs

     - [ ] `<PremiumReportCTA type="rights" />` 섹션
       - 제목: "권리 분석 상세 리포트"
       - 설명: "임대 권리 관계, 우선순위 분석, 명도비용 상세"
       - 미리보기: `report-result.md` Section 1 참조
     - [ ] `<PremiumReportCTA type="profit" />` 섹션
       - 제목: "수익 분석 상세 리포트"
       - 설명: "비용 구조, 수익 시나리오, 수익분기점 분석"
       - 미리보기: `report-result.md` Section 2 참조
     - [ ] `<PremiumReportCTA type="auction" />` 섹션
       - 제목: "경매 분석 상세 리포트"
       - 설명: "입찰 전략의 점수 상세, 개선 포인트"
       - 미리보기: `report-result.md` Section 3 참조
     - [ ] 무료 리포트 1회 제공
       - "매각물건명세서 해설판" 첫 1회 무료
       - 사용량 체크 (`GET /api/usage`)
     - [ ] 잠금 UI
       - 🔒 아이콘
       - "로그인하기" 버튼 (v2.2에서는 비활성)
       - 브랜드 메시지: "당신은 이미 물건의 '사실'을 파악했습니다. 이제 '분석'을 시작할 준비가 되셨나요?"

  5. [ ] `<ResultActions simulationId={} />`
     - [ ] "히스토리 저장" 버튼
       - `saveHistoryAction(simulationId)` 호출
       - 이미 저장된 경우: "저장됨" 표시
     - [ ] "다음 연습" 버튼
       - 새로운 시뮬레이션 생성 플로우로 이동
       - Dashboard로 리다이렉트

- [ ] 스타일링

  - [ ] Design System v2.2 엄격 준수
    - `design-system.md` 색상 토큰 사용
    - Financial Clarity 원칙 준수
  - [ ] 섹션 및 Separator
    - `<Separator />` 컴포넌트 사용
  - [ ] 카드 레이아웃
    - shadcn/ui `<Card />` 사용
    - 섹션별 헤딩 및 그림자
  - [ ] 반응형
    - Desktop: 2열 레이아웃 (지표 카드)
    - Mobile: 1열 레이아웃

- [ ] 로그 추가
  - [ ] 결과 페이지 로드 로그
    - `console.group("Result Page Data")`
    - 전체 데이터 구조 출력
  - [ ] 각 섹션 헤더별 로그
    - BidOutcomeBlock 헤더
    - MetricsStrip 계산 값
    - ExitScenarioTable 데이터
  - [ ] Premium CTA 클릭 로그
  - [ ] 에러 로그 (데이터 없음, 형식 오류 등)

**예상 소요:** 8-10시간

---

### 3.7 History Page (`/history`)

**우선순위:** ⭐⭐  
**📚 필수 참조 문서**:

- `docs/engine/api-contracts.md` - `GET /api/history` 명세 (페이지네이션 포함)
- `docs/product/point-level-system.md` - 등급별 색상 체계
- `docs/ui/design-system.md` - 테이블 레이아웃 가이드

- [ ] **Server Component**
- [ ] 데이터 Fetch
  - [ ] API 호출: `GET /api/history`
  - [ ] 페이지네이션 `?limit=20&cursor=...`
  - [ ] 데이터 포함:
    - historyId, simulationId
    - savedAt (저장 날짜)
    - propertyType, address
    - myBid, outcome (success/fail/close)
    - score, grade
    - initialSafetyMargin
- [ ] UI 구성
  - [ ] 페이지 헤더
    - 제목: "입찰 히스토리"
    - 전체 개수 표시
  - [ ] 테이블 형식 리스트
    - 컬럼:
      - 날짜 (savedAt)
      - 매물 정보 (type + address)
      - 입찰가 (myBid)
      - 결과 (outcome)
        - 성공: ✅ 입찰
        - 실패: ❌ 입찰
        - 근접: ⚠️ 근소 차이
      - 점수 (score)
      - 등급 (grade: S/A/B/C/D)
        - 등급별 색상: `point-level-system.md`
    - 모바일 카드 형식으로 변환
  - [ ] 클릭 시 결과 페이지로 이동
    - `/simulations/{simulationId}/result`
  - [ ] 정렬 기능
    - 최신순 (기본)
    - 점수 높은 순
    - 점수 낮은 순
  - [ ] 페이지네이션
    - "더보기" 버튼
    - nextCursor 기반 로딩
  - [ ] 빈 상태
    - "아직 저장된 히스토리가 없습니다"
    - "새로운 시뮬레이션 시작하기" CTA
- [ ] 필터링 (선택적)
  - [ ] 난이도별 (Easy/Normal/Hard)
  - [ ] 결과별 (Success/Fail/Close)
  - [ ] 날짜 범위 (최근 7일/30일/전체)
- [ ] 통계 요약 (선택)
  - [ ] 총 시뮬레이션 수
  - [ ] 평균 점수
  - [ ] 최고 등급
  - [ ] 입찰 성공률

**예상 소요:** 4-5시간

---

## ⚙️ Phase 4: Server Actions 및 API Routes 구현

**📚 필수 참조 문서**:

- `docs/engine/api-contracts.md` - Server Actions 및 API Routes 명세 (SSOT)
- `docs/engine/auction-flow.md` - 시뮬레이션 흐름 (UI → Action → Service → Engine)
- `.cursor/rules/common/bidix-development-rules.mdc` - 아키텍처 원칙 (단방향 의존성)
- `.cursor/rules/web/nextjs-convention.mdc` - Server Actions 우선 사용 원칙

**개발 규칙 준수**:

- ✅ 액션 파일명 `kebab-case.ts` (예: `generate-simulation.ts`)
- ✅ 아키텍처: `actions → services → engines` (역방향 금지)
- ✅ Server Actions 역할: Zod 검증 + service 호출만
- ✅ 파일 상단 100줄 이내 JSDoc 문서화
- ✅ 핵심 로직 로그 추가

### 4.1 기존 Server Actions 확인

- [x] `app/action/generatesimulation.ts` - 확인 필요 (기존 코드 검토)
- [x] `app/action/submitbid.ts` - 확인 필요 (기존 코드 검토)

### 4.2 추가 필요 Server Actions

- [ ] `app/action/savehistory.ts`
  ```typescript
  export async function saveHistoryAction(simulationId: string) {
    // DB에 히스토리 저장
    // @see docs/engine/api-contracts.md
  }
  ```

### 4.3 API Routes 구현 (데이터 조회)

**참조**: `docs/engine/api-contracts.md`

- [ ] `app/api/history/route.ts`

  ```typescript
  // GET /api/history
  // 사용자의 입찰 히스토리 목록 조회
  // 쿼리: ?limit=20, ?cursor=...
  // Response: { items: [], nextCursor: string }
  ```

  - [ ] Clerk `auth()` 인증 확인
  - [ ] Supabase에서 히스토리 조회
  - [ ] 페이지네이션 처리
  - [ ] 에러 처리

- [ ] `app/api/scores/route.ts`

  ```typescript
  // GET /api/scores
  // 사용자의 점수, 레벨, 등급 정보 조회
  // Response: { level, score, tier, totalSimulations }
  ```

  - [ ] Clerk `auth()` 인증 확인
  - [ ] Supabase `scores` 테이블 조회
  - [ ] Point & Level System 공식 사용
  - [ ] 에러 처리

- [ ] `app/api/usage/route.ts`
  ```typescript
  // GET /api/usage
  // 오늘 사용량 및 제도 정보 조회
  // Response: { date, bids: { used, limit, remaining }, freeReport: {...} }
  ```
  - [ ] Clerk `auth()` 인증 확인
  - [ ] Supabase `usage` 테이블 조회
  - [ ] 일일 리셋 로직 (자정 기준)
  - [ ] 에러 처리

### 4.4 인증 및 에러 처리 공통 규칙

**참조**: `docs/engine/api-contracts.md` Section 3

- [ ] 모든 Server Actions/API Routes에서 Clerk `auth()` 사용
- [ ] 미인증 요청 에러 처리
- [ ] Server Actions: `{ ok: false, error: "..." }` 형식
- [ ] API Routes: `{ "error": "..." }` + 4xx/5xx 상태 코드

---

## 🎨 Phase 5: 스타일링 및 반응형

**📚 필수 참조 문서**:

- `docs/ui/design-system.md` - Tailwind Design Tokens 및 색상 체계 (SSOT)
- `docs/ui/component-architecture.md` - 컴포넌트 레이아웃 가이드
- `.cursor/rules/web/nextjs-convention.mdc` - Tailwind CSS 사용 규칙

### 5.1 Design System 사용

- [ ] Tailwind Design Tokens 확인 (`app/globals.css`)
  - [ ] --primary, --success, --warning, --danger 색상
  - [ ] --border, --background 색상
- [ ] 다크모드 지원 (선택적)

### 5.2 반응형 레이아웃

- [ ] Mobile (< 768px)
  - [ ] 1열 레이아웃
  - [ ] 햄버거 메뉴 (선택적)
- [ ] Tablet (768px ~ 1024px)
  - [ ] 2열 레이아웃
- [ ] Desktop (> 1024px)
  - [ ] 2-3열 레이아웃

### 5.3 컴포넌트 스타일링

- [ ] 모든 컴포넌트에 Tailwind 클래스 사용
- [ ] shadcn/ui 기본 커스터마이징 최소화
- [ ] 금액 표시 포맷팅 (`toLocaleString()`)
- [ ] 백분율 표시 포맷팅

---

## 🧪 Phase 6: 테스트 및 디버깅

**📚 필수 참조 문서**:

- `.cursor/rules/common/tdd.mdc` - TDD 원칙 및 Red → Green → Refactor 사이클
- `.cursor/rules/web/playwright-test-guide.mdc` - Playwright E2E 테스트 작성 가이드
- `docs/engine/json-schema.md` - 데이터 구조 검증 기준
- `docs/product/user-flow.md` - 테스트 시나리오 생성 기준

**개발 규칙 준수**:

- ✅ TDD 원칙: 테스트 먼저 생성 (Red → Green → Refactor)
- ✅ 테스트 파일명 `camelCase.test.ts` (예: `auctionEngine.test.ts`)
- ✅ 테스트 범위: 긍정/부정적 케이스 모두 포함
- ✅ E2E 테스트 Playwright 사용 (`.spec.ts` 파일명)

### 6.1 기능 테스트 (TDD 원칙 적용)

- [ ] 시뮬레이션 생성 플로우
  1. [ ] Dashboard에서 "새로운 시뮬레이션 생성" 클릭
  2. [ ] 시뮬레이션 생성 확인
  3. [ ] 상세 페이지 이동 확인
- [ ] 입찰 플로우
  1. [ ] 시뮬레이션 상세에서 "입찰하기" 클릭
  2. [ ] 입찰가 입력 및 제출
  3. [ ] 결과 페이지 이동 확인
- [ ] 결과 확인 플로우
  1. [ ] 결과 페이지 데이터 확인
  2. [ ] 모든 섹션 헤더 확인
  3. [ ] Premium 잠금 UI 확인

### 6.2 Chrome DevTools MCP 사용

- [ ] 브라우저 개발자 도구 로그 확인
- [ ] 네트워크 요청 확인
- [ ] 콘솔 에러 확인
- [ ] 헤더 기능 확인

### 6.3 에러 처리

- [ ] 데이터 없을 시 EmptyState 표시
- [ ] 로딩 시 Skeleton UI 표시
- [ ] 에러 발생 시 ErrorState 표시
- [ ] 명확한 에러 메시지

---

## 🚀 Phase 7: 최적화 및 마무리

**📚 필수 참조 문서**:

- `docs/ui/design-system.md` - SEO 및 메타데이터 가이드
- `.cursor/rules/common/vibe-coding.mdc` - 코드 품질 및 문서화 규칙
- `docs/product/project-structure.md` - 프로젝트 구조 최종 확인

### 7.1 성능 최적화

- [ ] 이미지 최적화 (Next.js Image 컴포넌트)
- [ ] 코드 스플리팅 확인
- [ ] 불필요한 리렌더링 방지

### 7.2 SEO 및 메타데이터

- [ ] 각 페이지 메타데이터 설정
- [ ] OG 이미지 설정
- [ ] 시맨틱 HTML 확인

### 7.3 접근성 (a11y)

- [ ] 키보드 내비게이션 확인
- [ ] ARIA 라벨 추가
- [ ] 색상 대비 확인

### 7.4 문서화

- [ ] README 업데이트
- [ ] CHANGELOG 생성
- [ ] 주요 컴포넌트 JSDoc 추가

---

## ✅ 체크리스트 요약

### 필수 (MVP)

- [ ] Phase 1: 프로젝트 기반 구축 완료
- [ ] Phase 2: 컴포넌트 스켈레톤 생성 완료
- [ ] Phase 3.2: Dashboard 구현 ⭐⭐⭐⭐
- [ ] Phase 3.3: Simulation List 구현 ⭐⭐⭐⭐
- [ ] Phase 3.4: Simulation Detail 구현 ⭐⭐⭐⭐
- [ ] Phase 3.5: Bid Page 구현 ⭐⭐⭐⭐
- [ ] Phase 3.6: Result Page 구현 ⭐⭐⭐⭐

### 중요

- [ ] Phase 3.1: Landing Page 구현 ⭐⭐
- [ ] Phase 3.7: History Page 구현 ⭐⭐
- [ ] Phase 4: Server Actions 및 API Routes
- [ ] Phase 5: 스타일링 및 반응형
- [ ] Phase 6: 테스트 및 디버깅

### 선택

- [ ] 다크모드 지원
- [ ] 고급 필터링
- [ ] 애니메이션 효과

---

## ⏱️ 예상 소요 시간

|  Phase   | 작업 내용                    |   예상 소요   | 비고                       |
| :------: | :--------------------------- | :-----------: | :------------------------- |
|    0     | 참고 문서 학습               |    1-2시간    | 7개 핵심 문서 읽기         |
|    1     | 프로젝트 기반 구축           |    2-3시간    | 디렉토리, shadcn 설치      |
|    2     | 컴포넌트 스켈레톤 생성       |    4-5시간    | Props 정의, placeholder UI |
|   3.1    | Landing Page                 |    2-3시간    | 브랜드 메시지 중심         |
|   3.2    | Dashboard                    |    4-5시간    | Usage, Stats, API 연동     |
|   3.3    | Simulation List              |    5-6시간    | 필터링, 리스트 UI          |
|   3.4    | Simulation Detail            |    4-5시간    | CourtDocs, Rights 표시     |
|   3.5    | Bid Page                     |    5-6시간    | QuickFacts, Valuation 표시 |
|   3.6    | Result Page (핵심)           |   8-10시간    | 4종 리포트 CTA, 점수 표시  |
|   3.7    | History Page                 |    4-5시간    | 테이블, 페이지네이션       |
|    4     | Server Actions 및 API Routes |    4-6시간    | 3개 API Routes 추가        |
|    5     | 스타일링 및 반응형           |    4-5시간    | Design System 사용         |
|    6     | 테스트 및 디버깅             |    5-6시간    | Chrome DevTools MCP 사용   |
|    7     | 최적화 및 마무리             |    3-4시간    | SEO, a11y, 문서화          |
| **총계** |                              | **56-72시간** | 평균 64시간 (약 8일 작업)  |

### 우선순위별 분류

| 우선순위 | 페이지/기능                               | 시간      |
| :------: | :---------------------------------------- | :-------- |
| ⭐⭐⭐⭐ | Dashboard, Simulation Detail, Bid, Result | 21-26시간 |
| ⭐⭐⭐⭐ | Simulation List                           | 5-6시간   |
|   ⭐⭐   | Landing, History                          | 6-8시간   |
|   기반   | Phase 0,1,2,4,5,6,7                       | 24-32시간 |

---

## ⚠️ 주의사항

### 절대 금지 사항 목록

- ❌ `lib/engines/` 코드 수정
- ❌ `lib/types/` 타입 정의 수정
- ❌ `lib/policy/` 정책 값 수정
- ❌ `lib/generators/` 생성 로직 수정
- ❌ `lib/services/` 서비스 로직 수정

### 반드시 준수사항

- ✅ Component Spec v2.2의 Props 타입 엄격 사용
- ✅ Design System v2.2의 디자인 가이드 준수
- ✅ 엔진 결과를 그대로 UI에 바인딩 (DTO/Adapter 생성 금지)
- ✅ 모든 금액에 `toLocaleString()` 사용
- ✅ 핵심 로직에 `console.log` 추가
- ✅ v2.2 핵심 변경사항 준수:
  - ExitPrice: 단일 → exitPrice3m/6m/12m 분리
  - Profit: 단일 ROI → scenarios 배열 (3개 기간)
  - Summary: 단일 isProfitable → isProfitable3m/6m/12m

### 개발 워크플로우

1. **스켈레톤 먼저**: 전체 구조를 먼저 만들기
2. **문서화**: 각 파일 상단 100줄 이내 JSDoc 생성
3. **TDD 적용**: 테스트 케이스 생성 → 구현 → 리팩토링
4. **페이지 단위**: 각 페이지를 완성하고
5. **로그 추가**: 핵심 로직에 `console.group`, `console.log` 추가
6. **테스트**: 각 페이지 생성 시 바로 테스트
7. **반복**: 다음 페이지로 이동

### 파일명 체크리스트

구현 시 파일명 규칙 준수 확인:

- [ ] 컴포넌트: `PascalCase.tsx` (예: `PropertyCard.tsx`)
- [ ] 페이지: `kebab-case.tsx` (예: `page.tsx`, `not-found.tsx`)
- [ ] 액션: `kebab-case.ts` (예: `generate-simulation.ts`)
- [ ] 테스트: `camelCase.test.ts` (예: `auctionEngine.test.ts`)
- [ ] E2E 테스트: `kebab-case.spec.ts` (예: `login.spec.ts`)

---

## 📚 참고 문서 및 규칙 체크리스트

구현 시 반드시 참조해야 할 문서:

### 핵심 문서

- [x] `docs/engine/api-contracts.md` - Server Actions/API Routes 명세
- [x] `docs/product/user-flow.md` - 사용자 플로우 차트
- [x] `docs/product/point-level-system.md` - 점수/레벨 계산 로직
- [x] `docs/system/difficulty-modes.md` - 난이도별 정책 차이
- [x] `docs/product/report-result.md` - 4종 리포트 상세 명세
- [x] `docs/engine/json-schema.md` - AuctionAnalysisResult 구조
- [x] `docs/engine/auction-flow.md` - 엔진 실행 흐름
- [x] `docs/ui/design-system.md` - UI/UX 디자인 토큰
- [x] `docs/ui/component-spec.md` - 컴포넌트 Props 명세
- [x] `docs/ui/component-architecture.md` - 컴포넌트 구조

### 개발 규칙

- [x] `.cursor/rules/common/tdd.mdc` - TDD 원칙
- [x] `.cursor/rules/common/vibe-coding.mdc` - Vibe Coding 가이드
- [x] `.cursor/rules/common/bidix-development-rules.mdc` - Bidix 개발 규칙
- [x] `.cursor/rules/common/bidix-custom-rules.mdc` - Bidix 커스텀 규칙
- [x] `.cursor/rules/web/nextjs-convention.mdc` - Next.js 컨벤션
- [x] `.cursor/rules/web/playwright-test-guide.mdc` - Playwright 테스트 가이드
- [x] `.cursor/rules/supabase/disable-rls-for-development.mdc` - RLS 비활성화 규칙

---

## 📌 핵심 학습 내용 요약

### 1. 시뮬레이션 흐름 (Auction Flow)

```
UI → Server Action → Service → SimulationGenerator
  → AuctionEngine (7단계)
  → DB 저장 → UI 렌더링
```

### 2. 점수 시스템 (Point & Level)

- 총점: 1000점 (Accuracy 400 + Profitability 400 + Risk 200)
- 등급: S(900+) / A(750+) / B(600+) / C(450+) / D(0+)
- 레벨: Bronze → Silver → Gold → Platinum → Diamond

### 3. 난이도 시스템 (Difficulty Modes)

- Easy: 90% SAFE_PROPERTY (튜토리얼)
- Normal: 50% SAFE_PROPERTY (일반)
- Hard: 70% PROTECTED_TENANT + 30% COMPLEX_RIGHTS (고화)

### 4. 4종 리포트 구조

1. 권리 분석: 임대 권리 관계, 우선순위 분석, 명도비용
2. 수익 분석: 비용 구조, 3/6/12개월 시나리오, 수익분기점
3. 경매 분석: 입찰 전략의 점수 상세, 개선 포인트
4. 매각물건명세서 법원 분류 해설판 (첫 1회 무료)

### 5. API 구조

**Server Actions**: `generateSimulationAction`, `submitBidAction`, `saveHistoryAction`  
**API Routes**: `/api/history`, `/api/scores`, `/api/usage`  
**인증**: Clerk `auth()` 함수

### 6. v2.2 핵심 변경사항

- **ExitPrice**: 단일 → `exitPrice3m/6m/12m` 분리
- **Profit**: 단일 ROI → `scenarios[]` 배열 (3개 기간)
- **Summary**: 단일 `isProfitable` → `isProfitable3m/6m/12m` 분리
- **Valuation**: `exitPrice` 객체 구조로 변경

---

## 📝 버전 히스토리

- **v3.0** (2025-01-28): 상세 빌드 계획 최종 작성
  - 학습한 모든 문서 내용 반영
  - 스켈레톤 하이브리드 전략 상세화
  - 각 Phase별 필수 참조 문서 명시
  - v2.2 핵심 변경사항 반영
  - 예상 소요 시간 및 우선순위 분류

---

**END OF TODO v3.0**
