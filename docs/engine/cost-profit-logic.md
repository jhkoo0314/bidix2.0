

**Version:** 2.2
**Last Updated:** 2025-11-14
**Status:** ⭐ 최종 확정 — 엔진·정책·JSON Schema 100% 싱크

---

# 1. 목적

본 문서는 **CostEngine + ProfitEngine**의 모든 계산 로직에 대한
**유일한 Single Source of Truth(SSOT)** 이다.

v2.2 핵심 변화:

* 단일 ExitPrice → **3개 ExitPrice(3·6·12개월)**
* 비용/수익 계산을 **3회 병렬 수행**
* Summary는 이 3개 시나리오 중 **최적 보유전략**을 선택한다.

모든 코드(`lib/engines/*.ts`)는 이 문서를 기준으로 작성·검증되어야 한다.

---

# 2. 전체 흐름 (입력 → 비용 → 수익 → 요약)

```
UserBid
   ↓
CostEngine (3개 totalCost 계산)
   ↓
ProfitEngine (3개 netProfit/ROI 계산)
   ↓
AuctionEngine Summary (최적 보유기간, 등급)
```

---

# 3. CostEngine (3·6·12개월)

CostEngine은 3단계로 구성된다.

---

## 3.1 초기 취득원가 (Initial Acquisition)

```
totalAcquisition =
    userBid
  + rights.assumableRightsTotal
  + rights.evictionCostEstimated
  + taxes
  + legalFees
  + registrationFee
  + repairCost
```

### 하위 항목 공식

| 항목                   | 공식                                                 |
| -------------------- | -------------------------------------------------- |
| 취득세(taxes)           | `userBid * policy.cost.acquisitionTaxRate`         |
| 법무비(legalFees)       | `policy.cost.legalFeeBase`                         |
| 등기비(registrationFee) | `policy.cost.registrationFeeBase`                  |
| 수리비(repairCost)      | `property.appraisalValue * policy.cost.repairRate` |

정책(policy.cost)은 난이도(Easy/Hard)에 따라 override될 수 있음.

---

## 3.2 자금 조달 (Loan vs Own Cash)

```
loanPrincipal = min(userBid * loanLtvDefault, userBid)
ownCash = totalAcquisition - loanPrincipal
```

* Easy: loanLtvDefault ↑ (완화 정책)
* Hard: loanLtvDefault ↓ (보수적)

---

## 3.3 보유비용 + 이자 (기간별)

보유기간: **3 / 6 / 12개월**.

---

### ■ 3개월

```
holdingCost_3m  = userBid * holdingMonthlyRate * 3
interestCost_3m = loanPrincipal * loanRate * (3 / 12)

totalCost_3m    = totalAcquisition + holdingCost_3m + interestCost_3m
```

---

### ■ 6개월

```
holdingCost_6m  = userBid * holdingMonthlyRate * 6
interestCost_6m = loanPrincipal * loanRate * (6 / 12)

totalCost_6m    = totalAcquisition + holdingCost_6m + interestCost_6m
```

---

### ■ 12개월

```
holdingCost_12m  = userBid * holdingMonthlyRate * 12
interestCost_12m = loanPrincipal * loanRate * (12 / 12)

totalCost_12m    = totalAcquisition + holdingCost_12m + interestCost_12m
```

---

# 4. ProfitEngine (3·6·12개월)

ProfitEngine은 ExitPrice와 totalCost를 결합하여
“총 3개의 독립 시나리오”를 생성한다.

---

## 4.1 ExitPrice 구조 (ValuationEngine 제공)

```
exitPrice_3m  = adjustedFMV * 0.96
exitPrice_6m  = adjustedFMV * 0.98
exitPrice_12m = adjustedFMV * 1.00
```

* 3개월: -4%
* 6개월: -2%
* 12개월: 0%

정책(policy.valuation.exitDiscountRate)은 12개월 기준으로 사용됨.

