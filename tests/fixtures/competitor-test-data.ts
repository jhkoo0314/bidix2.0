/**
 * @file competitor-test-data.ts
 * @description 경쟁자 시뮬레이션 테스트용 Mock 데이터 생성 유틸리티
 *
 * 주요 기능:
 * 1. PropertySeed 생성 헬퍼
 * 2. Valuation 생성 헬퍼
 * 3. Policy 생성 헬퍼
 * 4. AuctionAnalysisResult 생성 헬퍼
 *
 * 핵심 구현 로직:
 * - 난이도별 테스트 데이터 생성
 * - 최소한의 필수 필드만 포함하여 테스트 간소화
 * - 일관된 테스트 데이터로 재현 가능한 테스트 보장
 *
 * @dependencies
 * - @/lib/types: 모든 타입 정의
 * - @/lib/policy: Policy 타입 및 기본값
 *
 * @see {@link /docs/product/todov3.md} - 4.5.6 테스트 및 검증 계획
 */

import {
  PropertySeed,
  PropertyCategory,
  PropertyType,
  DifficultyMode,
  Valuation,
  Rights,
  Costs,
  Profit,
  AuctionAnalysisResult,
  Property,
  AuctionSummary,
} from "@/lib/types";
import { Policy } from "@/lib/policy/policy";
import defaultPolicy from "@/lib/policy/defaultpolicy";
import { easyModePolicy, hardModePolicy } from "@/lib/policy/difficultypolicy";
import { mergePolicyWithDifficulty } from "@/lib/services/simulationservice";

/**
 * Mock PropertySeed 생성 함수
 * @param difficulty 난이도 모드
 * @param overrides 선택적 오버라이드 값
 * @returns PropertySeed 객체
 */
export function createMockPropertySeed(
  difficulty: DifficultyMode = DifficultyMode.Normal,
  overrides?: Partial<PropertySeed>,
): PropertySeed {
  return {
    category: PropertyCategory.Residential,
    type: PropertyType.Apartment,
    sizeM2: 84,
    address: `서울시 강남구 테스트동 ${difficulty} 123`,
    difficulty,
    yearBuilt: 2010,
    floorInfo: { total: 15, current: 5 },
    auctionStep: 1,
    ...overrides,
  };
}

/**
 * Mock Valuation 생성 함수
 * @param minBid 최저 입찰가 (기본값: 100,000,000)
 * @param overrides 선택적 오버라이드 값
 * @returns Valuation 객체
 */
export function createMockValuation(
  minBid: number = 100_000_000,
  overrides?: Partial<Valuation>,
): Valuation {
  const appraisalValue = minBid / 0.7; // 감정가 (최저가 / 0.7)
  const adjustedFMV = appraisalValue * 0.95; // FMV (감정가 * 0.95)
  const maxRecommended = adjustedFMV * 0.9; // 권장가 상단

  return {
    appraisalValue,
    baseFMV: adjustedFMV,
    adjustedFMV,
    exitPrice: {
      "3m": adjustedFMV * 0.96,
      "6m": adjustedFMV * 0.98,
      "12m": adjustedFMV * 1.0,
    },
    minBid,
    recommendedBidRange: {
      min: minBid * 1.05,
      max: maxRecommended,
    },
    confidence: 0.85,
    method: "fmv-weighted",
    ...overrides,
  };
}

/**
 * Mock Rights 생성 함수
 * @param overrides 선택적 오버라이드 값
 * @returns Rights 객체
 */
export function createMockRights(overrides?: Partial<Rights>): Rights {
  return {
    assumableRightsTotal: 0,
    evictionCostEstimated: 2_000_000,
    evictionRisk: 1.0,
    riskFlags: [],
    breakdown: [],
    ...overrides,
  };
}

/**
 * Mock Costs 생성 함수
 * @param userBid 사용자 입찰가
 * @param overrides 선택적 오버라이드 값
 * @returns Costs 객체
 */
