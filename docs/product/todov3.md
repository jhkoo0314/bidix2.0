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

#### 7. 브랜드 스토리 및 보이스 가이드

**참조**: `docs/product/brand-story.md`, `docs/ui/design-system.md`

- **브랜드 에센스**: "당신의 경험을, 데이터로 증명하다."
- **슬로건**: "Fail Safe, Bid Better."
- **브랜드 보이스**: 경험 많은 선배 투자자 (Expert Mentor)
- **톤**: 진지하지만 위압적이지 않음 / 데이터 기반이지만 따뜻함 / 격려하되 과장하지 않음

**DO's (권장 표현)**:

- "당신은 이미 충분히 공부했습니다. 이제 경험할 차례입니다."
- "실패는 비용이 아니라 자산입니다."
- "당신의 성장은 느낌이 아니라, 숫자로 증명됩니다."

**DON'Ts (금지 표현)**:

- "경매 전문가가 되세요!" (너무 거창함)
- "완벽한 입찰가를 찾아드립니다" (정답 제공자 포지션 회피)
- "게임하듯 배우는 경매" (학습의 진지함 훼손)
- "100% 성공하는 입찰 비법" (과장 금지)

#### 8. 디자인 시스템 v2.2 (Brand Integrated) - 필수 준수

**참조**: `docs/ui/design-system.md` (SSOT)

**브랜드 가치 4가지 축**:

1. **Infinite eXperience (경험)** → 사용자가 반복 경험할 영역 구조
2. **Insight (통찰)** → 복기 리포트/지표 그래픽
3. **Index (지표)** → 점수·레벨·정확도 기반 UI
4. **Fail Safe (브랜드 톤)** → 실패를 허용하는 따뜻한 UX 메시지

**UI 텍스트 톤 매트릭스**:

- **Data-focused** (차트/표/지표) → 건조한 문체
- **User feedback** (결과/실패/성공) → 브랜드 톤의 따뜻한 응원
- **Premium 안내** → 브랜드 기반 "통찰을 얻을 준비가 되었나요?" 톤

**브랜드 보이스 → UI 표현 매핑**:

| 브랜드 가이드                      | UI 표현 방식                              |
| ---------------------------------- | ----------------------------------------- |
| "실패는 자산입니다."               | ResultPage 실패 화면 상단의 브랜드 메시지 |
| "당신의 성장은 숫자로 증명됩니다." | MetricsStrip와 Score 표시에 강조 문구     |
| "당신은 이미 충분히 공부했습니다." | 랜딩 페이지 첫 문구                       |
| "생각하는 과정을 훈련한다."        | 권리/수익/경매 분석의 단계별 구조         |

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
| Brand Story            | `docs/product/brand-story.md`        | 브랜드 메시지 및 보이스 가이드 |

### 구현 시 참조 방법

1. **페이지 구현 시**: User Flow 확인
2. **컴포넌트 Props 생성**: Component Spec + JSON Schema 참조
3. **Server Actions 구현**: API Contracts 명세 준수
4. **점수/레벨 표시**: Point & Level System 공식 사용
5. **난이도 필터**: Difficulty Modes 정책 참조
6. **시뮬레이션 흐름 확인**: Auction Flow 다이어그램 이해
7. **UI 메시지 작성**: Brand Story 브랜드 보이스 가이드 준수

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

- [x] `components/common/SectionHeader.tsx`
  ```typescript
  interface SectionHeaderProps {
    title: string;
    description?: string;
  }
  ```
  - 브랜드 통합: Typography 규칙 문서화, 브랜드 Color Tokens 적용
- [x] `components/common/SectionCard.tsx`
  ```typescript
  interface SectionCardProps {
    children: React.ReactNode;
    title?: string;
  }
  ```
  - 브랜드 통합: Layout Rules 문서화, 브랜드 Color Tokens 검증 완료
- [x] `components/common/DataRow.tsx`
  ```typescript
  interface DataRowProps {
    label: string;
    value: string | number;
    type?: "text" | "currency" | "percentage";
  }
  ```
  - 브랜드 통합: Numeric Highlight 스타일 적용 (currency/percentage)
- [x] `components/common/Badge.tsx` (난이도/등급 표시)
  - 브랜드 통합: 브랜드 Accent Colors 적용 (Green/Amber/Blue)
- [x] `components/common/ErrorState.tsx`
  - 브랜드 통합: 브랜드 보이스 메시지 개선, Design System v2.2 규칙 반영
- [x] `components/common/EmptyState.tsx`
  - 브랜드 통합: 브랜드 보이스 메시지 개선, Design System v2.2 규칙 반영

### 2.2 Dashboard Components

- [x] `components/dashboard/QuickStats.tsx`

  ```typescript
  interface QuickStatsProps {
    level: number;
    totalScore: number;
    simulationCount: number;
  }
  ```

  - 브랜드 패치: 점수/금액은 Numeric Highlight 스타일 적용

- [x] `components/dashboard/RecentSimulations.tsx`
  ```typescript
  interface RecentSimulationsProps {
    simulations: SimulationListItem[];
  }
  ```
- [x] `components/dashboard/UsageIndicator.tsx`
  ```typescript
  interface UsageIndicatorProps {
    used: number;
    limit: number;
  }
  ```
- [x] `components/dashboard/DashboardStats.tsx` (브랜드 Value Chain 반영)
  ```typescript
  interface DashboardStatsProps {
    experience: { count: number }; // Experience Module
    insight: { count: number }; // Insight Module
    index: { score: number; level: number }; // Index Module
  }
  ```
  - 브랜드 패치: Experience/Insight/Index 기반 3모듈 구조

### 2.3 Simulation Components

- [x] `components/simulations/SimulationList.tsx` (Client Component)
- [x] `components/simulations/FilterBar.tsx`
  ```typescript
  interface FilterBarProps {
    onFilterChange: (filters: FilterState) => void;
  }
  ```
- [x] `components/simulations/PropertyCard.tsx`

  ```typescript
  import { Property } from "@/lib/types";
  interface PropertyCardProps {
    property: Property;
    valuation: { minBid: number };
  }
  ```

  - 금액 표시: Numeric Highlight 스타일 적용

- [x] `components/simulations/SaleStatementSummary.tsx`

  ```typescript
  import { Property, CourtDocsNormalized } from "@/lib/types";
  interface SaleStatementSummaryProps {
    property: Property;
    courtDocs: CourtDocsNormalized;
  }
  ```

  - 브랜드 패치: 감성·멘토 톤의 한 줄 메시지 추가
  - Data Mapping: `valuation.adjustedFMV` → "현재 시장가 기준 판단 정확도는 XX%입니다." (향후 Valuation Props 추가 시 구현 예정)

- [x] `components/simulations/RightsSummary.tsx`
  ```typescript
  import { Rights } from "@/lib/types";
  interface RightsSummaryProps {
    rights: Rights;
  }
  ```
  - 브랜드 패치: 감성·멘토 톤의 한 줄 메시지 추가
  - Data Mapping: `rights.evictionRisk` → "이 리스크는 Hard 모드에서 자주 등장합니다." (향후 Property difficulty Props 추가 시 구현 예정)

### 2.4 Bid Components

- [x] `components/bid/QuickFacts.tsx`
  ```typescript
  import { Valuation } from "@/lib/types";
  interface QuickFactsProps {
    valuation: Valuation; // exitPrice3m/6m/12m 포함
  }
  ```
- [x] `components/bid/BidAmountInput.tsx`
  ```typescript
  interface BidAmountInputProps {
    initialValue?: number;
    minBid?: number;
    onSubmit: (data: {
      bidAmount: number;
      cashAmount?: number;
      loanAmount?: number;
    }) => void;
    disabled?: boolean;
  }
  ```
  - 현금 입력 시 대출 자동 계산 (입찰가 - 현금)
  - 대출 입력 시 현금 자동 계산 (입찰가 - 대출)
  - 대출 금액 옆에 입찰가 대비 비율(%) 표시
  - 무한 루프 방지: `useRef`로 마지막 변경 필드 추적
  - 둘 다 입력하면 검증만 수행, 둘 다 비우면 정책 기본값 사용
- [x] `components/bid/BidGuidanceBox.tsx`
  ```typescript
  import { Valuation } from "@/lib/types";
  interface BidGuidanceBoxProps {
    valuation: Valuation;
  }
  ```

### 2.5 Result Components

- [x] `components/result/BidOutcomeBlock.tsx`

  ```typescript
  import { AuctionSummary } from "@/lib/types";
  interface BidOutcomeBlockProps {
    summary: AuctionSummary; // isProfitable3m/6m/12m 포함
    userBid: number;
  }
  ```

  - 브랜드 패치: "실패는 자산입니다" 메시지 추가
  - Accent Colors 사용: Green(성공), Amber(경고), Red(실패)

- [x] `components/result/MetricsStrip.tsx`

  ```typescript
  import { Profit, ScoreBreakdown } from "@/lib/types";
  interface MetricsStripProps {
    profit: Profit; // initialSafetyMargin, scenarios 객체 (3m/6m/12m 키)
    score: ScoreBreakdown;
  }
  ```

  - 브랜드 패치: 브랜드 Numeric Highlight 적용 (Score / ROI / MoS)
  - 브랜드 메시지: "당신의 경험은 숫자로 증명됩니다."
  - Data Mapping: `profit.initialSafetyMargin` → "당신의 안전마진은 X%였습니다."

