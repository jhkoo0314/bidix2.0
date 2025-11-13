
**Version:** 2.2
**Last Updated:** 2025-11-14
**Status:** ✅ 최신 반영 — *FMV 안정화 / Multi-Exit / Valuation v2.2 / Cost & Profit v2.2 적용 완료*

---

# 1. Overview

v2.2 Auction Engine은 **Orchestrator 패턴**을 기반으로 다음 7개 엔진 레이어가
순차적으로 계산을 수행하는 구조로 설계되어 있다.

| 레이어                      | 역할                               |
| ------------------------ | -------------------------------- |
| `simulationgenerator.ts` | PropertySeed + CourtDocs 생성      |
| `auctionengine.ts`       | 전체 파이프라인 종합 실행                   |
| `propertyengine.ts`      | Seed → Property 표준화              |
| `valuationengine.ts`     | FMV·minBid·ExitPrice(3/6/12)     |
| `rightsengine.ts`        | 인수권리·명도비용·명도리스크                  |
| `costengine.ts`          | 취득·보유·이자·총원가 (3/6/12)            |
| `profitengine.ts`        | ROI·Annualized ROI·Safety Margin |

---

# 2. 전체 데이터 흐름 (UI → Engine → DB → UI)

```
[ UI ]  
   ↓ Server Action  
[ generateSimulationAction ]  
   ↓  
[ simulation.service.ts ]  
   ↓  
[ SimulationGenerator ]  
   ↓  
[ AuctionEngine.run() ]  
   ↓  
[ Supabase DB 저장 ]  
   ↓  
[ UI 페이지 렌더링 ]
```

### 초기 파이프라인 특징

* 초기 생성 시 `userBid = 0` 이므로 **입찰 전 상태의 분석 리포트**가 생성됨
* 권장 입찰가, 최저가, 위험도, FMV 등은 입찰 전부터 표시됨

---

# 3. AuctionEngine.run() – Full Pipeline (v2.2)

아래 7개 단계는 **절대 순서가 변경되지 않는 SSOT 파이프라인**이다.

| Step                           | 입력값                | 처리                           | 출력                  |
| ------------------------------ | ------------------ | ---------------------------- | ------------------- |
| **1. Property Normalization**  | PropertySeed       | Seed → Property 변환           | Property            |
| **2. CourtDocs Normalization** | CourtDocsRaw       | 대항력/점유/등기 정규화                | CourtDocsNormalized |
| **3. Valuation Engine**        | Property + Policy  | FMV·minBid·ExitPrice(3/6/12) | Valuation           |
| **4. Rights Engine**           | CourtDocs + Policy | 인수권리·명도비용·위험도                | Rights              |
| **5. Cost Engine**             | Bid + Rights + FMV | Total Cost(3/6/12)           | Costs               |
| **6. Profit Engine**           | Valuation + Costs  | ROI·Annualized·SafetyMargin  | Profit              |
| **7. Summary 생성**              | 모든 엔진 결과           | 등급/수익성/추천가/리스크               | Summary             |

---

# 4. CourtDocsLayer (v2.2)

CourtDocsLayer는 v2.2에서 명확한 역할을 갖는 별도의 정규화 엔진이다.

### 입력 → 출력

```
CourtDocsRaw → CourtDocsNormalized
```

### 기능 목록 (SSOT)

| 기능                                 | 설명                                     |
| ---------------------------------- | -------------------------------------- |
| **baseRightDate 계산**               | 등기부 목록에서 `isBaseRight: true` 항목의 날짜 추출 |
| **registeredRights 정규화**           | 일자순 정렬·금액 정규화·권리종류 매핑                  |
| **occupants 정규화**                  | 이름·전입신고일·확정일자·배당요구·보증금·월세 구조화          |
| **대항력(hasCountervailingPower) 계산** | moveInDate < baseRightDate 여부          |
| **remarks 정리**                     | 비고란 텍스트 표준화                            |
| **propertyDetails 정규화**            | 매각물건명세서 ‘부동산 표시’ 정리                    |

