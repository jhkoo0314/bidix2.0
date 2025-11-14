# 🧩 **Component Architecture for BIDIX AI (v2.2)**

**Version:** 2.2
**Last Updated:** 2025-11-13
**Status:** ✅ 엔진 v2.2 + Design System v2.2 기준 최종 정정
**Applies To:** Next.js App Router (13/14/15), BIDIX Engine 2.2

---

# 1. 목적 및 철학

**이 문서는 BIDIX AI의 모든 엔진과 전체를 구성하는 컴포넌트 계층 구조의 단일 기준(SSOT)**이다.

**핵심 철학**

- **Colocation:** 페이지의 컴포넌트를 가능한 가까이에 배치한다.
- **엔진-UI 1:1 매핑:** AuctionAnalysisResult와 UI 컴포넌트 간 변환이 필요 없도록 설계한다.
- **관심사 분리:** 페이지는 데이터 공급, 컴포넌트는 표현·상태 관리
- **읽기 쉬운 구조**: Vibe Coding 설계에서 바로 컴포넌트를 식별할 수 있도록 명확한 책임 분리.

---

# 2. 최상위 컴포넌트 디렉토리 구조 (v2.2 정정)

```
/app/
 └─ components/
    ├─ ui/                        # shadcn/ui
    ├─ common/                    # Header, Footer, SectionTitle 등 공용
    ├─ dashboard/                 # /dashboard
    ├─ simulations/               # /simulations, /simulations/[id]
    ├─ bid/                       # /simulations/[id]/bid
    ├─ result/                    # /simulations/[id]/result
    └─ reports/                   # (🔒 Premium) 상세 리포트 뷰어
```

### v2.2 변경사항

| 변경                                 | 사유                                                            |
| ------------------------------------ | --------------------------------------------------------------- |
| `bid/` 폴더 신설                     | 입찰 페이지의 컴포넌트 증가로 인해 분리 필요                    |
| `result/` 레이아웃 구조 개편         | ExitScenarioTable / MetricsStrip / BidOutcomeBlock 등 명확 분리 |
| reports 폴더는 Premium 리포트만 보관 | 무료 요약은 simulations/ 에서 더 보기                           |

---

# 3. 페이지의 컴포넌트 구조 (v2.2)

---

## 3.1 **Dashboard Components (`/components/dashboard/`)**

현재 명확하게 구성된 v2.0 구조가 v2.2에서도 그대로 유효함

---

## 3.2 **Simulation Components (`/components/simulations/`)**

> `/simulations` (목록)
> `/simulations/[id]` (상세 - 입찰 전)

| 컴포넌트                     | 역할                  | 주요 Props (v2.2 기준)                                 |
| ---------------------------- | --------------------- | ------------------------------------------------------ |
| **SimulationList.tsx**       | 리스트 Fetch/필터링   | 클라이언트 (`use client` 기반 상태)                    |
| **FilterBar.tsx**            | 지역/타입/난이도 필터 | `onFilterChange(filters)`                              |
| **PropertyCard.tsx**         | 매물 리스트 카드      | `property: Property`, `valuation.minBid`               |
| **SaleStatementSummary.tsx** | 매각물건명세서 요약   | `property: Property`, `courtDocs: CourtDocsNormalized` |
| **RightsSummary.tsx**        | 권리 분석 요약        | `rights: Rights`                                       |

### v2.2 변경사항

- **PropertyCard**가 `PropertySeed`가 아닌 **Property(정규화)**를 받도록 변경됨.
- `SaleStatementSummary`는 courtDocsRaw가 아닌 **CourtDocsNormalized**를 사용.

---

## 3.3 **Bid Components (`/components/bid/`)**

> 입찰 페이지 UI: QuickFacts / BidForm 등

| 컴포넌트               | 역할                      | Props                                    |
| ---------------------- | ------------------------- | ---------------------------------------- |
| **QuickFacts.tsx**     | FMV·minBid·ExitPrice 표시 | `valuation: Valuation (v2.2)`            |
| **BidAmountInput.tsx** | 입력 컴포넌트             | `initialValue?: number`, `onSubmit(bid)` |
| **BidGuidanceBox.tsx** | 안전마진·최저입찰가 안내  | `valuation: Valuation`                   |

### v2.2 변경사항

- ExitPrice 단일이 아닌 **exitPrice3m / 6m / 12m** 표시.

---

## 3.4 **Result Components (`/components/result/`)**

> `/simulations/[id]/result`

### 핵심 5개 컴포넌트 (v2.2 기준)