- [x] `components/result/ExitScenarioTable.tsx`

  ```typescript
  import { Profit } from "@/lib/types";
  interface ExitScenarioTableProps {
    profit: Profit; // scenarios 객체 포함 (3m/6m/12m 키)
  }
  ```

  **참고**: `profit.scenarios`는 객체 형태입니다:

  ```typescript
  profit.scenarios: {
    "3m": ProfitScenario;
    "6m": ProfitScenario;
    "12m": ProfitScenario;
  }
  ```

  - 브랜드 패치: Amber/Green 기준 색상 (브랜드 Accent Colors)
  - ROI 컬럼: Numeric Highlight 스타일 적용

- [x] `components/result/PremiumReportCTA.tsx`

  ```typescript
  interface PremiumReportCTAProps {
    type: "rights" | "profit" | "auction";
  }
  ```

  - 브랜드 패치: 브랜드 tone + blue accent
  - 브랜드 메시지: "사실을 이해하셨습니다. 이제 분석을 시작할 준비가 되셨나요?"
  - 또는: "🔒 더 깊은 분석을 원하신가요?"

- [x] `components/result/ResultActions.tsx`
  ```typescript
  interface ResultActionsProps {
    simulationId: string;
  }
  ```

### 2.6 Premium Report Components (개발자 모드 잠금 해제 및 상세 리포트 구현)

**📚 필수 참조 문서**:

- `docs/product/report-result.md` - 4종 리포트 상세 명세 (SSOT)
- `docs/ui/component-spec.md` - 리포트 컴포넌트 Props 명세
- `docs/ui/design-system.md` - 브랜드 Color Tokens 및 Layout Rules
- `docs/engine/json-schema.md` - 타입 구조 검증 기준
- `lib/types/*.ts` - 모든 타입 정의 (SSOT)
- `lib/engines/scoreengine.ts` - ScoreBreakdown 타입
- `components/reports/SaleStatementReport.tsx` - 기존 구현 참고

**구현 목표**:

- 개발자 모드에서 4개 리포트 모두 잠금 해제
- 각 리포트의 실제 상세 내용 구현 (report-result.md 기반)
- 프로덕션에서는 잠금 UI 유지, 개발자 모드에서만 실제 리포트 표시

**개발 규칙 준수**:

- ✅ 엔진 타입 직접 사용 (DTO/Adapter 생성 금지)
- ✅ `SectionCard`, `DataRow` 공통 컴포넌트 활용
- ✅ `formatCurrency()`, `formatPercentage()` 유틸리티 사용
- ✅ Numeric Highlight 스타일 적용 (금액/백분율)
- ✅ 브랜드 메시지 및 Accent Color 적용

#### 2.6.1 개발자 모드 감지 로직

- [x] 환경 변수 설정 (`.env.local`, `.env`)
  ```bash
  NEXT_PUBLIC_DEV_MODE=true
  ```
  - 참고: `.env.local` 파일을 프로젝트 루트에 생성하고 위 변수를 추가하세요.
  - 또는 `NODE_ENV === 'development'`일 때 자동으로 개발자 모드로 인식됩니다.
- [x] `app/simulations/[id]/result/page.tsx`에 개발자 모드 감지 로직 추가
  ```typescript
  const isDevMode =
    process.env.NEXT_PUBLIC_DEV_MODE === "true" ||
    process.env.NODE_ENV === "development";
  ```
- [x] 개발자 모드일 때 실제 리포트 컴포넌트 렌더링, 아닐 때 잠금 UI 표시
  - 개발자 모드: `RightsAnalysisReport`, `ProfitAnalysisReport`, `AuctionAnalysisReport` 렌더링
  - 프로덕션 모드: `PremiumReportCTA` 잠금 UI 표시
  - `SaleStatementReport`는 개발자 모드에서 항상 `isFreeAvailable={true}`로 설정

#### 2.6.2 권리 분석 상세 리포트 (`RightsAnalysisReport.tsx`)

**참조**: `report-result.md` Section 1

- [x] 잠금 UI 제거 및 실제 리포트 내용 구현
- [x] Props 인터페이스 (Component Spec 준수)
  ```typescript
  interface RightsAnalysisReportProps {
    rights: Rights;
    courtDocs: CourtDocsNormalized;
  }
  ```
- [x] Part 1: Executive Summary
  - [x] 리스크 등급 표시 (`rights.evictionRisk` 기반)
  - [x] 주요 리스크 요약 (`rights.riskFlags`)
  - [x] 예상 인수금액 (`rights.assumableRightsTotal + rights.evictionCostEstimated`)
  - [x] 핵심 판단 기준 (대항력, 우선변제권, 배당요구 여부)
- [x] Part 2: 등기 권리 타임라인
  - [x] `courtDocs.registeredRights` 테이블 표시
  - [x] 말소기준권리 하이라이트 (`isBaseRight` 필드 활용)
  - [x] 등기일자, 권리명, 채권자, 금액 표시
  - [x] `baseRightDate` 표시
- [x] Part 3: 점유자·임차인 분석
  - [x] `courtDocs.occupants` 리스트 표시
  - [x] 전입일, 확정일자, 배당요구 여부
  - [x] 대항력 여부 (`hasCountervailingPower`)
  - [x] 우선변제권 여부 (확정일자 기준)
  - [x] 보증금 (`deposit`) 표시
- [x] Part 4: 명도비용 상세
  - [x] 추정 명도비용 (`rights.evictionCostEstimated`)
  - [x] 총 인수금액 계산 및 표시
  - [x] `rights.breakdown` 활용한 권리별 상세 분석 (선택적)
- [x] 브랜드 통합
  - [x] 브랜드 메시지: "사실을 이해하셨습니다. 이제 분석을 시작할 준비가 되셨나요?"
  - [x] Accent Color: Blue (Premium 리포트)
  - [x] SectionCard로 전체 래핑
  - [x] DataRow로 레이블/값 표시

#### 2.6.3 수익 분석 상세 리포트 (`ProfitAnalysisReport.tsx`)

**참조**: `report-result.md` Section 2

- [x] 잠금 UI 제거 및 실제 리포트 내용 구현
- [x] Props 인터페이스 (Component Spec 준수)
  ```typescript
  interface ProfitAnalysisReportProps {
    profit: Profit;
    valuation: Valuation;
    costs: Costs;
  }
  ```
- [x] Part 1: Profit Summary
  - [x] 초기 안전마진 (`profit.initialSafetyMargin`) - 백분율 표시
  - [x] 3/6/12개월 순이익 (`profit.scenarios["3m"/"6m"/"12m"].netProfit`)
  - [x] 최적 보유기간 (`summary.bestHoldingPeriod` - Result Page에서 전달 필요)
  - [x] Numeric Highlight 스타일 적용
- [x] Part 2: 필요 자기자본
  - [x] 총취득원가 (`costs.acquisition.totalAcquisition`)
  - [x] 대출금 (`costs.acquisition.loanPrincipal`)
  - [x] 필요 자기자본 (`costs.acquisition.ownCash`)
  - [x] 금액 포맷팅 (`formatCurrency()`)
- [x] Part 3: 비용 구조 상세
  - [x] 취득원가 상세 (`costs.acquisition`)
    - 취득세 (`taxes`)
    - 법무비용 (`legalFees`)
    - 수리비 (`repairCost`)
    - 명도비용 (`evictionCost`)
  - [x] 보유기간별 비용 (`costs.byPeriod["3m"/"6m"/"12m"]`)
    - 보유비용 (`holdingCost`)
    - 이자비용 (`interestCost`)
    - 총비용 (`totalCost`)
- [x] Part 4: Profit Scenarios 비교 테이블
  - [x] 3/6/12개월 시나리오 비교
  - [x] 컬럼: 기간, ExitPrice, TotalCost, Net Profit, Annualized ROI
  - [x] `profit.scenarios` 객체 구조 활용 (배열 아님!)
  - [x] 최적 시나리오 하이라이트
  - [x] 수익분기점 표시 (`profit.breakevenExit_3m/6m/12m`)
- [x] 브랜드 통합
  - [x] 브랜드 메시지 및 Accent Color 적용
  - [x] SectionCard, DataRow 활용

#### 2.6.4 경매 분석 상세 리포트 (`AuctionAnalysisReport.tsx`)

**참조**: `report-result.md` Section 3

- [x] 잠금 UI 제거 및 실제 리포트 내용 구현
- [x] Props 인터페이스 (Component Spec 준수)
  ```typescript
  interface AuctionAnalysisReportProps {
    summary: AuctionSummary;
    valuation: Valuation;
    profit: Profit;
  }
  ```
- [x] 추가 Props (Result Page에서 전달 필요)
  - [x] `userBid: number` - 사용자 입찰가
  - [x] `scoreBreakdown?: ScoreBreakdown` - 점수 상세 (선택적)
- [x] Part 1: Result Summary
  - [x] 내 입찰가 (`userBid`)
  - [x] 결과 (낙찰 성공/실패/근접) - `summary` 기반
  - [x] 입찰 등급 (`summary.grade`: S/A/B/C/D)
  - [x] 최종 점수 (`scoreBreakdown.finalScore` - 있으면 표시)
- [x] Part 2: 입찰 포지션 분석
  - [x] 기준별 금액 비교 테이블
    - 최저입찰가 (`valuation.minBid`)
    - 권장가 하단 (`valuation.recommendedBidRange.min`)
    - 내 입찰가 (`userBid`)
    - 권장가 상단 (`valuation.recommendedBidRange.max`)
    - FMV (`valuation.adjustedFMV`)
  - [x] FMV 대비 비율 계산 및 표시
  - [x] 입찰 포지션 시각화 (선택적)
