// src/lib/types/valuation.ts
// Auction Engine v2.2 – Valuation Layer Types
// Last Updated: 2025-11-13

export interface Valuation {
  appraisalValue: number;  // 감정가
  baseFMV: number;         // 비보정 시세
  adjustedFMV: number;     // policy 반영 보정 시세

  // 기간별 Exit Price (v2.2 핵심)
  exitPrice: {
    ["3m"]: number;
    ["6m"]: number;
    ["12m"]: number;
  };

  minBid: number;
  recommendedBidRange: {
    min: number;
    max: number;
  };

  confidence: number;
  method?: "fmv-weighted" | "appraisal-ratio";
  notes?: string[];
}
