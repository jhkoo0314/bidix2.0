/**
 * @file auctionengine.ts
 * @description 경매 엔진 - Master Orchestrator (v2.2)
 *
 * 주요 기능:
 * 1. 모든 하위 엔진을 순차적으로 실행하여 경매 분석 결과 생성
 * 2. Property → Valuation → Rights → Cost → Profit 계산 파이프라인
 * 3. 최종 결과 요약 생성 (등급, 리스크 라벨, 최적 보유기간)
 *
 * 핵심 구현 로직:
 * - 순수 함수 (Pure Function): 외부 I/O 금지, 결정론적 계산
 * - Policy 기반 계산: 모든 비즈니스 규칙은 Policy에서 가져옴
 * - 엔진 실행 순서:
 *   1. PropertyEngine: PropertySeed → Property 정규화
 *   2. CourtDocsLayer: 법원 문서 정규화
 *   3. ValuationEngine: FMV, 최저입찰가, ExitPrice 계산
 *   4. RightsEngine: 권리 분석, 명도비용, 리스크 계산
 *   5. CostEngine: 취득비용, 보유비용, 대출이자 계산
 *   6. ProfitEngine: 3/6/12개월 수익 시나리오 계산
 * - 최종 요약: 등급(S/A/B/C/D), 리스크 라벨, 최적 보유기간 결정
 *
 * 브랜드 통합:
 * - Design System v2.2 준수
 * - Policy 기반 유연성: 난이도별 정책 적용 가능
 *
 * @dependencies
 * - @/lib/types: PropertySeed, AuctionAnalysisResult, CourtDocsNormalized, Profit
 * - @/lib/policy/policy: Policy 인터페이스
 * - @/lib/policy/defaultpolicy: 기본 정책값
 * - @/lib/engines/propertyengine: PropertyEngine
 * - @/lib/engines/valuationengine: ValuationEngine
 * - @/lib/engines/rightsengine: RightsEngine
 * - @/lib/engines/costengine: CostEngine
 * - @/lib/engines/profitengine: ProfitEngine
 * - @/lib/engines/courtdocslayer: normalizeCourtDocs
 *
 * @see {@link /docs/engine/auction-flow.md} - 경매 엔진 플로우
 * @see {@link /docs/engine/api-contracts.md} - API 계약
 */

import {
  Profit,
  AuctionAnalysisResult,
  PropertySeed,
  CourtDocsNormalized,
} from "@/lib/types";

import { Policy } from "@/lib/policy/policy";
import defaultPolicy from "@/lib/policy/defaultpolicy";

import { PropertyEngine } from "./propertyengine";
import { ValuationEngine } from "./valuationengine";
import { RightsEngine } from "./rightsengine";
import { CostEngine } from "./costengine";
import { ProfitEngine } from "./profitengine";
import { normalizeCourtDocs } from "./courtdocslayer";

/**
 * AuctionEngine (v2.2)
 * ---------------------------------------
 * 경매 분석 마스터 오케스트레이터
 *
 * @example
 * ```typescript
 * const result = AuctionEngine.run({
 *   seed: propertySeed,
 *   courtDocs: courtDocsNormalized,
 *   userBid: 50000000,
 *   policy: customPolicy, // optional
 *   userCash: 20000000, // optional
 *   userLoan: 30000000, // optional
 * });
 * ```
 */
export class AuctionEngine {
  static run(params: {
    seed: PropertySeed;
    courtDocs?: CourtDocsNormalized;
    userBid: number;
    policy?: Policy;
    userCash?: number;    // 사용자 입력 현금 (optional)
    userLoan?: number;    // 사용자 입력 대출 (optional)
  }): AuctionAnalysisResult {
    const policy = params.policy ?? defaultPolicy;

    /** 1) Property */
    const property = PropertyEngine.normalize(params.seed);

    /** 2) CourtDocs */
    const normalizedDocs: CourtDocsNormalized | undefined = params.courtDocs
      ? normalizeCourtDocs(params.courtDocs)
      : undefined;

    /** 3) Valuation */
    const valuation = ValuationEngine.evaluate(property, policy);

    /** 4) Rights */
    const rights = RightsEngine.evaluate(normalizedDocs, policy);

    /** 5) Cost (3·6·12개월 원가 포함) */
    const costs = CostEngine.evaluate(
      property,
      valuation,
      rights,
      params.userBid,
      policy,
      params.userCash,
      params.userLoan
    );

    /** 6) Profit (3·6·12) */
    const profit: Profit = ProfitEngine.evaluate(
      property,
      valuation,
      costs,
      policy
    );

    /** 7) Summary 생성 */
    const isProfitable3m = profit.scenarios["3m"].netProfit > 0;
    const isProfitable6m = profit.scenarios["6m"].netProfit > 0;
    const isProfitable12m = profit.scenarios["12m"].netProfit > 0;
    
    // 최적 보유기간 결정 (가장 높은 ROI 기준)
    const bestHoldingPeriod: 3 | 6 | 12 = 
      profit.scenarios["12m"].annualizedRoi >= profit.scenarios["6m"].annualizedRoi &&
      profit.scenarios["12m"].annualizedRoi >= profit.scenarios["3m"].annualizedRoi
        ? 12
        : profit.scenarios["6m"].annualizedRoi >= profit.scenarios["3m"].annualizedRoi
        ? 6
        : 3;
    
    const summary = {
      recommendedBidRange: valuation.recommendedBidRange,
      isProfitable: isProfitable3m || isProfitable6m || isProfitable12m,
      bestHoldingPeriod,
      grade: gradeResult(profit),
      riskLabel: riskLabel(rights.evictionRisk),
      generatedAt: new Date().toISOString(),
    };

    return {
      property,
      valuation,
      rights,
      costs,
      profit,
      courtDocs: normalizedDocs,
      summary,
    };
  }
}

/** -----------------------------------------
 * 등급 산정 (12개월 연환산 ROI 기준)
 * ----------------------------------------- */
function gradeResult(profit: Profit): "S" | "A" | "B" | "C" | "D" {
  const roi12 = profit.scenarios["12m"].annualizedRoi ?? 0;

  if (roi12 >= 0.5) return "S";
  if (roi12 >= 0.35) return "A";
  if (roi12 >= 0.2) return "B";
  if (roi12 >= 0.1) return "C";
  return "D";
}

/** -----------------------------------------
 * 명도 리스크
 * ----------------------------------------- */
function riskLabel(evictionRisk: number): string {
  if (evictionRisk >= 0.6) return "⚠️ High Risk";
  if (evictionRisk >= 0.3) return "⚠️ Medium Risk";
  return "✅ Safe";
}
