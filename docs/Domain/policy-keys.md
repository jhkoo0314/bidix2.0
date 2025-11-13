

```md
# 🗂 Policy Key Reference for v2.0
**Version:** 2.0
**Last Updated:** 2025-11-09
**Status:** ✅ 최종 확정

> 본 문서는 `/lib/policy/` 폴더에서 사용하는 **모든 정책 키(Policy Keys)를 정의**하며, 각 엔진에서 참조하는 값들을 SSOT 방식으로 관리합니다.

---

## 1. 정책 시스템 구조

```typescript
// /lib/policy/policy.ts
interface Policy {
  valuation: { ... },
  rights: { ... },
  cost: { ... },
  profit: { ... },
}
```
**정책 적용 순서 (우선순위):**
> `defaultpolicy.ts` → **`difficultypolicy.ts`** (선택적 덮어쓰기)

---

## 2. 정책 키 전체 목록 (v2.0)

### ✅ **2.1 `valuation` Keys**

| Key | Type | 설명 | 사용 엔진 |
|:---|:---|:---|:---|
| `baseFMVRatePerType` | `Record<PropertyType, number>` | **[핵심]** 각 매물 유형별 '감정가 대비 기본 FMV 비율' | `valuationengine` |
| `fmvVolatilityRange` | `{ min: number; max: number }` | FMV 생성 시 적용될 시장 변동성의 최소/최대 범위 | `valuationengine` |
| `fmvClamp` | `{ min: number; max: number }` | 최종 FMV가 감정가 대비 벗어날 수 있는 상/하한선 | `valuationengine` |
| `exitDiscountRate` | `number` | **[핵심]** 예상 매각가(Exit Price) 산출 시, 현재 시세(FMV)에 적용할 할인율 | `valuationengine` |
| `initialMinBidRate` | `number` | 1회차 경매의 최저입찰가를 감정가 대비 얼마로 시작할지 결정하는 비율 | `valuationengine` |
| `minBidReductionRate`| `number` | 유찰 시, 이전 회차 최저가 대비 얼마나 가격을 낮출지 결정하는 비율 | `valuationengine` |
| `recommendedRangeRatio`| `{ min: number; max: number }` | 최종 권장 입찰가 범위를 '목표 달성 입찰가'의 몇 % 내외로 설정할지 결정 | `valuationengine` |

### ✅ **2.2 `rights` Keys**

| Key | Type | 설명 | 사용 엔진 |
|:---|:---|:---|:---|
| `evictionCostBase` | `number` | 명도 시 발생하는 기본적인 협상/이사 비용의 기준값 | `rightsengine` |
| `evictionRiskWeight`| `number` | 임차인의 위험도(대항력 여부 등)를 비용으로 환산할 때 사용되는 가중치 | `rightsengine` |

### ✅ **2.3 `cost` Keys**

| Key | Type | 설명 | 사용 엔진 |
|:---|:---|:---|:---|
| `acquisitionTaxRate`| `number` | 취득세율 (기본) | `costengine` |
| `legalFeeFlat` | `number` | 법무사 수수료 등 고정 법무 비용 | `costengine` |
| `repairRate` | `number` | 감정가 대비 예상 수리비 비율 | `costengine` |
| `holdingMonthsDefault`| `number` | 수익률 계산의 기준이 되는 기본 보유 기간 (개월) | `costengine` |
| `loanLtvDefault` | `number` | **[핵심]** 담보인정비율(LTV)의 기본값 | `costengine` |
| `loanInterestRate` | `number` | 대출 시 적용될 연간 이자율 | `costengine` |

### ✅ **2.4 `profit` Keys**

| Key | Type | 설명 | 사용 엔진 |
|:---|:---|:---|:---|
| `targetMarginRate` | `number` | **[핵심]** '성공적인 투자'로 판단하는 **목표 초기 안전마진** 비율 | `profitengine` |
| `targetAnnualRoi` | `number` | **[핵심]** '성공적인 투자'로 판단하는 **목표 연환산 ROI** 비율 | `profitengine` |

---

## 3. 난이도별 정책 (`difficultypolicy.ts`)

`Easy`와 `Hard` 모드는 `defaultpolicy`의 특정 키 값을 덮어쓰는 방식으로 구현됩니다.

**주요 변경 대상 키:**
*   `profit.targetAnnualRoi` (수익 목표 조절)
*   `cost.loanLtvDefault` (금융 조건 조절)
*   `valuation.exitDiscountRate` (매각 조건 조절)
*   `cost.repairRate` (리스크 조절)

> 상세 내용은 `/docs/system/difficulty-modes.md` 문서를 참조하십시오.

---

## 4. 정책 변경 및 버전 관리

*   **값 변경:** 정책의 '값'만 수정하는 것은 마이너 버전 업데이트에 해당하지 않습니다.
*   **구조 변경:** 정책의 '구조'(키 추가/삭제/이름 변경)를 변경할 경우, `/lib/policy/policy.ts`의 인터페이스를 먼저 수정하고, 관련된 모든 정책 파일과 엔진을 함께 수정해야 합니다. 이는 **메이저 버전 업데이트**에 해당합니다.
*   **커밋 규칙:** `docs(policy): update targetMarginRate for normal mode`

---
**END OF DOCUMENT**
```

