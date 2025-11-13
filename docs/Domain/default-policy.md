# ⚖️ Policy Specification for v2.0

**Version:** 2.0
**Last Updated:** 2025-11-09
**Scope:** Default & Difficulty-based Policies for MVP

---

## 1. 정책 시스템 아키텍처

BIDIX의 모든 계산 엔진은 이 '정책 시스템'이 제공하는 규칙과 상수를 사용합니다. 이를 통해 엔진 코드 수정 없이도 게임 밸런스, 난이도, 시장 상황을 유연하게 조절할 수 있습니다.

| 영역                | 파일                             | 목적                                                                  |
| :------------------ | :------------------------------- | :-------------------------------------------------------------------- |
| **정책 인터페이스** | `lib/policy/policy.ts`           | 모든 정책 객체가 따라야 할 TypeScript 타입 구조를 정의합니다.         |
| **기본 정책**       | `lib/policy/defaultpolicy.ts`    | **'Normal' 모드**의 기준이 되는 기본 정책 값을 정의합니다.            |
| **난이도별 정책**   | `lib/policy/difficultypolicy.ts` | **'Easy', 'Hard' 모드**에서 기본 정책을 덮어쓸 '차이점'만 정의합니다. |
| **권리 판단 규칙**  | `lib/policy/rightspolicy.ts`     | (v2.1+) 권리 유형별 세부 위험도를 정의합니다.                         |

---

## 2. 정책 인터페이스 (`Policy` in `policy.ts`)

> 모든 타입은 `/lib/types/*.ts`의 최종 설계를 따릅니다.

```typescript
// lib/policy/policy.ts
export interface Policy {
  version: string;
  updatedAt: string;

  valuation: {
    baseFMVRatePerType: Record<PropertyType, number>;
    fmvVolatilityRange: { min: number; max: number };
    fmvClamp: { min: number; max: number };
    exitDiscountRate: number;
    initialMinBidRate: number;
    minBidReductionRate: number;
    recommendedRangeRatio: { min: number; max: number };
  };

  rights: {
    evictionCostBase: number;
    evictionRiskWeight: number;
  };

  cost: {
    acquisitionTaxRate: number;
    legalFeeFlat: number;
    repairRate: number;
    holdingMonthsDefault: number;
    loanLtvDefault: number;
    loanInterestRate: number;
  };

  profit: {
    targetMarginRate: number; // 목표 '초기 안전마진'
    targetAnnualRoi: number; // 목표 '연환산 ROI'
  };
}

export type PolicyOverrides = Partial<DeepPartial<Policy>>; // 중첩 객체도 부분적으로 덮어쓰기 위한 타입
```