export function createMockCosts(
  userBid: number = 100_000_000,
  overrides?: Partial<Costs>,
): Costs {
  const totalAcquisition = userBid * 1.1; // 입찰가 + 10% (비용 포함)
  const loanPrincipal = totalAcquisition * 0.7; // LTV 70%
  const ownCash = totalAcquisition - loanPrincipal;

  return {
    acquisition: {
      totalAcquisition,
      taxes: userBid * 0.045, // 취득세 4.5%
      legalFees: 900_000,
      repairCost: userBid * 0.06, // 수리비 6%
      evictionCost: 2_000_000,
      loanPrincipal,
      ownCash,
    },
    byPeriod: {
      "3m": {
        months: 3,
        holdingCost: userBid * 0.0009 * 3, // 월 보유비용 * 3
        interestCost: loanPrincipal * 0.055 * (3 / 12), // 연 이자율 * 3/12
        totalCost:
          totalAcquisition +
          userBid * 0.0009 * 3 +
          loanPrincipal * 0.055 * (3 / 12),
      },
      "6m": {
        months: 6,
        holdingCost: userBid * 0.0009 * 6,
        interestCost: loanPrincipal * 0.055 * (6 / 12),
        totalCost:
          totalAcquisition +
          userBid * 0.0009 * 6 +
          loanPrincipal * 0.055 * (6 / 12),
      },
      "12m": {
        months: 12,
        holdingCost: userBid * 0.0009 * 12,
        interestCost: loanPrincipal * 0.055,
        totalCost:
          totalAcquisition + userBid * 0.0009 * 12 + loanPrincipal * 0.055,
      },
    },
    ...overrides,
  };
}

/**
 * Mock Profit 생성 함수
 * @param valuation Valuation 객체 (adjustedFMV 계산용)
 * @param costs Costs 객체 (totalCost 계산용)
 * @param overrides 선택적 오버라이드 값
 * @returns Profit 객체
 */
export function createMockProfit(
  valuation: Valuation,
  costs: Costs,
  overrides?: Partial<Profit>,
): Profit {
  const initialSafetyMargin =
    (valuation.adjustedFMV - costs.acquisition.totalAcquisition) /
    valuation.adjustedFMV;

  return {
    initialSafetyMargin,
    breakevenExit_3m: costs.byPeriod["3m"].totalCost,
    breakevenExit_6m: costs.byPeriod["6m"].totalCost,
    breakevenExit_12m: costs.byPeriod["12m"].totalCost,
    scenarios: {
      "3m": {
        months: 3,
        exitPrice: valuation.exitPrice["3m"],
        totalCost: costs.byPeriod["3m"].totalCost,
        netProfit: valuation.exitPrice["3m"] - costs.byPeriod["3m"].totalCost,
        roi:
          (valuation.exitPrice["3m"] - costs.byPeriod["3m"].totalCost) /
          costs.acquisition.ownCash,
        annualizedRoi:
          ((valuation.exitPrice["3m"] - costs.byPeriod["3m"].totalCost) /
            costs.acquisition.ownCash) *
          (12 / 3),
        projectedProfitMargin:
          (valuation.exitPrice["3m"] - costs.byPeriod["3m"].totalCost) /
          valuation.exitPrice["3m"],
        meetsTargetMargin: initialSafetyMargin >= 0.08,
        meetsTargetROI: false, // 3개월은 보통 ROI 목표 미달
      },
      "6m": {
        months: 6,
        exitPrice: valuation.exitPrice["6m"],
        totalCost: costs.byPeriod["6m"].totalCost,
        netProfit: valuation.exitPrice["6m"] - costs.byPeriod["6m"].totalCost,
        roi:
          (valuation.exitPrice["6m"] - costs.byPeriod["6m"].totalCost) /
          costs.acquisition.ownCash,
        annualizedRoi:
          ((valuation.exitPrice["6m"] - costs.byPeriod["6m"].totalCost) /
            costs.acquisition.ownCash) *
          (12 / 6),
        projectedProfitMargin:
          (valuation.exitPrice["6m"] - costs.byPeriod["6m"].totalCost) /
          valuation.exitPrice["6m"],
        meetsTargetMargin: initialSafetyMargin >= 0.08,
        meetsTargetROI: true,
      },
      "12m": {
        months: 12,
        exitPrice: valuation.exitPrice["12m"],
        totalCost: costs.byPeriod["12m"].totalCost,
        netProfit: valuation.exitPrice["12m"] - costs.byPeriod["12m"].totalCost,
        roi:
          (valuation.exitPrice["12m"] - costs.byPeriod["12m"].totalCost) /
          costs.acquisition.ownCash,
        annualizedRoi:
          (valuation.exitPrice["12m"] - costs.byPeriod["12m"].totalCost) /
          costs.acquisition.ownCash,
        projectedProfitMargin:
          (valuation.exitPrice["12m"] - costs.byPeriod["12m"].totalCost) /
          valuation.exitPrice["12m"],
        meetsTargetMargin: initialSafetyMargin >= 0.08,
        meetsTargetROI: true,
      },
    },
    ...overrides,
  };
}

