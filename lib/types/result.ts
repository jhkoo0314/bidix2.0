// lib/types/result.ts
// Auction Engine v2.2 – Final Output Types
// Last Updated: 2025-11-13

import type { Property } from "@/lib/types/property";
import type { Valuation } from "@/lib/types/valuation";
import type { Rights } from "@/lib/types/rights";
import type { Costs } from "@/lib/types/cost";
import type { Profit } from "@/lib/types/profit";
import type { CourtDocsNormalized } from "@/lib/types/courtdocs";

export interface AuctionSummary {
  isProfitable: boolean;
  grade: "S" | "A" | "B" | "C" | "D";
  riskLabel: string;

  recommendedBidRange: {
    min: number;
    max: number;
  };

  bestHoldingPeriod: 3 | 6 | 12;
  generatedAt: string;
}

export interface AuctionAnalysisResult {
  property: Property;
  valuation: Valuation;
  rights: Rights;
  costs: Costs;
  profit: Profit;
  courtDocs?: CourtDocsNormalized;
  summary: AuctionSummary;
}