---

## 4.2 순이익(Net Profit)

```
netProfit_Xm = exitPrice_Xm - totalCost_Xm
```

---

## 4.3 ROI / Annualized ROI

### ROI

```
roi_Xm = netProfit_Xm / ownCash
```

### Annualized ROI

```
annualizedRoi_Xm = (1 + roi_Xm)^(12 / months) - 1
```

* 3개월 → ^(4)
* 6개월 → ^(2)
* 12개월 → 그대로

---

# 4.4 마진 분석

### 초기 안전마진(initialSafetyMargin)

```
initialSafetyMargin =
    (adjustedFMV - totalAcquisition)
  / adjustedFMV
```

> 총원가가 FMV보다 크면 **음수 → 위험 신호**

---

### 예상 수익 마진(Projected Profit Margin)

```
projectedProfitMargin_Xm = netProfit_Xm / exitPrice_Xm
```

---

# 4.5 Break-even (손익분기점)

```
breakevenExit_Xm = totalCost_Xm
```

ExitPrice가 이 값을 넘어서야 수익 발생.

---

# 4.6 Target 기준 충족 여부

### 목표 수익률

```
meetsTargetMargin_Xm =
    projectedProfitMargin_Xm >= policy.profit.targetMarginRate
```

### 목표 연환산 ROI

```
meetsTargetROI_Xm =
    annualizedRoi_Xm >= policy.profit.targetAnnualRoi
```

난이도(Easy/Hard)에 의해 기준이 변경된다.

---

# 5. Profit 결과 구조 (SSOT)

```ts
export interface ProfitScenario {
  months: 3 | 6 | 12;
  exitPrice: number;
  totalCost: number;
  netProfit: number;
  roi: number;
  annualizedRoi: number;
  projectedProfitMargin: number;
  meetsTargetMargin: boolean;
  meetsTargetROI: boolean;
}

export interface Profit {
  initialSafetyMargin: number;
  scenarios: ProfitScenario[];
  breakevenExit_3m: number;
  breakevenExit_6m: number;
  breakevenExit_12m: number;
}
```

---

# 6. Auction Summary 생성 기준 (v2.2)

Summary는 ProfitEngine의 3개 시나리오 결과를 기반으로 생성된다.

### Summary 공식 구조 (반드시 이 형태여야 함)

```ts
interface AuctionSummary {
  isProfitable3m: boolean;
  isProfitable6m: boolean;
  isProfitable12m: boolean;
  isProfitableNow: boolean; // 3m 기준

  grade: "S" | "A" | "B" | "C" | "D";
  riskLabel: string;

  recommendedBidRange: {
    min: number;
    max: number;
  };

  bestHoldingPeriod: 3 | 6 | 12;
  bestScenario: ProfitScenario;

  generatedAt: string;
}
```

---

# 7. 최적 보유전략 결정 규칙

```
bestScenario = scenario with highest annualizedRoi
bestHoldingPeriod = bestScenario.months
```

annualizedROI를 우선으로 사용한다.

---

# 8. 자동 정합성 체크 규칙

1. exitPrice_Xm ≥ 0
2. totalCost_Xm ≥ totalAcquisition
3. netProfit_Xm = exitPrice_Xm - totalCost_Xm
4. scenarios.length = 3
5. annualizedRoi_12m = roi_12m
6. initialSafetyMargin = (FMV - cost) / FMV
7. Summary 필드 모두 채워져 있어야 함
8. JSON Schema 2.2을 통과해야 Fixture 허용

---

# 9. 연계 파일

* `/lib/engines/costengine.ts`
* `/lib/engines/profitengine.ts`
* `/lib/engines/auctionengine.ts`
* `/lib/policy/defaultpolicy.ts`
* `/docs/engine/json-schema.md`
* `/docs/engine/auction-flow.md`

---

# **✔ END OF DOCUMENT (v2.2 – Final SSOT)**

---


