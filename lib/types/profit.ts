// lib/types/profit.ts
// Auction Engine v2.2 – Profit Layer Types
// Last Updated: 2025-11-13

export interface ProfitScenario {
  months: 3 | 6 | 12;
  exitPrice: number;             // 기간별 Exit Price
  totalCost: number;             // 기간별 총원가
  netProfit: number;             // exitPrice - totalCost
  roi: number;                   // 순수익 / 자기자본
  annualizedRoi: number;         // 연환산 ROI
  projectedProfitMargin: number; // 최종 매각가 대비 수익률
  meetsTargetMargin: boolean;
  meetsTargetROI: boolean;
}

export interface Profit {
  initialSafetyMargin: number;   // adjustedFMV 대비 안전마진
  breakevenExit_3m: number;
  breakevenExit_6m: number;
  breakevenExit_12m: number;

  scenarios: {
    ["3m"]: ProfitScenario;
    ["6m"]: ProfitScenario;
    ["12m"]: ProfitScenario;
  };
}
