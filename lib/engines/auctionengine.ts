// src/lib/engines/auctionengine.ts
// Auction Engine v2.2 - Master Orchestrator
// Version: 2.2
// Last Updated: 2025-11-13

import {
  Profit,
  AuctionAnalysisResult,
  PropertySeed,
  CourtDocsRaw,
  CourtDocsNormalized,
} from "@/lib/types";

import { Policy } from "@/lib/policy/policy";
import defaultPolicy from "@/lib/policy/defaultpolicy";

import { PropertyEngine } from "./propertyengine";
import { ValuationEngine } from "./valuationengine";
import { RightsEngine } from "./rightsengine";
import { CostEngine } from "./costengine";
import { ProfitEngine } from "./profitengine";
import { CourtDocsLayer } from "./courtdocslayer";

export class AuctionEngine {
  static run(params: {
    seed: PropertySeed;
    courtDocs?: CourtDocsRaw;
    userBid: number;
    policy?: Policy;
  }): AuctionAnalysisResult {
    const policy = params.policy ?? defaultPolicy;

    /** 1) Property */
    const property = PropertyEngine.normalize(params.seed);

    /** 2) CourtDocs */
    const normalizedDocs: CourtDocsNormalized | undefined = params.courtDocs
      ? CourtDocsLayer.normalize(params.courtDocs)
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
      policy
    );

    /** 6) Profit (3·6·12) */
    const profit: Profit = ProfitEngine.evaluate(
      property,
      valuation,
      costs,
      policy
    );

    /** 7) Summary 생성 */
    const summary = {
      recommendedBidRange: valuation.recommendedBidRange,

      isProfitable3m:
        profit.scenarios.find((s) => s.months === 3)?.netProfit > 0,
      isProfitable6m:
        profit.scenarios.find((s) => s.months === 6)?.netProfit > 0,
      isProfitable12m:
        profit.scenarios.find((s) => s.months === 12)?.netProfit > 0,

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
  const roi12 = profit.scenarios.find((s) => s.months === 12)?.annualizedRoi ?? 0;

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
