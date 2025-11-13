# 📊 Valuation Logic for v2.2
**Version:** 2.2  
**Last Updated:** 2025-11-13  
**Status:** ✅ 최종 확정 (FMV & 안전마진 구조 반영)

> 이 문서는 `valuationengine.ts`가 수행하는 **시세(FMV)·최저입찰가·권장입찰가·신뢰도** 계산 로직의 SSOT입니다.  
> FMV는 **초기 안전마진**의 기준이 되며, Exit Price(예상 매각가)는 **최종 수익/마진**의 기준이 됩니다.

---

## 1. 역할 요약

`ValuationEngine`은 **정규화된 매물(Property)**과 **정책(Policy)**을 입력으로 받아 다음을 계산합니다.

- `appraisalValue` : PropertyEngine이 산출한 법원 감정가(기준값)
- `baseFMV`        : 감정가 기반 1차 시세
- `adjustedFMV`    : 정책에 의해 보정된 최종 시세(현재 시점, 초기 안전마진 기준)
- `minBid`         : 현재 경매 회차에서의 최저입찰가
- `recommendedBidRange` : 현재 시세·정책·목표 수익률을 감안한 권장 입찰가 범위
- `confidence`     : 해당 시세 평가에 대한 신뢰도 점수

> 💡 **중요:**  
> - `adjustedFMV`는 **지금 당장 시장에 팔았을 때 받을 수 있는 공정가치**입니다.  
> - `exitPrice`(보유 후 예상 매각가)는 **ProfitEngine** 단계에서 `adjustedFMV`를 기반으로 계산됩니다.

---

## 2. 입력 스키마

### 2.1 Property (정규화된 매물)

- `property.appraisalValue` : 감정가 (PropertyEngine 산출)
- `property.type`           : 매물 유형 (아파트, 빌라, 토지 등)
- `property.yearBuilt`      : 준공연도
- `property.auctionStep`    : 현재 경매 회차 (1~5)
- `property.difficulty`     : Easy / Normal / Hard

### 2.2 Policy (정책 – valuation 관련 부분)

`policy.valuation` (요약):

- `baseFMVRate` : 감정가 대비 기본 FMV 비율 (예: 0.90)
- `fmvClamp`    : 감정가 대비 FMV 허용 범위 `{ min, max }`
- `lowestBidRateDefault` : 회차 정보가 없을 때 최저입찰가 기본 비율
- `exitDiscountRate` : FMV → ExitPrice로 전환할 때 사용하는 할인율 (Profit에서 사용)
- `recommendedBidGap` : FMV 대비 추천 입찰가 범위 `{ min, max }`
- `confidenceWeight` : 신뢰도 점수 계산 시 가중치

> 실제 타입은 `/lib/policy/policy.ts`의 `Policy["valuation"]` 정의를 따릅니다.

---

## 3. FMV 계산 로직

### 3.1 1단계: Base FMV (감정가 기반 1차 시세)