**→ RightsEngine이 필요한 핵심 파생데이터는 모두 CourtDocsLayer가 생성한다.**

---

# 5. Valuation (v2.2)

### 핵심 계산항목

* baseFMV = appraisal × baseFMVRate
* adjustedFMV = clamp(baseFMV, fmvClamp.min ~ max)
* minBid = appraisal × lowestBidRateDefault × 0.8^(step-1)
* exitPrice_3m = adjustedFMV × 0.96
* exitPrice_6m = adjustedFMV × 0.98
* exitPrice_12m = adjustedFMV × 1.00
* recommendedBidRange = adjustedFMV × {min~max}

### v2.2 강화사항

* FMV 안정화(clamp)
* ExitPrice 3단 구조(3/6/12)
* 추천입찰가 gap 정책 강화

---

# 6. Cost Engine (v2.2)

CostEngine은 보유기간별 비용을 **3세트 동시 계산**한다.

### 총원가 공식

```
totalCost_Xm = totalAcquisition + holdingCost_Xm + interestCost_Xm
```

총원가 구성요소:

* 취득원가(totalAcquisition)
* 대출원금(loanPrincipal)
* 자기자본(ownCash)
* 보유비용(holdingCost: 3·6·12개월)
* 이자비용(interestCost: 3·6·12개월)

---

# 7. Profit Engine – Multi-Period v2.2

ProfitEngine은 3개 기간을 각각 독립 계산하여
**netProfit, ROI, annualizedROI, profitMargin**을 모두 산출한다.

### Scenario 구조

```
{
  months: 3|6|12,
  exitPrice,
  totalCost,
  netProfit,
  roi,
  annualizedRoi,
  projectedProfitMargin,
  meetsTargetMargin,
  meetsTargetROI
}
```

### 결과 묶음

```
profit = {
  byPeriod: { "3m": {}, "6m": {}, "12m": {} },
  best: { period: "X", ... },
  worst: { period: "Y", ... },
  base: result_6m
}
```

---

# 8. Summary (v2.2 – Full Structure)

v2.2 Summary는 ProfitEngine / ValuationEngine / RightsEngine
3개 결과를 합성하여 UI의 중요 요소를 구성한다.

### Summary 구성 요소 (SSOT)

| 필드                      | 설명                                    |
| ----------------------- | ------------------------------------- |
| **recommendedBidRange** | ValuationEngine가 산출한 FMV 기반 권장 입찰가 범위 |
| **isProfitableNow**     | 3개월 netProfit > 0                     |
| **isProfitable6m**      | 6개월 netProfit > 0                     |
| **isProfitable12m**     | 12개월 netProfit > 0                    |
| **grade**               | ROI_12m 기준 S~D 산정                     |
| **riskLabel**           | 명도 리스크(high/medium/safe)              |
| **generatedAt**         | 결과 생성 타임스탬프                           |

**→ UI의 “입찰 분석 요약 박스”가 이 Summary를 통해 렌더링된다.**

---

# 9. v2.2의 3대 핵심 변화 요약

### ✔ 1) Multi-Exit Price (3/6/12개월 매각가격)

기존 단일 ExitPrice → 기간별 3개로 확장
→ 실전 투자 판단 품질 대폭 상승

### ✔ 2) CostEngine Multi-Period 계산

보유기간 X 비용이 1개에서 3개 세트로 확장됨
→ 기간별 최적전략 학습 가능

### ✔ 3) ProfitEngine Multi-Evaluate

ROI / Annualized ROI / Safety Margin
3가지 기간동시 비교 → **최적 보유전략(best)** 자동 산출

---

# 10. 관련 문서

* `/docs/engine/valuation-logic.md`
* `/docs/engine/cost-profit-logic.md`
* `/docs/engine/auction-flow.md` ← 본 문서
* `/docs/domain/court-docs.md`
* `/lib/engines/*.ts`
* `/lib/generators/*.ts`

---

# ✅ END OF DOCUMENT (v2.2)