- [x] Part 3: 점수 구조 상세 (ScoreBreakdown 있을 때만)
  - [x] 정확성 점수 (`scoreBreakdown.accuracyScore` / 400)
  - [x] 수익성 점수 (`scoreBreakdown.profitabilityScore` / 400)
  - [x] 안정성 점수 (`scoreBreakdown.riskControlScore` / 200)
  - [x] 최종 점수 (`scoreBreakdown.finalScore` / 1000)
  - [x] 등급 (`scoreBreakdown.grade`)
  - [x] 점수 계산 근거 설명 (ScoreEngine 로직 기반)
- [x] Part 4: 입찰 전략 개선 포인트
  - [x] 안전마진 보너스 분석 (`profit.initialSafetyMargin` 기반)
  - [x] 권장입찰가 보너스 분석 (`valuation.recommendedBidRange` 대비 위치)
  - [x] 위험도 패널티 분석 (`summary.riskLabel` 기반)
  - [x] 개선 제안 메시지 (브랜드 톤)
- [x] 브랜드 통합
  - [x] 브랜드 메시지 및 Accent Color 적용
  - [x] SectionCard, DataRow 활용

####

**예상 소요:** 8-10시간

**구현 순서**:

1. 개발자 모드 감지 로직 (2.6.1) - 30분
2. 권리 분석 리포트 구현 (2.6.2) - 2-3시간
3. 수익 분석 리포트 구현 (2.6.3) - 2-3시간
4. 경매 분석 리포트 구현 (2.6.4) - 2-3시간
5. Result Page 통합 (2.6.6) - 1시간

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
**📚 추가 참조 문서**:

- `docs/product/prdv2.md` - 브랜드 메시지 및 프로로고
- `docs/product/brand-story.md` - 브랜드 스토리 및 보이스 가이드

- [x] 히어로 섹션 (브랜드 톤이 가장 직접 반영되는 영역)
  - [x] 브랜드 로고 및 슬로건 표시
    - 슬로건: **"Fail Safe, Bid Better."**
    - 부제: "안전하게 실패하고, 더 나은 입찰자가 되는 것. 이것이 BIDIX의 약속입니다."
  - [x] 브랜드 에센스 표시
    - **"당신의 경험을, 데이터로 증명하다."**
    - 브랜드 문구 스타일: 넓은 letter-spacing + 얇은 weight
  - [x] 주요 가치 제안 메시지
    - "우리는 경매를 '배워본 적 없는 사람'이 아니라, '해본 적 없는 사람'을 위해 존재합니다."
    - "실패해도 되는 완벽한 실전" 제공
  - [x] CTA 버튼
    - "첫 입찰을 시작하시겠습니까?" (브랜드 스토리 시나리오 1 참조)
- [x] 주요 기능 소개 섹션
  - [x] BIDIX의 'ix' 가치 사슬 설명
    - Infinite eXperience (무한한 경험)
    - Insight (날카로운 통찰)
    - Index (성장의 지표: 정확성/수익성/안정성)
- [x] Hard 모드 소개 (브랜드 규칙)
  - [x] Hard 모드 소개 문구: _"실패는 비용이 아닙니다. 여기서는 데이터가 됩니다."_
- [x] Footer

**예상 소요:** 2-3시간

---

### 3.2 Dashboard (`/dashboard`)

**우선순위:** ⭐⭐⭐⭐  
**📚 필수 참조 문서**:

- `docs/product/user-flow.md` - Usage 조회 및 시뮬레이션 생성 플로우
- `docs/product/point-level-system.md` - 점수/레벨/티어 계산 로직 (SSOT)
- `docs/engine/api-contracts.md` - `/api/scores`, `/api/usage` 명세
- `docs/ui/component-spec.md` - QuickStats, UsageIndicator Props

- [x] **Server Component로 구현**
- [x] 데이터 Fetch
  - [x] 사용자 통계 (레벨, 점수, 총 시뮬레이션 수)
    - API 호출: `GET /api/scores`
    - 표시: 레벨, 티어(Bronze/Silver/Gold...), 총 점수
  - [x] 최근 시뮬레이션 3개
    - Supabase `simulations` 테이블에서 조회
    - `ORDER BY created_at DESC LIMIT 3`
  - [x] 일일 사용량 (5회 제한)
    - API 호출: `GET /api/usage`
    - 표시: `used / limit` (예: 2/5)
- [x] UI 구성
  - [x] 환영 메시지 헤더
    - 브랜드 보이스 메시지: **"안녕하세요. 당신은 이미 경매를 공부했습니다. 이제 BIDIX에서 안전하게 경험할 차례입니다."** (브랜드 스토리 시나리오 1 참조)
    - 사용자 이름 표시: "{userName}님"
    - 현재 레벨 및 티어 표시
  - [x] `<UsageIndicator used={2} limit={5} />` 배치
    - 프로그레스바 형태
    - 남은 횟수 강조
    - 5회 초과 시 "일일 표시 제도해주세요" 메시지
  - [x] 브랜드 Value Chain 반영: 3개 모듈 구조
    - [x] Experience Module - 이번 주 시뮬레이션 횟수
    - [x] Insight Module - 무료 리포트 조회 수
    - [x] Index Module - 점수/레벨/히스토리
    - 이 3개 모듈은 브랜드 가치 IX 그대로 UI로 표현
  - [x] `<QuickStats level={3} totalScore={1240} simulationCount={47} />` 배치
    - 3개 카드 레이아웃 (레벨 / 점수 / 총 시뮬레이션 수)
    - 점수 계산 공식: `point-level-system.md` 참조
    - 점수/금액은 Numeric Highlight 스타일 적용
  - [x] `<RecentSimulations simulations={[...]} />` 배치
    - PropertyCard 형태로 표시
    - 클릭 시 결과 페이지로 이동
  - [x] "새로운 시뮬레이션 생성" 버튼 (Server Action 연결)
    - 난이도 선택 드롭다운 (Easy/Normal/Hard)
    - 사용량 체크 (5회 초과 시 비활성화)
- [x] Server Action 연결
  - [x] `generateSimulationAction(difficulty)` 호출
  - [x] 로딩 상태 표시
  - [x] 생성 시 `/simulations/[id]`로 리다이렉트
  - [x] 에러 처리 (사용량 초과, 네트워크 에러 등)
- [x] 로그 추가
  - [x] 사용량 조회 로그
  - [x] 시뮬레이션 생성 요청 로그
  - [x] 리다이렉트 로그

**예상 소요:** 4-5시간

---

### 3.3 Simulation List (`/simulations`)

**우선순위:** ⭐⭐⭐⭐  
**📚 필수 참조 문서**:

- `docs/system/difficulty-modes.md` - Easy/Normal/Hard 모드 설명 및 정책 차이
- `docs/ui/component-spec.md` - PropertyCard, FilterBar Props
- `docs/engine/json-schema.md` - Property, Valuation 타입 구조

- [x] **Hybrid:** Server Component (데이터 fetch) + Client Component (필터)
- [x] 데이터 Fetch
  - [x] Supabase에서 모든 시뮬레이션 조회
  - [x] Property 및 Valuation 데이터 포함
  - [x] `difficulty`, `property.type`, `address` 필드 포함
- [x] UI 구성
  - [x] 페이지 헤더
    - 제목: "시뮬레이션 목록"
    - 전체 개수 표시
  - [x] `<FilterBar />` (Client Component)
    - 난이도 필터: All / Easy / Normal / Hard
      - Easy: 🟢 튜토리얼
      - Normal: 🟡 일반 연습
      - Hard: 🔴 고화 챌린지
    - 매물 타입 필터: All / Apartment / Officetel / Villa / Land 등
    - 지역별 필터 (선택적): 서울/경기/부천 등
    - 필터 상태를 URL query에 반영 (`?difficulty=easy&type=apartment`)
  - [x] `<PropertyCard />` 그리드 레이아웃
    - 2-3열 그리드 레이아웃 (Desktop)
    - 1열 레이아웃 (Mobile)
    - 각 카드 표시 정보:
      - 매물 타입 및 주소
      - 감정가 (`appraisalValue`)
      - 최저 입찰가 (`minBid`)
      - 난이도 배지 (시각 구분)
    - 빈 상태: "시뮬레이션이 없습니다" EmptyState
  - [x] "새로운 시뮬레이션 생성" 버튼
    - 페이지 하단 고정
    - 난이도 선택 드롭다운으로 이동
- [x] 필터링 로직 (Client)
  - [x] 난이도별 필터 (Easy/Normal/Hard)
    - `difficulty-modes.md` 설명 툴팁 추가
  - [x] 매물 타입별 필터 (Apartment/Villa/Land...)
  - [x] 지역별 필터 (선택적)
  - [x] 필터 변경 시 즉시 반영
- [x] 클릭 시 `/simulations/[id]`로 이동

**예상 소요:** 5-6시간

---

### 3.4 Simulation Detail (`/simulations/[id]`)

**우선순위:** ⭐⭐⭐⭐  
**📚 필수 참조 문서**:

- `docs/ui/component-spec.md` - SaleStatementSummary, RightsSummary Props
- `docs/engine/json-schema.md` - Property, CourtDocsNormalized, Rights 타입
- `docs/engine/auction-flow.md` - 입찰 전 초기 시뮬레이션 구조

- [x] **Server Component**
- [x] 데이터 Fetch
  - [x] Supabase에서 시뮬레이션 데이터 조회
  - [x] Property, CourtDocs, Rights 데이터 포함