| 컴포넌트                  | 역할                           | Props                                        |          |              |
| ------------------------- | ------------------------------ | -------------------------------------------- | -------- | ------------ |
| **BidOutcomeBlock.tsx**   | 성공/실패/근접                 | `summary: AuctionSummary`, `userBid: number` |          |              |
| **MetricsStrip.tsx**      | MoS/ROI/Score 3종 스트립       | `profit: Profit`, `score: ScoreBreakdown`    |          |              |
| **ExitScenarioTable.tsx** | 3/6/12개월 수익 비교           | `scenarios: ProfitScenario[]`                |          |              |
| **PremiumReportCTA.tsx**  | 🔒 프리미엄 리포트 잠금        | `{ type: "rights"                            | "profit" | "auction" }` |
| **ResultActions.tsx**     | 히스토리 저장 / 다음 훈련 관련 | `simulationId: string`                       |          |              |

### v2.2 핵심 필드 사용

- profit.scenarios[] 사용
- profit.initialSafetyMargin 사용
- summary.isProfitable3m/6m/12m 사용

---

## 3.5 **Premium Report Components (`/components/reports/`)**

현재 Premium 콘텐츠(MVP에서는 잠금 상태로만 표시)

| 컴포넌트                  | 역할                  | Props                                                               |
| ------------------------- | --------------------- | ------------------------------------------------------------------- |
| RightsAnalysisReport.tsx  | 권리 분석 상세        | `rights: Rights`, `courtDocs: CourtDocsNormalized`                  |
| ProfitAnalysisReport.tsx  | 수익 분석 상세        | `profit: Profit`, `valuation: Valuation`, `costs: Costs`            |
| AuctionAnalysisReport.tsx | 경매 분석 상세        | `summary: AuctionSummary`, `valuation: Valuation`, `profit: Profit` |
| SaleStatementReport.tsx   | 매각물건명세서 해설판 | `courtDocs: CourtDocsNormalized`                                    |

### v2.2 변경사항

- 모든 Premium 리포트는 **ExitPrice 3/6/12 시나리오 기반으로 작동해야**
- 기존 단일 ExitPrice 기반 구조는 제거됨

---

# 4. 공용 컴포넌트 (common/ 및 ui/)

```
common/
 ├─ SectionHeader.tsx
 ├─ SectionCard.tsx
 ├─ Badge.tsx
 ├─ DataRow.tsx
 └─ ErrorState.tsx
```

```
ui/
 ├─ Button.tsx
 ├─ Card.tsx
 ├─ Table.tsx
 ├─ Tabs.tsx
 ├─ Alert.tsx
 ├─ Separator.tsx
 └─ Input.tsx
```

### v2.2 추천 규칙

- 금액 표시는 모두 common/DataRow에서 처리
- 각 페이지는 최소한의 마크업만 사용
- 날짜 포맷은 컴포넌트에서 직접 실행

---

# 5. 페이지 구조와 컴포넌트 매핑 (v2.2)

### 예시 `/simulations/[id]/result/page.tsx`

```
<BidOutcomeBlock summary={result.summary} userBid={userBid} />

<MetricsStrip profit={result.profit} score={score} />

<ExitScenarioTable scenarios={result.profit.scenarios} />

<PremiumReportCTA type="rights" />
<PremiumReportCTA type="profit" />
<PremiumReportCTA type="auction" />

<ResultActions simulationId={id} />
```

### 예시 `/simulations/[id]/bid/page.tsx`

```
<QuickFacts valuation={result.valuation} />

<BidGuidanceBox valuation={result.valuation} />

<BidAmountInput onSubmit={handleSubmit} />
```

### 예시 `/simulations/[id]/page.tsx`

```
<SaleStatementSummary property={result.property} courtDocs={result.courtDocs} />

<RightsSummary rights={result.rights} />

<Link href="./bid">입찰하기</Link>
```

---

# 6. v2.2 컴포넌트 변경 요약

| 항목            | v2.0              | v2.2 변경                          |
| --------------- | ----------------- | ---------------------------------- |
| ExitPrice       | 단일              | 3·6·12개월 시나리오로 분리         |
| Profit          | 단일 ROI          | scenarios 배열 기반                |
| Summary         | 단일 isProfitable | 3·6·12 개별 필드                   |
| RightsSummary   | 변경 없음         | riskFlags / evictionRisk 기반 강화 |
| BidOutcomeBlock | 새 구조           | summary.grade / riskLabel 사용     |

---

# 7. 확장 계획 (v2.3)

| 기능                     | 설명                      |
| ------------------------ | ------------------------- |
| Competitor AI Simulation | 경쟁자 6명 시나리오 각각  |
| Score Distribution Graph | 점수 분포 차트            |
| Rights Timeline Chart    | 권리 발생 타임라인 시각화 |
| Profit Tornado Graph     | 민감도 분석 그래프        |

---

# **END OF DOCUMENT — Component Architecture v2.2**
