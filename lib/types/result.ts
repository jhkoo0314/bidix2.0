// src/lib/types/result.ts
// Auction Engine v2.2 – Final Output Types
// Last Updated: 2025-11-13

import { Property } from "./property";
import { Valuation } from "./valuation";
import { Rights } from "./rights";
import { Costs } from "./cost";
import { Profit } from "./profit";
import { CourtDocsNormalized } from "./court-docs";

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