- [x] UI 구성
  - [x] 헤더 (사건번호, 난이도 배지)
  - [x] 브랜드 문구 삽입
    - "사실을 먼저 이해한 다음, 분석이 시작됩니다."
  - [x] `<SaleStatementSummary property={} courtDocs={} />`
    - 모든 Summary 컴포넌트에 감성·멘토 톤의 한 줄 메시지 추가
  - [x] `<RightsSummary rights={} />`
    - 모든 Summary 컴포넌트에 감성·멘토 톤의 한 줄 메시지 추가
  - [x] "입찰하기" CTA 버튼 → `/simulations/[id]/bid`
- [x] 반응형 레이아웃
  - [x] 2열 레이아웃 (Desktop)
  - [x] 1열 레이아웃 (Mobile)

**예상 소요:** 4-5시간

---

### 3.5 Bid Page (`/simulations/[id]/bid`)

**우선순위:** ⭐⭐⭐⭐  
**📚 필수 참조 문서**:

- `docs/ui/component-spec.md` - QuickFacts, BidAmountInput, BidGuidanceBox Props
- `docs/engine/json-schema.md` - Valuation 타입(exitPrice3m/6m/12m 구조)
- `docs/engine/api-contracts.md` - `submitBidAction` 명세
- `docs/engine/auction-flow.md` - 입찰 제출 시뮬레이션 흐름

- [x] **Hybrid:** Server Component (데이터) + Client Component (입력)
- [x] 데이터 Fetch
  - [x] Property, Valuation 데이터 조회
- [x] UI 구성
  - [x] 페이지 헤더
  - [x] `<QuickFacts valuation={} />`
    - [x] adjustedFMV 표시
    - [x] minBid 표시
    - [x] exitPrice3m/6m/12m 표시 (v2.2 핵심 변경)
  - [x] `<BidGuidanceBox valuation={} />`
    - [x] 안전마진 설명
    - [x] 권장 입찰가 범위
  - [x] `<BidAmountInput onSubmit={} />` (Client Component)
    - [x] 입찰가 수동 입력
    - [x] 현금 입력 시 대출 자동 계산 (입찰가 - 현금)
    - [x] 대출 입력 시 현금 자동 계산 (입찰가 - 대출)
    - [x] 대출 금액 옆에 입찰가 대비 비율(%) 표시
    - [x] 숫자 입력 검증
    - [x] 최저 입찰가 검증
    - [x] 현금 + 대출 = 입찰가 검증
    - [x] 무한 루프 방지 로직 (`useRef` 기반)
- [x] Server Action 연결
  - [x] `submitBidAction(simulationId, userBid, cashAmount?, loanAmount?)` 호출
  - [x] 현금/대출 데이터 FormData에 포함하여 전달
  - [x] 제출 시 `/simulations/[id]/result`로 리다이렉트
- [x] 로그 추가
  - [x] 입찰가 입력 로그
  - [x] Server Action 호출 로그
  - [x] 결과 리다이렉트 로그

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

- [x] **Server Component**
- [x] 데이터 Fetch
  - [x] Supabase에서 시뮬레이션 결과 조회
  - [x] 필수 데이터 `AuctionAnalysisResult` 전체
    - property, valuation, rights, costs, profit, courtDocs, summary
  - [x] userBid, score 데이터 포함
  - [x] 데이터 검증 `json-schema.md` 구조 확인
- [x] UI 구성 (단계별 순서 - 브랜드 핵심이 가장 드러나는 페이지)

  **브랜드 메시지 layer 추가** (페이지 최상단):

  - [x] 브랜드 메시지 섹션
    - **"실패는 비용이 아니라, 자산입니다."**
    - 브랜드 문구 스타일: 넓은 letter-spacing + 얇은 weight
    - Failure 메시지는 따뜻함 + 데이터 기반 톤

  1. [x] `<BidOutcomeBlock summary={} userBid={} />`

     - [x] 입찰 성공/실패/근접 표시
       - userBid vs minBid 비교
       - 상태별 색상 (success: green, fail: red, close: yellow)
       - Accent Colors 사용: Green(성공), Amber(경고/근접), Red(실패)
     - [x] summary.grade 표시 (S/A/B/C/D)
       - 등급별 색상: `point-level-system.md` 참조
     - [x] summary.isProfitable3m/6m/12m 표시
       - 3개 체크마크 (✅/ ❌)
     - [x] 브랜드 메시지 표시 (브랜드 스토리 시나리오 2 참조)
       - 성공: "축하합니다! 입찰에 성공하셨습니다."
       - 실패: **"낙찰에 실패했습니다. 하지만 괜찮습니다. 이것이 바로 BIDIX가 존재하는 이유입니다."**
         - 추가 메시지: "당신의 입찰가는 적정가보다 X% 낮았고, 숨겨진 임차인 리스크를 놓쳤습니다. 이제 이 데이터를 가지고 다시 도전하세요. **실패는 비용이 아니라 자산입니다.**"

  2. [x] `<MetricsStrip profit={} score={} />`

     - [x] 3개 주요 지표 카드
       - 초기 안전마진 (profit.initialSafetyMargin)
         - 백분율 표시 (예: 7.8%)
         - 설명: "FMV 대비 초기 마진"
         - 브랜드 메시지: "당신의 안전마진은 X%였습니다." (Data Mapping 규칙)
       - 최적 ROI (profit.scenarios 중 최고값)
         - 백분율 표시 (예: 22.4%)
         - 보유기간 표시 (예: "12개월 기준")
         - Numeric Highlight 스타일 적용 (두껍고 선명하게)
       - 최종 점수 (score.finalScore)
         - 1000점 만점
         - 등급 표시 (S/A/B/C/D)
         - 브랜드 메시지: "당신의 경험은 숫자로 증명됩니다."
         - Numeric Highlight 스타일 적용
     - [x] 점수 구성 상세 (접기/펼치기)
       - Accuracy Score: X/400
       - Profitability Score: X/400
       - Risk Control Score: X/200
       - 총 점수 계산 근거: `point-level-system.md`
     - [x] 브랜드 Numeric Highlight 적용 (Score / ROI / MoS)

  3. [x] `<ExitScenarioTable scenarios={profit.scenarios} />`

     - [x] 3개월/6개월/12개월 비교 테이블
     - [x] 컬럼:
       - 보유기간 (months)
       - 매각가 (exitPrice)
       - 총비용 (totalCost)
       - 순이익 (netProfit)
       - ROI (roi) - Numeric Highlight 스타일
       - 연환산 ROI (annualizedRoi) - Numeric Highlight 스타일
     - [x] 최적 시나리오 하이라이트
       - bestHoldingPeriod 강조
       - Amber/Green 기준 색상 (브랜드 Accent Colors)
     - [x] 금액 포맷: `toLocaleString()`
     - [x] 모바일 스크롤 가능한 테이블

  4. [x] Premium Report CTAs (개발자 모드에서 실제 리포트 표시)

     **개발자 모드 감지**:

  - [x] 환경 변수 체크: `NEXT_PUBLIC_DEV_MODE === 'true'` 또는 `NODE_ENV === 'development'`
  - [x] 개발자 모드일 때 실제 리포트 컴포넌트 렌더링
  - [x] 프로덕션 모드일 때 기존 잠금 UI 유지

  **프로덕션 모드 (기존 잠금 UI)**:

  - [x] `<PremiumReportCTA type="rights" />` 섹션
    - 제목: "권리 분석 상세 리포트"
    - 설명: "임대 권리 관계, 우선순위 분석, 명도비용 상세"
    - 미리보기: `report-result.md` Section 1 참조
  - [x] `<PremiumReportCTA type="profit" />` 섹션
    - 제목: "수익 분석 상세 리포트"
    - 설명: "비용 구조, 수익 시나리오, 수익분기점 분석"
    - 미리보기: `report-result.md` Section 2 참조
  - [x] `<PremiumReportCTA type="auction" />` 섹션
    - 제목: "경매 분석 상세 리포트"
    - 설명: "입찰 전략의 점수 상세, 개선 포인트"
    - 미리보기: `report-result.md` Section 3 참조
  - [x] 무료 리포트 1회 제공
    - "매각물건명세서 해설판" 첫 1회 무료
    - 사용량 체크 (`GET /api/usage`)
  - [x] 잠금 UI
    - 🔒 아이콘
    - "로그인하기" 버튼 (v2.2에서는 비활성)
    - 브랜드 메시지: **"사실을 이해하셨습니다. 이제 분석을 시작할 준비가 되셨나요?"** (브랜드 톤)
    - 또는: **"🔒 더 깊은 분석을 원하신가요?"** + "당신은 이미 사실을 이해했습니다. 이제 분석을 시작할 준비가 되셨습니다."
    - 브랜드 Accent Color (blue/amber) 적용
    - 브랜드 보이스 준수: 격려하되 과장하지 않음, 데이터 기반 강조

  **개발자 모드 (실제 리포트 표시)**:

  - [x] `<RightsAnalysisReport rights={} courtDocs={} />` 렌더링
    - Phase 2.6.2 참조: 권리 분석 상세 리포트 구현
  - [x] `<ProfitAnalysisReport profit={} valuation={} costs={} />` 렌더링
    - Phase 2.6.3 참조: 수익 분석 상세 리포트 구현
  - [x] `<AuctionAnalysisReport summary={} valuation={} profit={} userBid={} scoreBreakdown={} />` 렌더링
    - Phase 2.6.4 참조: 경매 분석 상세 리포트 구현
  - [x] `<SaleStatementReport courtDocs={} isFreeAvailable={true} />` 렌더링
    - 개발자 모드에서는 항상 무료로 표시

  5. [x] `<ResultActions simulationId={} />`
     - [x] "히스토리 저장" 버튼
       - `saveHistoryAction(simulationId)` 호출
       - 이미 저장된 경우: "저장됨" 표시
     - [x] "다음 연습" 버튼
       - 새로운 시뮬레이션 생성 플로우로 이동
       - Dashboard로 리다이렉트

