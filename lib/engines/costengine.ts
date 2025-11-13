// lib/engines/costengine.ts
// Auction Engine v2.2 - CostEngine (취득·보유·대출·명도 기반 총원가 계산)
// Version: 2.2
// Last Updated: 2025-11-13

import { Costs, Property, Valuation, Rights } from "@/lib/types";
import { Policy } from "@/lib/policy/policy";
import defaultPolicy from "@/lib/policy/defaultpolicy";
import { roundToK } from "@/lib/utils/number";

/**
 * CostEngine v2.2 (SSOT)
 * -----------------------------------
 * 1) 취득 시점 확정비용 (totalAcquisition)
 * 2) 대출원금(loanPrincipal) / 자기자본(ownCash)
 * 3) 3·6·12개월 보유비용/이자/총원가
 *
 *  - holdingCost_Xm  = userBid * holdingMonthlyRate * X
 *  - interestCost_Xm = loanPrincipal * loanRate * (X/12)
 *
 *  ✅ backward compatibility:
 *    - holdingCost  → 6개월 기준
 *    - interestCost → 6개월 기준
 *    - totalCost    → 6개월 기준
 */
export class CostEngine {
  static evaluate(
    property: Property,
    _valuation: Valuation,
    rights: Rights,
    userBid: number,
    policy: Policy = defaultPolicy,
  ): Costs {
    const appraisalValue = property.appraisalValue;

    /* -------------------------------------------------------
     * 1) 취득 관련 비용 (Acquisition)
     * ------------------------------------------------------- */

    const taxes = calcAcquisitionTax(userBid, policy);
    const legalFees = calcLegalFees(userBid, policy);
    const repairCost = calcRepairCost(appraisalValue, policy);
    const evictionCost = rights.evictionCostEstimated ?? 0;

    const totalAcquisition =
      userBid +
      rights.assumableRightsTotal +
      taxes +
      legalFees +
      repairCost +
      evictionCost;

    /* -------------------------------------------------------
     * 2) 대출 & 자기자본
     * ------------------------------------------------------- */

    const loanLtv = policy.cost.loanLtvDefault ?? 0.7;
    const loanPrincipal = Math.min(userBid * loanLtv, userBid);
    const ownCash = Math.max(0, totalAcquisition - loanPrincipal);

    /* -------------------------------------------------------
     * 3) 보유비용 & 이자비용 (3 / 6 / 12개월)
     *    - SSOT: cost-profit-logic.md v2.2
     * ------------------------------------------------------- */

    // 3개월
    const holdingCost3m = calcHoldingCost(userBid, policy, 3);
    const interestCost3m = calcInterestCost(loanPrincipal, policy, 3);
    const totalCost3m = totalAcquisition + holdingCost3m + interestCost3m;

    // 6개월 (기본)
    const holdingCost6m = calcHoldingCost(userBid, policy, 6);
    const interestCost6m = calcInterestCost(loanPrincipal, policy, 6);
    const totalCost6m = totalAcquisition + holdingCost6m + interestCost6m;

    // 12개월
    const holdingCost12m = calcHoldingCost(userBid, policy, 12);
    const interestCost12m = calcInterestCost(loanPrincipal, policy, 12);
    const totalCost12m = totalAcquisition + holdingCost12m + interestCost12m;

    /* -------------------------------------------------------
     * 4) 반환 구조 (v2.2 타입 구조)
     * ------------------------------------------------------- */

    return {
      acquisition: {
        totalAcquisition: roundToK(totalAcquisition),
        taxes: roundToK(taxes),
        legalFees: roundToK(legalFees),
        repairCost: roundToK(repairCost),
        evictionCost: roundToK(evictionCost),
        loanPrincipal: roundToK(loanPrincipal),
        ownCash: roundToK(ownCash),
      },
      byPeriod: {
        "3m": {
          months: 3,
          holdingCost: roundToK(holdingCost3m),
          interestCost: roundToK(interestCost3m),
          totalCost: roundToK(totalCost3m),
        },
        "6m": {
          months: 6,
          holdingCost: roundToK(holdingCost6m),
          interestCost: roundToK(interestCost6m),
          totalCost: roundToK(totalCost6m),
        },
        "12m": {
          months: 12,
          holdingCost: roundToK(holdingCost12m),
          interestCost: roundToK(interestCost12m),
          totalCost: roundToK(totalCost12m),
        },
      },
    };
  }
}

/* ========================================================
 * 세부 계산 함수들 (SSOT)
 * ======================================================== */

/** 취득세: userBid × acquisitionTaxRate */
function calcAcquisitionTax(bid: number, policy: Policy): number {
  const rate = policy.cost.acquisitionTaxRate ?? 0.045;
  return bid * rate;
}

/** 법무/등기/인지대 등: 현재는 flat 값만 사용 */
function calcLegalFees(_bid: number, policy: Policy): number {
  return policy.cost.legalFeeFlat ?? 900_000;
}

/** 감정가 기준 수리비: appraisalValue × repairRate */
function calcRepairCost(appraisalValue: number, policy: Policy): number {
  const rate = policy.cost.repairRate ?? 0.06;
  return appraisalValue * rate;
}

/** 보유비용: userBid × holdingMonthlyRate × (months) */
function calcHoldingCost(
  bid: number,
  policy: Policy,
  months: number,
): number {
  const mRate = policy.cost.holdingMonthlyRate ?? 0.0009;
  return bid * mRate * months;
}

/** 이자비용: loanPrincipal × loanRate × (months/12) */
function calcInterestCost(
  loanPrincipal: number,
  policy: Policy,
  months: number,
): number {
  const rate = policy.cost.loanRate ?? 0.055;
  return loanPrincipal * rate * (months / 12);
}
