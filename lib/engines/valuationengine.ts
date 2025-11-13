// lib/engines/valuationengine.ts
// Auction Engine v2.2 - ValuationEngine (FMV 안정화 + ExitPrice Multi)
// Version: 2.2 (Patched for exitPrice {3m,6m,12m} object)
// Last Updated: 2025-11-13

import { Property, Valuation } from "@/lib/types";
import { Policy } from "@/lib/policy/policy";
import defaultPolicy from "@/lib/policy/defaultpolicy";
import { roundToK } from "@/lib/utils/number";

export class ValuationEngine {
  static evaluate(
    property: Property,
    policy: Policy = defaultPolicy
  ): Valuation {
    const notes: string[] = [];

    /* ---------------------------------------------
     * 1) Initial FMV (감정가 기반)
     * --------------------------------------------- */
    const baseFMVRate = policy.valuation.baseFMVRatePerType[property.type] ?? 0.95; // 예: 0.97
    const initialFMV = property.appraisalValue * baseFMVRate;

    notes.push(
      `initialFMV = appraisal(${property.appraisalValue}) × baseRate(${baseFMVRate})`
    );

    /* ---------------------------------------------
     * 2) Adjusted FMV (FMV 안정화 로직 + clamp)
     *  - 감정가 대비 과도한 저가/고가 왜곡 방지
     * --------------------------------------------- */
    const clampMin = property.appraisalValue * policy.valuation.fmvClamp.min;
    const clampMax = property.appraisalValue * policy.valuation.fmvClamp.max;

    const adjustedFMV = Math.min(Math.max(initialFMV, clampMin), clampMax);

    notes.push(
      `adjustedFMV = clamp(initialFMV=${Math.round(
        initialFMV
      )}, min=${clampMin}, max=${clampMax})`
    );

    /* ---------------------------------------------
     * 3) 최저입찰가 (minBid)
     *   감정가 × lowestBidRateDefault × 0.8^(step-1)
     *   - 회차가 진행될수록 단계적으로 할인
     * --------------------------------------------- */
    const baseRate = policy.valuation.initialMinBidRate; // 예: 0.7
    const reduction = 0.8 ** ((property.auctionStep ?? 1) - 1);

    const minBid = property.appraisalValue * baseRate * reduction;

    notes.push(
      `minBid = appraisal × baseRate(${baseRate}) × 0.8^(step-1=${
        (property.auctionStep ?? 1) - 1
      })`
    );

    /* ---------------------------------------------
     * 4) Exit Price (3 / 6 / 12개월)
     *   - 보유기간별 계단식 매각가
     *   - Valuation v2.2 타입: exitPrice: { "3m" | "6m" | "12m" }
     * --------------------------------------------- */
    const exitPrice3m = adjustedFMV * 0.96; // 단기: 약간 할인 매각
    const exitPrice6m = adjustedFMV * 0.98; // 중기: 보수적 정상가
    const exitPrice12m = adjustedFMV * 1.0; // 장기: FMV 수준

    notes.push("exitPrice[3m/6m/12m] = adjustedFMV × 0.96 / 0.98 / 1.00");

    /* ---------------------------------------------
     * 5) Recommended Bid Range (권장 입찰가 구간)
     *   adjustedFMV × recommendedBidGap(min~max)
     * --------------------------------------------- */
    const gapMin = policy.valuation.recommendedRangeRatio.min ?? 0.94;
    const gapMax = policy.valuation.recommendedRangeRatio.max ?? 0.99;

    const recommendedMin = adjustedFMV * gapMin;
    const recommendedMax = adjustedFMV * gapMax;

    notes.push(
      `recommendedBidRange = adjustedFMV × ${gapMin} ~ ${gapMax}`
    );

    /* ---------------------------------------------
     * 6) Confidence (정책 기반 단순 가중)
     * --------------------------------------------- */
    const confidence = 0.25; // 기본값 사용

    /* ---------------------------------------------
     * 7) Valuation 결과 반환 (v2.2 정식 구조)
     * --------------------------------------------- */
    return {
      appraisalValue: property.appraisalValue,
      baseFMV: roundToK(initialFMV),
      adjustedFMV: roundToK(adjustedFMV),

      // ✅ v2.2: Multi Exit Price 객체 구조
      exitPrice: {
        "3m": roundToK(exitPrice3m),
        "6m": roundToK(exitPrice6m),
        "12m": roundToK(exitPrice12m),
      },

      minBid: roundToK(minBid),

      recommendedBidRange: {
        min: roundToK(recommendedMin),
        max: roundToK(recommendedMax),
      },

      confidence,
      method: "fmv-weighted",
      notes,
    };
  }
}