- [x] 스타일링

  - [x] Design System v2.2 엄격 준수
    - `design-system.md` 색상 토큰 사용
    - Financial Clarity 원칙 준수
  - [x] 섹션 및 Separator
    - `<Separator />` 컴포넌트 사용
  - [x] 카드 레이아웃
    - shadcn/ui `<Card />` 사용
    - 섹션별 헤딩 및 그림자
  - [x] 반응형
    - Desktop: 2열 레이아웃 (지표 카드)
    - Mobile: 1열 레이아웃

- [x] 로그 추가
  - [x] 결과 페이지 로드 로그
    - `console.group("Result Page Data")`
    - 전체 데이터 구조 출력
  - [x] 각 섹션 헤더별 로그
    - BidOutcomeBlock 헤더
    - MetricsStrip 계산 값
    - ExitScenarioTable 데이터
  - [x] Premium CTA 클릭 로그
  - [x] 에러 로그 (데이터 없음, 형식 오류 등)

**예상 소요:** 8-10시간

---

### 3.7 History Page (`/history`)

**우선순위:** ⭐⭐  
**📚 필수 참조 문서**:

- `docs/engine/api-contracts.md` - `GET /api/history` 명세 (페이지네이션 포함)
- `docs/product/point-level-system.md` - 등급별 색상 체계
- `docs/ui/design-system.md` - 테이블 레이아웃 가이드

- [x] **Server Component**
- [x] 데이터 Fetch
  - [x] API 호출: `GET /api/history`
  - [x] 페이지네이션 `?limit=20&cursor=...`
  - [x] 데이터 포함:
    - historyId, simulationId
    - savedAt (저장 날짜)
    - propertyType, address
    - myBid, outcome (success/fail/close)
    - score, grade
    - initialSafetyMargin
- [x] UI 구성
  - [x] 페이지 헤더
    - 제목: "입찰 히스토리"
    - 전체 개수 표시
  - [x] 테이블 형식 리스트
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
  - [x] 클릭 시 결과 페이지로 이동
    - `/simulations/{simulationId}/result`
  - [x] 정렬 기능
    - 최신순 (기본)
    - 점수 높은 순
    - 점수 낮은 순
  - [x] 페이지네이션
    - "더보기" 버튼
    - nextCursor 기반 로딩
  - [x] 빈 상태
    - "아직 저장된 히스토리가 없습니다"
    - "새로운 시뮬레이션 시작하기" CTA
- [x] 필터링 (선택적)
  - [x] 난이도별 (Easy/Normal/Hard)
  - [x] 결과별 (Success/Fail/Close)
  - [x] 날짜 범위 (최근 7일/30일/전체)
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
- [x] `app/action/submitbid.ts` - 확인 완료
  - [x] Zod 스키마에 `cashAmount`, `loanAmount` 추가
  - [x] 검증 로직: 둘 다 입력 또는 둘 다 비움
  - [x] `simulationService.submitBid()`에 현금/대출 파라미터 전달

### 4.2 추가 필요 Server Actions

- [x] `app/action/savehistory.ts`
  ```typescript
  export async function saveHistoryAction(simulationId: string) {
    // DB에 히스토리 저장
    // @see docs/engine/api-contracts.md
  }
  ```

### 4.3 API Routes 구현 (데이터 조회)

**참조**: `docs/engine/api-contracts.md`

- [x] `app/api/history/route.ts`

  ```typescript
  // GET /api/history
  // 사용자의 입찰 히스토리 목록 조회
  // 쿼리: ?limit=20, ?cursor=...
  // Response: { items: [], nextCursor: string }
  ```

  - [x] Clerk `auth()` 인증 확인
  - [x] Supabase에서 히스토리 조회
  - [x] 페이지네이션 처리
  - [x] 에러 처리

- [x] `app/api/scores/route.ts`

  ```typescript
  // GET /api/scores
  // 사용자의 점수, 레벨, 등급 정보 조회
  // Response: { level, score, tier, totalSimulations }
  ```

  - [x] Clerk `auth()` 인증 확인
  - [x] Supabase `simulations` 테이블에서 집계 (score_awarded 합계)
  - [x] Point & Level System 공식 사용 (expToLevel, expToTier)
  - [x] 에러 처리

- [x] `app/api/usage/route.ts`
  ```typescript
  // GET /api/usage
  // 오늘 사용량 및 제도 정보 조회
  // Response: { date, bids: { used, limit, remaining }, freeReport: {...} }
  ```
  - [x] Clerk `auth()` 인증 확인
  - [x] Supabase `simulations` 테이블에서 일일 집계
  - [x] 일일 리셋 로직 (자정 기준, UTC 날짜 필터링)
  - [x] 에러 처리

### 4.4 인증 및 에러 처리 공통 규칙

**참조**: `docs/engine/api-contracts.md` Section 3

- [x] 모든 Server Actions/API Routes에서 Clerk `auth()` 사용
  - `app/action/generatesimulation.ts` ✅
  - `app/action/submitbid.ts` ✅
  - `app/action/savehistory.ts` ✅
  - `app/api/history/route.ts` ✅
  - `app/api/scores/route.ts` ✅
  - `app/api/usage/route.ts` ✅
- [x] 미인증 요청 에러 처리
  - 모든 파일에서 `userId` 체크 후 적절한 에러 반환
- [x] Server Actions: `{ ok: false, error: "..." }` 형식
  - 모든 Server Actions에서 일관된 형식 사용
- [x] API Routes: `{ "error": "..." }` + 4xx/5xx 상태 코드
  - 401 (Unauthorized): 미인증 요청
  - 500 (Internal Server Error): 서버 오류

### 4.5 경쟁자 시뮬레이션 구현 (Competitor Logic)

**우선순위:** ⭐⭐⭐⭐⭐ (핵심 기능)  
**📚 필수 참조 문서**:

- `docs/product/report-result.md` - Part 3: 경쟁자 가상 시뮬레이션 (v2.2)
- `docs/ui/component-spec.md` - Competitor Simulation 비교 UI
- `docs/ui/component-architecture.md` - Competitor AI Simulation 확장 계획
- `docs/domain/property-types.md` - v2.4 competitorBids 필드 추가 계획
- `docs/system/difficulty-modes.md` - 난이도별 정책 차이
- `lib/policy/policy.ts` - Policy 인터페이스 (SSOT)
- `lib/services/simulationservice.ts` - determineOutcome 함수

**현재 문제점**:

- `determineOutcome` 함수가 `userBid >= minBid`이면 무조건 "win"으로 판단
- 실제 경매에서는 경쟁자가 더 높은 가격을 제시하면 낙찰 실패 발생
- 경쟁자 로직이 없어 현실성 부족

**구현 목표**:

- 경쟁자 입찰가 생성 및 비교 로직 추가
- 난이도별 경쟁 강도 차등 적용 (Easy: 낮음, Normal: 중간, Hard: 높음)
- 시드 기반 일관성 유지 (같은 시뮬레이션에서 동일한 경쟁자 입찰가)
- 정책 기반 확장 가능한 구조

**개발 규칙 준수**:

- ✅ Policy는 Optional 필드로 추가 (기존 코드 영향 없음)
- ✅ 엔진 레이어는 변경 없음 (순수성 유지)
- ✅ Service 레이어에서만 비즈니스 로직 추가
- ✅ 시드 기반 일관성 보장 (PropertySeed 기반)

#### 4.5.1 Policy 확장 (경쟁자 정책 추가)

- [x] `lib/policy/policy.ts` - Policy 인터페이스에 Optional 필드 추가

  ```typescript
  export interface Policy {
    // ... 기존 필드들 ...

    // ✅ Optional로 추가하여 기존 코드 영향 없음
    competitor?: {
      /** 경쟁자 수 (난이도별 차등) */
      count: number;
      /** 경쟁자 입찰가 범위 (minBid 대비 %) */
      bidRange: { min: number; max: number };
      /** 난이도별 경쟁 강도 배수 */
      difficultyMultiplier: {
        easy: number;
        normal: number;
        hard: number;
      };
      /** 경쟁자 입찰가 분포 타입 */
      distributionType: "normal" | "uniform" | "skewed";
    };
  }
  ```

- [x] `lib/policy/defaultpolicy.ts` - 기본 경쟁자 정책 값 추가

  ```typescript
  const defaultPolicy: Policy = {
    // ... 기존 필드들 ...

    competitor: {
      count: 4, // Normal 모드 기본값
      bidRange: { min: 0.95, max: 1.15 }, // minBid 대비 95%~115%
      difficultyMultiplier: {
        easy: 0.6, // Easy: 경쟁 강도 60%
        normal: 1.0, // Normal: 경쟁 강도 100%
        hard: 1.5, // Hard: 경쟁 강도 150%
      },
      distributionType: "normal", // 정규 분포
    },
  };
  ```

- [x] `lib/policy/difficultypolicy.ts` - 난이도별 경쟁자 정책 오버라이드 추가

  ```typescript
  // Easy 모드: 경쟁자 수 감소, 보수적 입찰
  export const easyPolicyOverrides: PolicyOverrides = {
    competitor: {
      count: 2,
      bidRange: { min: 0.98, max: 1.08 }, // 더 보수적
      difficultyMultiplier: { easy: 0.6, normal: 1.0, hard: 1.5 },
    },
  };

  // Hard 모드: 경쟁자 수 증가, 공격적 입찰
  export const hardPolicyOverrides: PolicyOverrides = {
    competitor: {
      count: 6,
      bidRange: { min: 0.92, max: 1.2 }, // 더 공격적
      difficultyMultiplier: { easy: 0.6, normal: 1.0, hard: 1.5 },
    },
  };
  ```

