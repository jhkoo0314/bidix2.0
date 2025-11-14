// lib/policy/difficultypolicy.ts
// BIDIX AI - Difficulty-based Policy Overrides (v2.2)
// Version: 2.2
// Last Updated: 2025-01-28

import { PolicyOverrides } from "./policy";

/* =====================================================
 * EASY MODE
 * - 성공 경험을 위한 온보딩 난이도
 * - FMV ↑, Exit Price ↑, 비용 ↓, 대출 ↑
 * ===================================================== */
export const easyModePolicy: PolicyOverrides = {
  valuation: {
    /** 시장 변동성 축소 (보다 안정적 FMV) */
    fmvVolatilityRange: { min: -0.02, max: 0.04 },

    /** FMV 보정 범위 확대 (더 높은 FMV 가능) */
    fmvClamp: { min: 0.9, max: 1.10 },

    /** Exit Price는 오히려 기본보다 높게 */
    exitDiscountRate: 0.98,

    /** 미래 시세 회복률 강화 → Exit Price 증가 */
    futureRecoveryFactor: 1.03,

    /** 권장 입찰 범위 완화 → 낙찰 쉬움 */
    recommendedRangeRatio: { min: 0.99, max: 1.05 },
  },

  cost: {
    /** LTV 상향 (대출 여유) */
    loanLtvDefault: 0.8,

    /** 수리비 감소 */
    repairRate: 0.05,
  },

  profit: {
    /** 초기 안전마진 목표 완화 */
    targetMarginRate: 0.05,
    /** ROI 목표 완화 */
    targetAnnualRoi: 0.07,
  },

  competitor: {
    /** Easy 모드: 경쟁자 수 감소 (튜토리얼 모드)
     * - todov3.md 4.5.5 설계표 기준: 2명
     * - 낮은 경쟁 강도로 성공 경험 제공
     */
    count: 2,
    /** 보수적 입찰 범위 (minBid 대비 98%~108%)
     * - todov3.md 4.5.5 설계표 기준: 98%~108%
     * - 보수적 입찰로 안전한 학습 환경 제공
     */
    bidRange: { min: 0.98, max: 1.08 },
    /** 난이도별 경쟁 강도 배수
     * - Easy: 0.6 (경쟁 강도 60%) - 범위 폭 축소로 보수적 입찰 유도
     * - Normal: 1.0 (경쟁 강도 100%) - 기본 범위 유지
     * - Hard: 1.5 (경쟁 강도 150%) - 범위 폭 확대로 공격적 입찰 가능
     * 
     * 적용 방식:
     * adjustedRangeMax = rangeMin + (rangeMax - rangeMin) * difficultyMultiplier
     * 
     * 예시 (minBid = 100,000,000원 기준):
     * - Easy: rangeMin = 98M, rangeMax = 108M
     *   → adjustedRangeMax = 98M + (108M - 98M) * 0.6 = 104M (범위 축소)
     * - Normal: adjustedRangeMax = 108M (기본 범위)
     * - Hard: adjustedRangeMax = 98M + (108M - 98M) * 1.5 = 113M (범위 확대)
     */
    difficultyMultiplier: {
      easy: 0.6,
      normal: 1.0,
      hard: 1.5,
    },
  },
};

/* =====================================================
 * HARD MODE
 * - 보수적 투자 훈련
 * - FMV ↓, Exit Price ↓, 비용 ↑, 대출 ↓
 * ===================================================== */
export const hardModePolicy: PolicyOverrides = {
  valuation: {
    /** 시장 변동성 확대 (예측 어려움) */
    fmvVolatilityRange: { min: -0.08, max: 0.02 },

    /** FMV clamp 축소 → FMV가 더 낮게 나올 가능성 */
    fmvClamp: { min: 0.82, max: 1.04 },

    /** Exit Price를 매우 보수적으로 */
    exitDiscountRate: 0.92,

    /** 미래 시세 회복도 약함 */
    futureRecoveryFactor: 1.00,

    /** 권장 입찰 범위를 낮게 설정 → 리스크 줄이기 */
    recommendedRangeRatio: { min: 0.93, max: 0.98 },
  },

  cost: {
    /** 대출 더 적게 나옴 */
    loanLtvDefault: 0.6,

    /** 수리비 증가 */
    repairRate: 0.10,

    /** 기본 보유 기간 9개월로 증가 가능 (원하면 추가 가능)
     *   holdingMonthsDefault: 9,
     */
  },

  profit: {
    /** 높은 안전마진 요구 */
    targetMarginRate: 0.15,
    /** 높은 ROI 목표 */
    targetAnnualRoi: 0.20,
  },

  competitor: {
    /** Hard 모드: 경쟁자 수 증가 (고화 챌린지)
     * - todov3.md 4.5.5 설계표 기준: 6명
     * - 높은 경쟁 강도로 전문가 수준 훈련 제공
     */
    count: 6,
    /** 공격적 입찰 범위 (minBid 대비 92%~120%)
     * - todov3.md 4.5.5 설계표 기준: 92%~120%
     * - 공격적 입찰로 리스크 관리 훈련 제공
     */
    bidRange: { min: 0.92, max: 1.2 },
    /** 난이도별 경쟁 강도 배수
     * - Easy: 0.6 (경쟁 강도 60%) - 범위 폭 축소로 보수적 입찰 유도
     * - Normal: 1.0 (경쟁 강도 100%) - 기본 범위 유지
     * - Hard: 1.5 (경쟁 강도 150%) - 범위 폭 확대로 공격적 입찰 가능
     * 
     * 적용 방식:
     * adjustedRangeMax = rangeMin + (rangeMax - rangeMin) * difficultyMultiplier
     * 
     * 예시 (minBid = 100,000,000원 기준):
     * - Easy: rangeMin = 98M, rangeMax = 108M
     *   → adjustedRangeMax = 98M + (108M - 98M) * 0.6 = 104M (범위 축소)
     * - Normal: adjustedRangeMax = 108M (기본 범위)
     * - Hard: adjustedRangeMax = 92M + (120M - 92M) * 1.5 = 134M (범위 확대)
     */
    difficultyMultiplier: {
      easy: 0.6,
      normal: 1.0,
      hard: 1.5,
    },
  },
};