/**
 * Mock AuctionSummary 생성 함수
 * @param profit Profit 객체 (수익성 판단용)
 * @param overrides 선택적 오버라이드 값
 * @returns AuctionSummary 객체
 */
export function createMockAuctionSummary(
  profit: Profit,
  overrides?: Partial<AuctionSummary>,
): AuctionSummary {
  const isProfitable =
    profit.scenarios["3m"].meetsTargetROI ||
    profit.scenarios["6m"].meetsTargetROI ||
    profit.scenarios["12m"].meetsTargetROI;

  // 등급 계산 (간단한 로직)
  const bestRoi = Math.max(
    profit.scenarios["3m"].annualizedRoi,
    profit.scenarios["6m"].annualizedRoi,
    profit.scenarios["12m"].annualizedRoi,
  );
  let grade: "S" | "A" | "B" | "C" | "D" = "D";
  if (bestRoi >= 0.2) grade = "S";
  else if (bestRoi >= 0.15) grade = "A";
  else if (bestRoi >= 0.1) grade = "B";
  else if (bestRoi >= 0.05) grade = "C";

  return {
    isProfitable,
    grade,
    riskLabel: "Low",
    recommendedBidRange: {
      min: 0,
      max: 0,
    },
    bestHoldingPeriod: 12,
    generatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Mock Property 생성 함수
 * @param seed PropertySeed 객체
 * @param overrides 선택적 오버라이드 값
 * @returns Property 객체
 */
export function createMockProperty(
  seed: PropertySeed,
  overrides?: Partial<Property>,
): Property {
  return {
    id: seed.id || "test-property-id",
    category: seed.category,
    type: seed.type,
    sizeM2: seed.sizeM2,
    landSizeM2: seed.landSizeM2 || null,
    yearBuilt: seed.yearBuilt || null,
    appraisalValue: overrides?.appraisalValue ?? 100000000, // 기본 감정가 1억원
    floorInfo: seed.floorInfo || { total: null, current: null },
    address: seed.address || "",
    auctionStep: seed.auctionStep || 1,
    difficulty: seed.difficulty,
    buildingUse: seed.buildingUse || "",
    ...overrides,
  };
}

/**
 * Mock AuctionAnalysisResult 생성 함수
 * @param difficulty 난이도 모드
 * @param userBid 사용자 입찰가
 * @param overrides 선택적 오버라이드 값
 * @returns AuctionAnalysisResult 객체
 */
export function createMockAuctionAnalysisResult(
  difficulty: DifficultyMode = DifficultyMode.Normal,
  userBid: number = 100_000_000,
  overrides?: Partial<AuctionAnalysisResult>,
): AuctionAnalysisResult {
  const seed = createMockPropertySeed(difficulty);
  const property = createMockProperty(seed);
  const valuation = createMockValuation();
  const rights = createMockRights();
  const costs = createMockCosts(userBid);
  const profit = createMockProfit(valuation, costs);
  const summary = createMockAuctionSummary(profit);

  return {
    property,
    valuation,
    rights,
    costs,
    profit,
    summary,
    ...overrides,
  };
}

/**
 * Mock Policy 생성 함수 (난이도별)
 * @param difficulty 난이도 모드
 * @returns 병합된 Policy 객체
 */
export function createMockPolicy(difficulty: DifficultyMode): Policy {
  return mergePolicyWithDifficulty(difficulty);
}

/**
 * 난이도별 기본 Policy 반환 (테스트용)
 */
export function getDefaultPolicyForDifficulty(
  difficulty: DifficultyMode,
): Policy {
  switch (difficulty) {
    case DifficultyMode.Easy:
      return createMockPolicy(DifficultyMode.Easy);
    case DifficultyMode.Hard:
      return createMockPolicy(DifficultyMode.Hard);
    default:
      return defaultPolicy;
  }
}