#### 4.5.2 경쟁자 입찰가 생성 함수 구현

- [x] `lib/services/simulationservice.ts` - 경쟁자 입찰가 생성 함수 추가

  ```typescript
  /**
   * 경쟁자 입찰가 생성 함수
   *
   * @param seed - PropertySeed (시드 기반 일관성 보장)
   * @param valuation - Valuation (minBid, recommendedBidRange 포함)
   * @param policy - Policy (경쟁자 정책 포함)
   * @returns 경쟁자 입찰가 배열 (내림차순 정렬)
   *
   * 핵심 로직:
   * 1. 시드 기반 일관성: 같은 seed에서 항상 동일한 경쟁자 입찰가 생성
   * 2. 난이도별 경쟁 강도: difficultyMultiplier 적용
   * 3. 정규 분포 기반: minBid ~ maxRecommended 범위 내 분포
   */
  function generateCompetitorBids(
    seed: PropertySeed,
    valuation: Valuation,
    policy: Policy,
  ): number[] {
    // 구현 내용:
    // - 시드 기반 의사 랜덤 생성 (일관성 보장)
    // - 난이도별 경쟁자 수 조정
    // - 정규 분포 또는 균등 분포로 입찰가 생성
    // - minBid 이상, maxRecommended * 1.2 이하 범위 제한
  }
  ```

- [x] 시드 기반 일관성 로직 구현
  - PropertySeed의 고유 값(주소, 감정가 등)을 시드로 사용
  - 같은 시뮬레이션에서 항상 동일한 경쟁자 입찰가 생성
  - `lib/utils/number.ts`에 시드 기반 랜덤 함수 추가 고려

#### 4.5.3 determineOutcome 함수 수정

- [x] `lib/services/simulationservice.ts` - determineOutcome 함수 수정

  ```typescript
  function determineOutcome(
    result: AuctionAnalysisResult,
    userBid: number,
    propertySeed: PropertySeed, // 시드 추가 (경쟁자 생성용)
    policy?: Policy, // 정책 추가
  ): "win" | "lose" | "overpay" {
    const minBid = result.valuation.minBid;
    const maxRecommended = result.valuation.recommendedBidRange.max;
    const currentPolicy = policy ?? defaultPolicy;

    // 기존 검증
    if (userBid === 0) return "lose"; // 미입찰
    if (userBid < minBid) return "lose"; // 최저가 미달
    if (userBid > maxRecommended * 1.1) return "overpay"; // 과입찰

    // ✅ 경쟁자 로직 추가
    if (currentPolicy.competitor) {
      const competitorBids = generateCompetitorBids(
        propertySeed,
        result.valuation,
        currentPolicy,
      );

      // 사용자 입찰가가 최고가인지 확인
      const maxCompetitorBid = Math.max(...competitorBids);
      if (userBid <= maxCompetitorBid) {
        return "lose"; // 경쟁자에게 패배
      }
    }

    return "win"; // 정상 낙찰
  }
  ```

- [x] `submitBid` 함수에서 determineOutcome 호출 시 시드와 정책 전달
  ```typescript
  // submitBid 함수 내부
  const outcome = determineOutcome(
    finalResult,
    userBid,
    propertySeed, // 시드 추가
    policy, // 정책 추가 (난이도별 정책 병합)
  );
  ```

#### 4.5.4 경쟁자 데이터 저장 및 UI 표시

- [x] DB 스키마 확장 (선택적)

  - `simulations` 테이블에 `competitor_bids_json` 필드 추가 고려
  - 또는 `result_json` 내부에 경쟁자 정보 포함
  - **구현 방식**: 경쟁자 입찰가는 동적으로 생성 (시드 기반 일관성 보장)하여 저장 불필요

- [x] UI 컴포넌트 추가/수정

  - [x] `components/result/BidOutcomeBlock.tsx` - 경쟁자 정보 표시 추가
    - 경쟁자 수 표시 (193-197줄)
    - 최고 경쟁자 입찰가 표시 (낙찰 실패 시) (110-131줄)
    - 경쟁자 입찰가 분포 시각화 (선택적)
  - [x] `components/result/CompetitorAnalysis.tsx` (신규 컴포넌트)
    - 경쟁자 6명 시나리오 각각 표시 (component-architecture.md 참조)
    - 입찰가 분포 차트 (124-133줄)
    - "당신의 입찰가는 X번째로 높았습니다" 메시지 (71-76줄)

- [x] Result Page (`app/simulations/[id]/result/page.tsx`) 수정
  - 경쟁자 정보를 BidOutcomeBlock에 전달 (386줄)
  - CompetitorAnalysis 컴포넌트 배치 (Premium 리포트 섹션 근처) (415-426줄)
  - 경쟁자 입찰가 생성 로직 구현 (297-301줄)

#### 4.5.5 난이도별 경쟁 강도 설계

**참조**: `docs/system/difficulty-modes.md`

| 난이도     | 경쟁자 수 | 입찰가 범위 (minBid 대비) | 경쟁 강도 | 설명                       |
| :--------- | :-------- | :------------------------ | :-------- | :------------------------- |
| **Easy**   | 2명       | 98%~108%                  | 낮음      | 튜토리얼 모드, 보수적 입찰 |
| **Normal** | 4명       | 95%~115%                  | 중간      | 현실적인 경쟁 환경         |
| **Hard**   | 6명       | 92%~120%                  | 높음      | 고화 챌린지, 공격적 입찰   |

**구현 확인**:

- ✅ Easy 모드: `difficultypolicy.ts` - count: 2, bidRange: { min: 0.98, max: 1.08 }
- ✅ Normal 모드: `defaultpolicy.ts` - count: 4, bidRange: { min: 0.95, max: 1.15 }
- ✅ Hard 모드: `difficultypolicy.ts` - count: 6, bidRange: { min: 0.92, max: 1.2 }
- ✅ 모든 난이도에 difficultyMultiplier 적용 (Easy: 0.6, Normal: 1.0, Hard: 1.5)

#### 4.5.6 테스트 및 검증

- [x] 단위 테스트 작성

  - [x] `generateCompetitorBids` 함수 테스트 (`lib/services/__tests__/simulationservice.test.ts`)
    - 시드 기반 일관성 검증 (같은 시드 → 같은 결과) ✅ (56-91줄)
    - 난이도별 경쟁자 수 검증 ✅ (93-120줄)
    - 입찰가 범위 검증 ✅ (122-185줄)
    - difficultyMultiplier 적용 검증 ✅ (187-223줄)
    - 정렬 검증 ✅ (225-243줄)
    - 경계 케이스 테스트 ✅ (245-281줄)
  - [x] `determineOutcome` 함수 테스트 (`lib/services/__tests__/simulationservice.test.ts`)
    - 경쟁자 없을 때 기존 로직 동작 확인 ✅ (295-360줄)
    - 경쟁자 있을 때 승/패 판단 정확성 ✅ (362-394줄)
    - 경계 케이스 테스트 (동일 입찰가 등) ✅ (396-430줄)
    - 난이도별 경쟁 강도 차이 ✅ (432-465줄)

- [x] 통합 테스트 (`tests/integration/competitor-flow.test.ts`)

  - [x] 전체 입찰 플로우 테스트 (시뮬레이션 생성 → 입찰 → 결과 확인) ✅ (36-112줄)
  - [x] 난이도별 경쟁 강도 차이 검증 ✅ (114-265줄)
  - [x] 시드 기반 일관성 통합 검증 ✅ (267-307줄)
  - [ ] DB 저장 및 조회 테스트 (선택적 - 시드 기반 동적 생성으로 저장 불필요)

- [x] UI 테스트 (`tests/e2e/competitor-analysis.spec.ts`)
  - [x] 기본 테스트 구조 작성 ✅
  - [ ] 경쟁자 정보 표시 확인 (TODO - 실제 구현 필요)
  - [ ] 낙찰 실패 시 경쟁자 정보 표시 확인 (TODO - 실제 구현 필요)
  - [ ] 경쟁자 분석 컴포넌트 렌더링 확인 (TODO - 실제 구현 필요)
  - **참고**: Playwright 설정 및 테스트 환경 구축 후 완성 필요

**예상 소요:** 6-8시간

**구현 순서**:

1. Policy 확장 (4.5.1) - 1시간
2. 경쟁자 생성 함수 구현 (4.5.2) - 2시간
3. determineOutcome 수정 (4.5.3) - 1시간
4. UI 컴포넌트 추가/수정 (4.5.4) - 2-3시간
5. 테스트 및 검증 (4.5.6) - 1-2시간

---

## 🎨 Phase 5: 스타일링 및 반응형

**📚 필수 참조 문서**:

- `docs/ui/design-system.md` - Tailwind Design Tokens 및 색상 체계 (SSOT)
- `docs/ui/component-architecture.md` - 컴포넌트 레이아웃 가이드
- `.cursor/rules/web/nextjs-convention.mdc` - Tailwind CSS 사용 규칙

### 5.1 Design System 사용 (Brand Integrated)

**Color Tokens (브랜드 통합)**:

- [x] `app/globals.css`에 브랜드 Color Tokens 설정

  ```css
  :root {
    /* Backgrounds */
    --background: 0 0% 100%;
    --foreground: 222 84% 5%;

    /* Brand Primary */
    --primary: 222 47% 11%;
    --primary-foreground: 0 0% 98%;

    /* Brand Accent Colors */
    --accent-green: 142 70% 45%; /* 성장 Growth */
    --accent-amber: 38 92% 55%; /* 경고 / 학습 시그널 */
    --accent-blue: 222 85% 55%; /* Financial clarity 핵심 */

    /* Functional Colors */
    --success: 142 76% 36%;
    --warning: 48 96% 53%;
    --danger: 0 84% 60%;
    --info: 212 100% 50%;

    /* Border / Card */
    --border: 214 32% 91%;
    --card: 0 0% 100%;
    --card-foreground: 222 84% 5%;
  }
  ```

- [x] Accent Colors 사용 규칙 적용
  - Green → 점수 상승, MoS+, 긍정적 시나리오
  - Amber → 리스크, 경고, Hard 모드
  - Blue → Premium CTA, 정보 강조

**Typography (브랜드 톤)**:

- [x] 글꼴 설정

  - Heading (H1–H4): Inter / Poppins — 기하학적, 안정감
  - Body: Pretendard / Noto Sans KR — 높은 가독성
  - Numeric Highlight: tabular-nums 지원 글꼴 필수

- [x] 스타일 규칙 적용
  - 점수/금액/ROI는 **Numeric Highlight 스타일** (두껍고 선명하게)
  - 브랜드 문구는 **넓은 letter-spacing + 얇은 weight**
  - 예: "실패는 비용이 아니라, 자산입니다." (넓은 letter-spacing)

**Layout Rules (브랜드 원칙)**:

- [x] 레이아웃 구조

  - **좌측 메인 정보 → 우측 인사이트 구조**
  - **간격은 넓게, 경계는 옅게 (눈이 시리지 않게)**
  - **요약 → 상세 → 인사이트** 순서

- [x] 다크모드 지원 (선택적)

### 5.2 반응형 레이아웃

- [x] Mobile (< 768px)
  - [x] 1열 레이아웃
  - [x] 햄버거 메뉴 (선택적)
- [x] Tablet (768px ~ 1024px)
  - [x] 2열 레이아웃
- [x] Desktop (> 1024px)
  - [x] 2-3열 레이아웃

### 5.3 컴포넌트 스타일링

- [x] 모든 컴포넌트에 Tailwind 클래스 사용
- [x] shadcn/ui 기본 커스터마이징 최소화
- [x] 금액 표시 포맷팅 (`toLocaleString()`)
- [x] 백분율 표시 포맷팅

### 5.4 인터랙션 규칙 (Brand Behavior)

**Hover 효과**:

- [x] 소극적 강조, 낮은 채도
  - `brand-hover` 클래스가 `globals.css`에 정의되어 있고, 여러 컴포넌트에서 사용 중
  - 낮은 채도 적용 (opacity 0.05, 0.2), 부드러운 transition (200ms ease)
- [x] 브랜드 메시지 포함 미세툴팁 제공
  - `BrandTooltip` 컴포넌트 구현 완료 및 실제 사용 중
  - ExitScenarioTable, DataRow, MetricsStrip에서 브랜드 메시지 툴팁 제공
  - 예: "이 보유기간 동안의 수익률입니다.", "FMV 대비 초기 마진입니다."

**Error/Empty State**:

- [x] 브랜드 톤: 단호하지만 따뜻하게
  - ErrorState: "이 결과는 당신의 학습을 위한 데이터입니다. 문제가 발생했지만 괜찮습니다." 메시지 구현
  - EmptyState: `brand-message` 클래스 적용 (넓은 letter-spacing, 얇은 weight)
- [x] 사용자를 평가하지 않음
  - ErrorState와 EmptyState 모두 사용자를 평가하지 않는 톤으로 구현
- [x] 예: "이 결과는 당신의 학습을 위한 데이터입니다."
  - ErrorState에 정확히 해당 메시지 구현됨

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

- [x] 시뮬레이션 생성 플로우
  1. [x] Dashboard에서 "새로운 시뮬레이션 생성" 클릭
  2. [x] 시뮬레이션 생성 확인
  3. [x] 상세 페이지 이동 확인
- [x] 입찰 플로우
  1. [x] 시뮬레이션 상세에서 "입찰하기" 클릭
  2. [x] 입찰가 입력 및 제출
  3. [x] 결과 페이지 이동 확인
- [x] 결과 확인 플로우
  1. [x] 결과 페이지 데이터 확인
  2. [x] 모든 섹션 헤더 확인
  3. [x] Premium 잠금 UI 확인

### 6.2 Chrome DevTools MCP 사용

- [x] 브라우저 개발자 도구 로그 확인
- [x] 네트워크 요청 확인
- [x] 콘솔 에러 확인
- [x] 헤더 기능 확인

### 6.3 에러 처리

- [x] 데이터 없을 시 EmptyState 표시
- [x] 로딩 시 Skeleton UI 표시
- [x] 에러 발생 시 ErrorState 표시
- [x] 명확한 에러 메시지

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
- [x] Phase 3.7: History Page 구현 ⭐⭐
- [ ] Phase 4: Server Actions 및 API Routes
- [ ] Phase 4.5: 경쟁자 시뮬레이션 구현 ⭐⭐⭐⭐⭐ (핵심 기능)
- [ ] Phase 5: 스타일링 및 반응형
- [ ] Phase 6: 테스트 및 디버깅

### 선택

- [ ] 다크모드 지원
- [ ] 고급 필터링
- [ ] 애니메이션 효과

---

## ⏱️ 예상 소요 시간

|  Phase   | 작업 내용                         |   예상 소요   | 비고                         |
| :------: | :-------------------------------- | :-----------: | :--------------------------- |
|    0     | 참고 문서 학습                    |    1-2시간    | 7개 핵심 문서 읽기           |
|    1     | 프로젝트 기반 구축                |    2-3시간    | 디렉토리, shadcn 설치        |
|    2     | 컴포넌트 스켈레톤 생성            |    4-5시간    | Props 정의, placeholder UI   |
|   3.1    | Landing Page                      |    2-3시간    | 브랜드 메시지 중심           |
|   3.2    | Dashboard                         |    4-5시간    | Usage, Stats, API 연동       |
|   3.3    | Simulation List                   |    5-6시간    | 필터링, 리스트 UI            |
|   3.4    | Simulation Detail                 |    4-5시간    | CourtDocs, Rights 표시       |
|   3.5    | Bid Page                          |    5-6시간    | QuickFacts, Valuation 표시   |
|   3.6    | Result Page (핵심)                |   8-10시간    | 4종 리포트 CTA, 점수 표시    |
|   2.6    | Premium 리포트 구현 (개발자 모드) |   8-10시간    | 4종 리포트 상세 구현         |
|   3.7    | History Page                      |    4-5시간    | 테이블, 페이지네이션         |
|    4     | Server Actions 및 API Routes      |    4-6시간    | 3개 API Routes 추가          |
|   4.5    | 경쟁자 시뮬레이션 구현            |    6-8시간    | 핵심 기능 (Competitor Logic) |
|    5     | 스타일링 및 반응형                |    4-5시간    | Design System 사용           |
|    6     | 테스트 및 디버깅                  |    5-6시간    | Chrome DevTools MCP 사용     |
|    7     | 최적화 및 마무리                  |    3-4시간    | SEO, a11y, 문서화            |
| **총계** |                                   | **70-90시간** | 평균 80시간 (약 10일 작업)   |

### 우선순위별 분류

|  우선순위  | 페이지/기능                               | 시간      |
| :--------: | :---------------------------------------- | :-------- |
| ⭐⭐⭐⭐⭐ | 경쟁자 시뮬레이션 구현 (Competitor Logic) | 6-8시간   |
|  ⭐⭐⭐⭐  | Dashboard, Simulation Detail, Bid, Result | 21-26시간 |
|  ⭐⭐⭐⭐  | Simulation List                           | 5-6시간   |
|    ⭐⭐    | Landing, History                          | 6-8시간   |
|    기반    | Phase 0,1,2,4,5,6,7                       | 24-32시간 |

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
- ✅ Design System v2.2의 디자인 가이드 준수 (`docs/ui/design-system.md` SSOT)
  - 브랜드 Color Tokens 사용 (Primary, Accent Green/Amber/Blue)
  - Typography 규칙 준수 (Numeric Highlight, 브랜드 문구 스타일)
  - Layout Rules 준수 (좌측 메인 정보 → 우측 인사이트)
  - 브랜드 보이스 → UI 표현 매핑 적용
  - Data Mapping 규칙 적용 (엔진 데이터 → 브랜드 메시지)
- ✅ 엔진 결과를 그대로 UI에 바인딩 (DTO/Adapter 생성 금지)
- ✅ 모든 금액에 `toLocaleString()` 사용
- ✅ 핵심 로직에 `console.log` 추가
- ✅ 브랜드 스토리 및 보이스 가이드 준수 (`docs/product/brand-story.md`)
  - UI 메시지는 브랜드 보이스 DO's/DON'Ts 준수
  - 페이지별 톤 조절 매트릭스 참조
  - 브랜드 경험 원칙 (투명성, 존중, 점진성, 현실성) 반영
- ✅ 브랜드 기반 컴포넌트 패치 사항 반영
  - 모든 Summary 컴포넌트에 감성·멘토 톤의 한 줄 메시지 추가
  - Score / ROI / MoS는 Numeric Accent 스타일 적용
  - Premium Report CTA는 브랜드 Accent Color(blue/amber)
  - Failure 메시지는 따뜻함 + 데이터 기반 톤