```ts
const appraisal = property.appraisalValue;

const baseFMV = appraisal * policy.valuation.baseFMVRate;
// 예: baseFMV = 감정가 × 0.88
감정가가 조금 과대/과소 평가되어 있을 수 있다는 가정 하에,

baseFMVRate를 통해 “시장 눈높이”에 맞게 1차 보정합니다.

3.2 2단계: Adjusted FMV (최종 현재 시세)
ts
코드 복사
const ratio = baseFMV / appraisal;

const clampedRatio = clamp(
  ratio,
  policy.valuation.fmvClamp.min,
  policy.valuation.fmvClamp.max
);

const adjustedFMV = Math.round(appraisal * clampedRatio);
fmvClamp.min / fmvClamp.max는
“감정가 대비 FMV가 너무 낮거나/너무 높아지는 것을 막는 안전장치”입니다.

예: 감정가 10억, clamp 0.80~1.15
→ FMV는 최소 8억, 최대 11.5억 사이로 제한.

🎯 목표:

FMV가 너무 낮아서 모든 매물이 안전마진 음수가 되는 상황을 방지

FMV가 너무 높아서 모든 매물이 안전마진 플러스가 되는 상황도 방지

매물별로 **플러스/마이너스가 자연스럽게 섞이는 “중립적 시세”**를 만드는 것

4. 최저 입찰가 (MinBid)
법원 경매에서 회차가 진행될수록 최저입찰가는 감정가 대비 비율로 감소합니다.

ts
코드 복사
const stepRate = [1.0, 0.8, 0.64, 0.512, 0.41, 0.33, 0.26];
const rate = stepRate[property.auctionStep - 1]
  ?? policy.valuation.lowestBidRateDefault;

const minBid = Math.round(appraisal * rate);
1회차: 100%

2회차: 80%

3회차: 64%

이후: 정책/기본값에 따라 감소

5. 권장 입찰가 범위 (Recommended Bid Range)
현재 시세(FMV)를 기준으로, 정책에 정의된 비율에 따라 **“권장 구매 구간”**을 제공합니다.

ts
코드 복사
const min = adjustedFMV * policy.valuation.recommendedBidGap.min;
const max = adjustedFMV * policy.valuation.recommendedBidGap.max;

const recommendedBidRange = {
  min: Math.round(min),
  max: Math.round(max),
};
예: 추천 범위 0.93 ~ 0.99
→ “현재 시세 대비 약간 싸게 사는 구간”을 목표로 권장 범위 설정

**실제 수익성(Exit 기준)**은 ProfitEngine에서
exitPrice와 totalCost를 기반으로 다시 평가됩니다.

6. 신뢰도 점수 (Confidence Score)
confidence는 Valuation 결과가 어느 정도 신뢰할 수 있는지(0.0 ~ 1.0)를 나타냅니다.

ts
코드 복사
let score = 0.7; // 기본 점수

if (property.type === "apartment") score += 0.1;
if (property.yearBuilt > 2010) score += 0.05;
if (property.auctionStep > 2) score -= 0.1;

const confidence = clamp(score, 0.1, 1.0);
주거용 아파트, 신축일수록 가치 평가의 변동성이 낮아 점수 상향

여러 번 유찰된 물건은 시장 외면 가능성 반영 → 점수 하향

7. 안전마진과의 관계
초기 안전마진(initialSafetyMargin)
= (adjustedFMV - totalCost) / adjustedFMV

예상 수익 마진(projectedProfitMargin)
= (exitPrice - totalCost) / exitPrice

adjustedFMV : 지금 시점에 다시 팔았을 때 기준 – “현재 안전마진”

exitPrice : 6~12개월 보유 후 보수적인 예상가 – “최종 수익 마진”

따라서 아래와 같은 케이스가 정상적으로 발생할 수 있어야 합니다.

지표	값	해석
초기 안전마진	-3%	지금 당장 팔면 손해
예상 수익 마진	+6%	보유 후 매각하면 이익
결론	“즉시 매각 비추천, 보유 전략 추천”	전략 리포트에서 안내

8. 출력 인터페이스 (Valuation)
ts
코드 복사
export interface Valuation {
  appraisalValue: number;                       // 감정가
  baseFMV: number;                              // 1차 시세 (appraisal × baseFMVRate)
  adjustedFMV: number;                          // 보정된 최종 시세 (초기 안전마진 기준)
  minBid: number;                               // 현재 회차 최저입찰가
  recommendedBidRange: { min: number; max: number }; // 추천 입찰가 범위
  confidence: number;                           // 0~1 신뢰도
  method?: "fmv-weighted" | "appraisal-ratio"; // 계산 방식 (디버깅용)
  notes?: string[];                             // 특이사항 (디버깅용)
}
exitPrice는 Profit 레이어에서
exitPrice = adjustedFMV × policy.valuation.exitDiscountRate × (미래 회복 계수)
형태로 계산됩니다.

9. TODO / 확장 계획
상태	내용
✅	Residential(주거용) 전용 FMV 모델 적용
⏳	Commercial(상업용) – NOI 기반 가치 평가 추가
⏳	난이도별(Fail Safe/Hard) FMV 편차 정책 튜닝
⏳	ExitPrice 계산 문서화 (cost-profit-logic.md와 통합)