// lib/types/cost.ts
// Auction Engine v2.2 – Cost Layer Types
// Last Updated: 2025-11-13

/**
 * Acquisition(취득원가) = 모든 보유기간에 공통 적용되는 비용
 */
export interface AcquisitionCost {
  totalAcquisition: number;    // 총 취득원가 (userBid + rights + taxes + legalFees + repairCost + evictionCost)
  taxes: number;               // 취득세 등
  legalFees: number;           // 법무비용
  repairCost: number;          // 수리비
  evictionCost: number;        // 명도 비용
  loanPrincipal: number;       // 대출 원금
  ownCash: number;             // 실제 필요 자기자본 (totalAcquisition - loanPrincipal)
}

/**
 * 기간별 Cost
 * — 3개월 / 6개월 / 12개월
 */
export interface PeriodCost {
  months: 3 | 6 | 12;
  holdingCost: number;
  interestCost: number;
  totalCost: number;       // = acquisition.totalAcquisition + holdingCost + interestCost
}

/**
 * CostEngine 최종 출력
 */
export interface Costs {
  acquisition: AcquisitionCost;
  byPeriod: {
    ["3m"]: PeriodCost;
    ["6m"]: PeriodCost;
    ["12m"]: PeriodCost;
  };
}
