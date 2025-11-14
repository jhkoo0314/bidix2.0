// lib/policy/policy.ts
// Auction Engine v2.2 - Policy Interface (SSOT)
// Version: 2.2
// Last Updated: 2025-01-28

import { PropertyType } from "@/lib/types";

/**
 * 정책은 엔진 계산식의 "파라미터(값)"만 정의한다.
 * 엔진 로직은 이 값들만 읽어 계산되며,
 * 정책 파일을 수정함으로써 시세/최저가/보유전략/수익률이 모두 조정된다.
 */
export interface Policy {
  version: string;
  updatedAt: string;

  /* ======================================================
   * 1) 시세/가치 평가 정책 (Valuation Layer)
   * ====================================================== */
  valuation: {
    /** 감정가 대비 FMV 초기비율 (유형별 차등 적용) */
    baseFMVRatePerType: Record<PropertyType, number>;

    /** 시장 변동성을 적용하는 범위 (± %) */
    fmvVolatilityRange: { min: number; max: number };

    /** FMV 최종 보정값 허용 범위 (감정가 대비 비율) */
    fmvClamp: { min: number; max: number };

    /** Exit Price = FMV × exitDiscountRate × futureRecoveryFactor */
    exitDiscountRate: number;

    /** 6–12개월 후 반등률(=미래 시세 회복 계수) */
    futureRecoveryFactor: number;

    /** 최저 입찰가 (1회차 기준) → 감정가 × initialMinBidRate */
    initialMinBidRate: number;

    /** 유찰 1회마다 감정가 대비 최저가 감소 비율 */
    minBidReductionRate: number;

    /** 권장 입찰가 범위 설정 비율 (보수적 목표 대비 ±%) */
    recommendedRangeRatio: { min: number; max: number };
  };

  /* ======================================================
   * 2) 권리/점유/명도 정책 (Rights Layer)
   * ====================================================== */
  rights: {
    evictionBaseCost: number;    // 명도 기본비용
    evictionRiskWeight: number;  // 리스크 가중치
    protectedTenantExtra: number; // 대항력+확정일자 세입자 추가 인수금
  };

  /* ======================================================
   * 3) 비용/세금/보유 정책 (Cost Layer)
   * ====================================================== */
  cost: {
    acquisitionTaxRate: number;   // 취득세 % (취득가 기준)
    legalFeeFlat: number;         // 법무사 + 등기 비용
    repairRate: number;           // 감정가 대비 수리비 비율
    holdingMonthsDefault: number; // 기본 보유 개월 수
    holdingMonthlyRate?: number;  // 월 보유비용 비율 (userBid 기준)
    loanLtvDefault: number;       // 기본 LTV
    loanInterestRate: number;     // 연 이자율 (%)
    loanRate?: number;            // 대출 이자율 (별칭, loanInterestRate와 동일)
  };

  /* ======================================================
   * 4) 수익/목표 정책 (Profit Layer)
   * ====================================================== */
  profit: {
    targetMarginRate: number;   // 목표 초기 안전마진
    targetAnnualRoi: number;    // 목표 연환산 ROI
  };

  /* ======================================================
   * 5) 경쟁자 시뮬레이션 정책 (Competitor Layer) - Optional
   * ====================================================== */
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

/**
 * 부분 정책 덮어쓰기용 타입 (난이도 모드)
 * 중첩 객체를 모두 Optional로 만든다.
 */
export type PolicyOverrides = Partial<DeepPartial<Policy>>;

/** 재귀적 Partial 타입 */
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
