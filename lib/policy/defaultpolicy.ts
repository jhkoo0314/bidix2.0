// lib/policy/defaultpolicy.ts
// BIDIX Auction Engine v2.2 - Default Policy Values
// Version: 2.2
// Last Updated: 2025-01-28

import { Policy } from "./policy";
import { PropertyType } from "@/lib/types";

const defaultPolicy: Policy = {
  version: "2.2",
  updatedAt: "2025-11-13",

  /* ======================================================
   * 1) Valuation (시세 평가 정책)
   * ====================================================== */
  valuation: {
    /** 감정가 대비 FMV 초기 비율 (유형별 차등 적용) */
    baseFMVRatePerType: {
      [PropertyType.Apartment]: 0.98,
      [PropertyType.Villa]: 0.92,
      [PropertyType.Officetel]: 0.96,
      [PropertyType.MultiHouse]: 0.90,
      [PropertyType.Detached]: 0.88,
      [PropertyType.ResidentialLand]: 0.85,

      [PropertyType.Store]: 0.90,
      [PropertyType.Office]: 0.92,
      [PropertyType.Factory]: 0.82,
      [PropertyType.Warehouse]: 0.80,
      [PropertyType.CommercialLand]: 0.88,
    },

    /** FMV 변동성 (시장 상황 랜덤 ±%) */
    fmvVolatilityRange: { min: -0.05, max: 0.03 }, // -5% ~ +3%

    /** FMV 최종 보정 (감정가 대비 비율 제한) */
    fmvClamp: { min: 0.85, max: 1.12 },

    /**
     * Exit Price = FMV × exitDiscountRate × futureRecoveryFactor
     * - 보수적 매각: 96%
     */
    exitDiscountRate: 0.96,

    /**
     * 미래 시세 회복 계수
     * - 기본 1.02 → 2%~3% 시세 회복 기대치 반영
     */
    futureRecoveryFactor: 1.025,

    /** 1회차 최저입찰가 = 감정가 × initialMinBidRate */
    initialMinBidRate: 0.7,

    /** 유찰 1회마다 감정가 대비 최저가 하락 비율 */
    minBidReductionRate: 0.8, // -20%씩 하락

    /** 권장 입찰가 범위 = 목표 대비 ±% */
    recommendedRangeRatio: { min: 0.97, max: 1.03 }, // -3% ~ +3%
  },

  /* ======================================================
   * 2) Rights (권리/명도 정책)
   * ====================================================== */
  rights: {
    evictionBaseCost: 800000,
    evictionRiskWeight: 0.6,
    protectedTenantExtra: 12000000,
  },

  /* ======================================================
   * 3) Cost (취득/보유/대출 정책)
   * ====================================================== */
  cost: {
    acquisitionTaxRate: 0.045,
    legalFeeFlat: 900000,

    repairRate: 0.06, // 감정가 대비 6%
    holdingMonthsDefault: 6, // 보유 6개월 기준
    holdingMonthlyRate: 0.0009, // 월 보유비용 비율 (userBid의 0.09%)

    loanLtvDefault: 0.7,
    loanInterestRate: 0.055, // 연 5.5%
    loanRate: 0.055, // 대출 이자율 (loanInterestRate와 동일)
  },

  /* ======================================================
   * 4) Profit (수익 목표 기준)
   * ====================================================== */
  profit: {
    targetMarginRate: 0.08, // 초기 안전마진 목표 8%
    targetAnnualRoi: 0.10,  // 연환산 ROI 10%
  },

  /* ======================================================
   * 5) Competitor (경쟁자 시뮬레이션 정책)
   * ====================================================== */
  competitor: {
    /** 경쟁자 수 (Normal 모드 기본값) */
    count: 4,
    /** 경쟁자 입찰가 범위 (minBid 대비 %) */
    bidRange: { min: 0.95, max: 1.15 }, // minBid 대비 95%~115%
    /** 난이도별 경쟁 강도 배수 */
    difficultyMultiplier: {
      easy: 0.6,   // Easy: 경쟁 강도 60%
      normal: 1.0, // Normal: 경쟁 강도 100%
      hard: 1.5,   // Hard: 경쟁 강도 150%
    },
    /** 경쟁자 입찰가 분포 타입 */
    distributionType: "normal" as const, // 정규 분포
  },
};

export default defaultPolicy;
