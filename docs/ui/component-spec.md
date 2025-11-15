아래에 **BIDIX v2.2 엔진 구조에 완전하게 맞춘
📌 *Component Specification for v2.2 (SSOT)*
전체 재작성본**을 제공합니다.

이 문서는 **엔진 타입(v2.2), JSON Schema v2.2, Design System v2.2, Server Actions v2.2** 모두와 **100% 동기화된 단일 기준 문서**입니다.

---

# 🧩 **Component Specification for v2.2 (SSOT)**

**Version:** 2.2
**Last Updated:** 2025-11-13
**Status:** ✅ 최신 엔진 필드 완전 반영
**Applies To:** BIDIX UI v2.2 + Auction Engine v2.2

> **본 문서는 BIDIX의 모든 UI 컴포넌트의 Props, 역할, 데이터 구조 매핑을 정의하는 최상위 설계 문서입니다.**
> 모든 Props는 반드시 `/lib/types/*.ts` 의 v2.2 타입과 *완전히 동일*해야 합니다.
> 절대 임의 필드 생성 금지.

---

# 1. 📁 컴포넌트 아키텍처 (폴더 구조)

```
/app/components/
 ├─ ui/                 (shadcn)
 ├─ common/             (레이아웃 공통)
 ├─ simulation/
 │    ├─ PropertyCard.tsx
 │    ├─ SaleStatementSummary.tsx
 │    ├─ RightsSummary.tsx
 │    ├─ QuickFacts.tsx
 │    ├─ ExitScenarioTable.tsx
 │    ├─ BidOutcomeBlock.tsx
 │    ├─ MetricsStrip.tsx
 │    ├─ PremiumReportCTA.tsx
 │    └─ ResultActions.tsx
 └─ reports/ (Premium)
      ├─ RightsAnalysisReport (🔒)
      ├─ ProfitAnalysisReport (🔒)
      └─ SaleStatementReport (🔒)
```

---

# 2. 📌 공통 Props 규칙 (v2.2)

### 반드시 지켜야 하는 SSOT 규칙

| 규칙                                 | 설명                                        |
| ---------------------------------- | ----------------------------------------- |
| **1. 엔진 객체 단위로 Props 전달**          | primitive 값 전달 금지 (예: `fmv: number` ← ❌). |
| **2. 금액은 모두 number 타입 유지**         | UI에서만 `.toLocaleString()` 적용              |
| **3. v2.2 엔진 필드명 그대로 사용**          | exitPrice3m, exitPrice6m, exitPrice12m 등  |
| **4. DTO, Adapter 생성 금지**          | 엔진 출력(AuctionAnalysisResult)을 그대로 렌더링     |
| **5. Premium 기능은 Unlock 컴포넌트로 통일** | 버튼 UI 통일                                  |

---

# 3. 🔍 컴포넌트 상세 스펙 (v2.2 기준)

---

## 3.1 🏠 **PropertyCard.tsx**

> 시뮬레이션 목록 카드

```ts
import { Property } from "@/lib/types";

export interface PropertyCardProps {
  property: Property;      // 엔진 Property 100% 그대로
  valuation: {
    minBid: number;        // 리스트 카드에서 사용
  };
}
```

**표시 요소**

* 유형/주소
* 감정가(appraisalValue)
* 최저입찰가(minBid)
* 난이도(difficulty)
* 사건번호(optional)

---

## 3.2 📄 **SaleStatementSummary.tsx**

> 매각물건명세서 요약 (무료 제공)

```ts
import { Property, CourtDocsNormalized } from "@/lib/types";

export interface SaleStatementSummaryProps {
  property: Property;
  courtDocs: CourtDocsNormalized;
}
```

**표시**

* 부동산의 표시
* 비고란 요약
* 주요 권리 수
* 임차인 존재 여부

---

## 3.3 ⚖️ **RightsSummary.tsx**

> 권리 분석 요약 UI (무료 제공)

```ts
import { Rights } from "@/lib/types";

export interface RightsSummaryProps {
  rights: Rights; // 엔진 v2.2 Rights
}
```

**표시**

* 총 인수금액 (assumableRightsTotal)
* 명도 비용 (evictionCostEstimated)
* 명도 위험도 (evictionRisk)
* riskFlags[] 태그

---