- ✅ 인터랙션 규칙 준수
  - Hover: 소극적 강조, 브랜드 메시지 포함 미세툴팁
  - Error/Empty State: 단호하지만 따뜻하게, 사용자 평가 금지
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
- [x] `docs/product/brand-story.md` - 브랜드 스토리 및 보이스 가이드

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

**개발자 모드 리포트 구현**:

- 개발자 모드에서 4개 리포트 모두 잠금 해제 및 상세 내용 구현
- 환경 변수: `NEXT_PUBLIC_DEV_MODE=true` 또는 `NODE_ENV === 'development'`
- 각 리포트는 `report-result.md` 기반으로 구현
- 프로덕션에서는 잠금 UI 유지, 개발자 모드에서만 실제 리포트 표시
- 구현 순서: 개발자 모드 감지 → 권리 분석 → 수익 분석 → 경매 분석 → Result Page 통합

### 5. API 구조

**Server Actions**: `generateSimulationAction`, `submitBidAction`, `saveHistoryAction`  
**API Routes**: `/api/history`, `/api/scores`, `/api/usage`  
**인증**: Clerk `auth()` 함수

### 6. 브랜드 스토리 및 메시지

**브랜드 에센스**: "당신의 경험을, 데이터로 증명하다."  
**슬로건**: "Fail Safe, Bid Better."  
**BIDIX의 'ix' 가치 사슬**: Infinite eXperience → Insight → Index

**브랜드 가치 4가지 축**:

1. **Infinite eXperience (경험)** → 사용자가 반복 경험할 영역 구조
2. **Insight (통찰)** → 복기 리포트/지표 그래픽
3. **Index (지표)** → 점수·레벨·정확도 기반 UI
4. **Fail Safe (브랜드 톤)** → 실패를 허용하는 따뜻한 UX 메시지

**주요 메시지 시나리오**:

- 신규 사용자: "당신은 이미 경매를 공부했습니다. 이제 BIDIX에서 안전하게 경험할 차례입니다."
- 입찰 실패: "낙찰에 실패했습니다. 하지만 괜찮습니다. 이것이 바로 BIDIX가 존재하는 이유입니다. 실패는 비용이 아니라 자산입니다."
- 레벨업: "축하합니다! Level X에 도달했습니다. 이제 당신의 경험은 숫자로 증명됩니다."

**브랜드 보이스 원칙**:

- DO's: "당신은 이미 충분히 공부했습니다. 이제 경험할 차례입니다.", "실패는 비용이 아니라 자산입니다."
- DON'Ts: "경매 전문가가 되세요!", "완벽한 입찰가를 찾아드립니다", "게임하듯 배우는 경매"

**UI 텍스트 톤 매트릭스**:

- **Data-focused** (차트/표/지표) → 건조한 문체
- **User feedback** (결과/실패/성공) → 브랜드 톤의 따뜻한 응원
- **Premium 안내** → 브랜드 기반 "통찰을 얻을 준비가 되었나요?" 톤

**Data Mapping (엔진 → 브랜드 경험)**:

| 엔진 원천 데이터             | UI 메시지/표현                               |
| ---------------------------- | -------------------------------------------- |
| `profit.initialSafetyMargin` | "당신의 안전마진은 X%였습니다."              |
| `rights.evictionRisk`        | "이 리스크는 Hard 모드에서 자주 등장합니다." |
| `valuation.adjustedFMV`      | "현재 시장가 기준 판단 정확도는 XX%입니다."  |
| Score                        | "당신의 경험은 숫자로 증명됩니다."           |

### 7. v2.2 핵심 변경사항

- **ExitPrice**: 단일 → `exitPrice3m/6m/12m` 분리
- **Profit**: 단일 ROI → `scenarios` 객체 (3m/6m/12m 키)
- **Summary**: 단일 `isProfitable` → `isProfitable3m/6m/12m` 분리
- **Valuation**: `exitPrice` 객체 구조로 변경

### 8. 경쟁자 시뮬레이션 (Competitor Logic)

**구현 목표**:

- 경쟁자 입찰가 생성 및 비교 로직 추가
- 난이도별 경쟁 강도 차등 적용 (Easy: 낮음, Normal: 중간, Hard: 높음)
- 시드 기반 일관성 유지 (같은 시뮬레이션에서 동일한 경쟁자 입찰가)

**난이도별 경쟁 강도**:

- Easy: 2명, 98%~108% 범위, 낮은 경쟁 강도
- Normal: 4명, 95%~115% 범위, 중간 경쟁 강도
- Hard: 6명, 92%~120% 범위, 높은 경쟁 강도

**아키텍처 원칙**:

- Policy는 Optional 필드로 추가 (기존 코드 영향 없음)
- 엔진 레이어는 변경 없음 (순수성 유지)
- Service 레이어에서만 비즈니스 로직 추가
- 시드 기반 일관성 보장 (PropertySeed 기반)

---

## 📝 버전 히스토리

- **v3.5** (2025-01-28): 현금/대출 자동 계산 기능 구현 완료
  - BidAmountInput 컴포넌트에 현금/대출 상호 자동 계산 로직 추가
  - 현금 입력 시 대출 자동 계산 (입찰가 - 현금)
  - 대출 입력 시 현금 자동 계산 (입찰가 - 대출)
  - 대출 금액 옆에 입찰가 대비 비율(%) 표시 기능 추가
  - 무한 루프 방지를 위한 `useRef` 기반 마지막 변경 필드 추적 로직 구현
  - Phase 2.4 BidAmountInput Props 명세 업데이트
  - Phase 3.5 Bid Page 구현 내용 업데이트
- **v3.4** (2025-01-28): 개발자 모드 리포트 구현 계획 추가
  - Phase 2.6에 개발자 모드 잠금 해제 및 상세 리포트 구현 계획 추가
  - 각 리포트별 상세 구현 내용 명시 (report-result.md 기반)
  - 개발자 모드 감지 로직 및 Result Page 통합 계획
  - 예상 소요 시간 및 구현 순서 명시
  - Phase 3.6 Result Page에 개발자 모드 관련 내용 추가
  - 핵심 학습 내용에 개발자 모드 리포트 구현 섹션 추가
- **v3.3** (2025-01-28): 경쟁자 시뮬레이션 구현 계획 추가
  - Phase 4.5에 경쟁자 시뮬레이션 구현 섹션 추가
  - Policy 확장, 경쟁자 생성 함수, determineOutcome 수정 계획
  - 난이도별 경쟁 강도 설계 및 UI 컴포넌트 계획
  - 예상 소요 시간 및 구현 순서 명시
- **v3.0** (2025-01-28): 상세 빌드 계획 최종 작성
  - 학습한 모든 문서 내용 반영
  - 스켈레톤 하이브리드 전략 상세화
  - 각 Phase별 필수 참조 문서 명시
  - v2.2 핵심 변경사항 반영
  - 예상 소요 시간 및 우선순위 분류
- **v3.1** (2025-01-28): 브랜드 스토리 반영
  - Phase 0-1에 Brand Story 문서 추가
  - Phase 0에 브랜드 보이스 가이드 섹션 추가 (DO's/DON'Ts)
  - Phase 3.1 Landing Page에 브랜드 메시지 상세화 (슬로건, 에센스, 'ix' 가치 사슬)
  - Phase 3.2 Dashboard에 브랜드 보이스 메시지 반영
  - Phase 3.6 Result Page에 브랜드 메시지 시나리오 반영 (입찰 실패 메시지)
  - Premium CTA에 브랜드 보이스 원칙 추가
  - 반드시 준수사항에 브랜드 스토리 가이드 추가
  - 핵심 학습 내용에 브랜드 스토리 섹션 추가
- **v3.2** (2025-01-28): 디자인 시스템 v2.2 (Brand Integrated) 반영
  - Phase 0에 디자인 시스템 v2.2 필수 준수 섹션 추가
    - 브랜드 가치 4가지 축 (Infinite eXperience, Insight, Index, Fail Safe)
    - UI 텍스트 톤 매트릭스
    - 브랜드 보이스 → UI 표현 매핑
  - Phase 2 컴포넌트 스켈레톤에 브랜드 패치 사항 반영
    - 모든 Summary 컴포넌트에 감성·멘토 톤 메시지 추가
    - MetricsStrip, ExitScenarioTable에 Numeric Highlight 및 Accent Colors 적용
    - PremiumReportCTA에 브랜드 메시지 및 Accent Color 적용
    - DashboardStats에 Experience/Insight/Index 3모듈 구조 추가
  - Phase 3 페이지 구현에 브랜드 구조 반영
    - Landing Page: Hard 모드 소개 문구 추가
    - Dashboard: 브랜드 Value Chain 3개 모듈 구조 반영
    - Simulation Detail: 브랜드 문구 삽입
    - Result Page: 브랜드 메시지 layer 추가, Data Mapping 규칙 적용
  - Phase 5 스타일링에 Design System 상세화
    - Color Tokens (브랜드 Primary, Accent Green/Amber/Blue) 상세 명시
    - Typography 규칙 (Numeric Highlight, 브랜드 문구 스타일)
    - Layout Rules (좌측 메인 정보 → 우측 인사이트)
    - 인터랙션 규칙 (Hover, Error/Empty State)
  - 반드시 준수사항에 디자인 시스템 가이드 추가
    - 브랜드 Color Tokens 사용 규칙
    - Typography 및 Layout Rules 준수
    - 브랜드 기반 컴포넌트 패치 사항 반영
    - 인터랙션 규칙 준수
  - 핵심 학습 내용에 디자인 시스템 섹션 추가
    - 브랜드 가치 4가지 축
    - UI 텍스트 톤 매트릭스
    - Data Mapping 규칙

---

**END OF TODO v3.2**