## 3.4 📊 **QuickFacts.tsx**

> 입찰 페이지 핵심 정보(FMV·minBid·ExitPrice)

```ts
import { Valuation } from "@/lib/types";

export interface QuickFactsProps {
  valuation: Valuation;
}
```

**주의 — v2.2 변경점**

* **exitPrice (단일)** 삭제됨
* **exitPrice3m / 6m / 12m** 3개 필드 사용

---

## 3.5 📈 **ExitScenarioTable.tsx**

> 수익/총비용 3·6·12개월 비교 테이블

```ts
import { Profit } from "@/lib/types";

export interface ExitScenarioTableProps {
  profit: Profit; // scenarios 객체 포함 (3m/6m/12m 키)
}
```

**참고**: `profit.scenarios`는 객체 형태입니다:
```ts
profit.scenarios: {
  "3m": ProfitScenario;
  "6m": ProfitScenario;
  "12m": ProfitScenario;
}
```

**표시**

* months: 3 | 6 | 12
* exitPrice
* totalCost
* netProfit
* annualizedRoi

---

## 3.6 🟦 **BidOutcomeBlock.tsx**

> 결과 페이지 최상단: 성공/실패/근접

```ts
import { AuctionSummary } from "@/lib/types";

export interface BidOutcomeBlockProps {
  summary: AuctionSummary;
  userBid: number;
}
```

**사용하는 엔진 필드**

* summary.isProfitable3m/6m/12m
* summary.grade

---

## 3.7 🎛️ **MetricsStrip.tsx**

> 핵심 요약 지표 3종

```ts
import { Profit, ScoreBreakdown } from "@/lib/types";

export interface MetricsStripProps {
  profit: Profit;            // initialSafetyMargin, scenarios[]
  score: ScoreBreakdown;     // finalScore, accuracy/profit/risk score
}
```

**표시**

* 초기 안전마진(initialSafetyMargin)
* ROI(3/6/12)
* finalScore

---

## 3.8 🔒 **PremiumReportCTA.tsx**

> Premium Report 언락 버튼

```ts
export interface PremiumReportCTAProps {
  type: "rights" | "profit" | "auction"; 
}
```

버튼 형태:

```
[🔒 전문가 리포트 보기]
```

---

## 3.9 🧭 **ResultActions.tsx**

> 히스토리 저장 / 다음 훈련 이동

```ts
export interface ResultActionsProps {
  simulationId: string;
}
```

---

# 4. 🔗 이벤트 규칙 (Server Actions 연결)

| 이벤트        | 컴포넌트             | Server Action                |
| ---------- | ---------------- | ---------------------------- |
| 새 시뮬레이션 생성 | Dashboard / List | `generateSimulationAction()` |
| 입찰 제출      | BidForm          | `submitBidAction()`          |
| 히스토리 저장    | ResultActions    | `saveHistoryAction()`        |
| 프리미엄 클릭    | PremiumReportCTA | Router → /premium            |

---

# 5. 🎨 UI 매핑 (Engine → Component)

### 완전 매핑 표 (v2.2)

| 엔진 필드                        | 쓰는 컴포넌트                             |
| ---------------------------- | ----------------------------------- |
| property                     | PropertyCard / SaleStatementSummary |
| valuation.adjustedFMV        | QuickFacts                          |
| valuation.exitPrice3m        | QuickFacts / ExitScenarioTable      |
| valuation.minBid             | PropertyCard / QuickFacts           |
| rights.assumableRightsTotal  | RightsSummary                       |
| rights.evictionRisk          | RightsSummary / BidOutcomeBlock     |
| costs.totalCost_3/6/12       | ExitScenarioTable                   |
| profit.initialSafetyMargin   | MetricsStrip                        |
| profit.scenarios             | ExitScenarioTable / MetricsStrip    |
| summary.grade                | BidOutcomeBlock / MetricsStrip      |
| summary.isProfitable(3/6/12) | BidOutcomeBlock                     |

이 표는 UI 구조와 엔진 결과가 **100% 정확하게 매칭**되도록 설계된 SSOT다.

---

# 6. 🔮 확장 계획 (v2.3)

* Premium Reports 실제 구현
* Competitor Simulation 비교 UI
* Scenario Graphs (FMV vs Cost vs Exit)
* Risk Timeline 시각화

---


