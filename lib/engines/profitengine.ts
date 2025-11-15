// lib/engines/profitengine.ts
// Auction Engine v2.2 - ProfitEngine (3/6/12개월 Exit Multi Scenario Evaluation)
// Version: 2.2
// Last Updated: 2025-11-13

import { Profit, ProfitScenario, Costs, Property, Valuation } from "@/lib/types";
import { Policy } from "@/lib/policy/policy";
import defaultPolicy from "@/lib/policy/defaultpolicy";
import { roundToK } from "@/lib/utils/number";

/**
 * ProfitEngine v2.2 (SSOT)
 * -----------------------------------------
 * • ExitPrice 3/6/12 각각에 대해 독립 시나리오 평가
 * • 각 시나리오: netProfit, ROI, annualizedROI, projectedMargin
 * • 공통 값:
 *    - initialSafetyMargin (FMV 대비 초기 안전마진)
 *    - breakevenExit (손익분기점 Exit 가격)
 *
 * 반환 타입:
 *   Profit {
 *     initialSafetyMargin: number;
 *     scenarios: ProfitScenario[]; // 3, 6, 12
 *     breakevenExit: number;
 *   }
 */
export class ProfitEngine {
  static evaluate(
    _property: Property,
    valuation: Valuation,
    costs: Costs,
    policy: Policy = defaultPolicy,
  ): Profit {
    const targetMargin = policy.profit.targetMarginRate ?? 0.08;
    const targetAnnualRoi = policy.profit.targetAnnualRoi ?? 0.1;
    
    // 🔹 ROI 상한선 정책 값 (기본값 설정)
    const maxRoi = policy.profit.maxRoi ?? 10; // 1000%
    const maxAnnualizedRoi = policy.profit.maxAnnualizedRoi ?? 50; // 5000%

    /* -------------------------------------------------------
     * 1) 초기 안전마진 (매수 시점 기준 – 단일 값)
     *    (FMV - totalAcquisition) / FMV
     * ------------------------------------------------------- */
    const fmv = valuation.adjustedFMV || valuation.appraisalValue;
    const initialSafetyMargin =
      fmv > 0 ? (fmv - costs.acquisition.totalAcquisition) / fmv : 0;

    /* -------------------------------------------------------
     * 2) 시나리오별 수익 계산 (3 / 6 / 12개월)
     * ------------------------------------------------------- */

    const totalAcquisition = costs.acquisition.totalAcquisition;
    
    // 🔹 Minimum own cash guard (방안 1 핵심)
    // 현금 전액 구매 케이스도 고려하여 합리적인 ROI 계산
    const minOwnCash = Math.max(
      totalAcquisition * 0.1, // 총 취득원가의 10%
      1_000_000               // 최소 100만원
    );

    const scenarioDefs: Array<{
      months: 3 | 6 | 12;
      periodKey: "3m" | "6m" | "12m";
    }> = [
      { months: 3, periodKey: "3m" },
      { months: 6, periodKey: "6m" },
      { months: 12, periodKey: "12m" },
    ];

    const scenariosMap: {
      "3m"?: ProfitScenario;
      "6m"?: ProfitScenario;
      "12m"?: ProfitScenario;
    } = {};

    for (const def of scenarioDefs) {
      const exitPrice = valuation.exitPrice[def.periodKey];
      const periodCost = costs.byPeriod[def.periodKey];
      const totalCost = periodCost.totalCost;

      // 방어 코드: 값이 없으면 스킵
      if (!exitPrice || !totalCost) {
        continue;
      }

      const netProfit = exitPrice - totalCost;
      
      // 🔹 실제 ownCash + 최소자기자본 중 높은 값 선택
      // 현금 전액 구매 케이스: ownCash = totalAcquisition (minOwnCash보다 크므로 영향 없음)
      const ownCash = Math.max(
        costs.acquisition.ownCash > 0 ? costs.acquisition.ownCash : 1,
        minOwnCash
      );

      // 🔹 ROI 계산 안정화
      const rawRoi = netProfit / ownCash;
      
      // 🔹 ROI 상한 (방안 2)
      const cappedRoi = Math.min(rawRoi, maxRoi);

      const months = def.months;
      
      // 🔹 연환산 ROI
      let annualizedRoi =
        months > 0 ? Math.pow(1 + cappedRoi, 12 / months) - 1 : 0;

      // 🔹 연환산 ROI 상한
      annualizedRoi = Math.min(annualizedRoi, maxAnnualizedRoi);

      const projectedProfitMargin =
        exitPrice > 0 ? netProfit / exitPrice : 0;

      const meetsTargetMargin = projectedProfitMargin >= targetMargin;
      const meetsTargetROI = annualizedRoi >= targetAnnualRoi;

      const scenario: ProfitScenario = {
        months,
        exitPrice,
        totalCost,
        netProfit: roundToK(netProfit),
        roi: cappedRoi,
        annualizedRoi,
        projectedProfitMargin,
        meetsTargetMargin,
        meetsTargetROI,
      };

      scenariosMap[def.periodKey] = scenario;
    }

    /* -------------------------------------------------------
     * 3) 손익분기점 Exit (단일 값)
     *    - SSOT: totalAcquisition 기준
     * ------------------------------------------------------- */
    const breakevenExit3m = roundToK(costs.acquisition.totalAcquisition);
    const breakevenExit6m = roundToK(costs.acquisition.totalAcquisition);
    const breakevenExit12m = roundToK(costs.acquisition.totalAcquisition);

    return {
      initialSafetyMargin,
      scenarios: {
        "3m": scenariosMap["3m"]!,
        "6m": scenariosMap["6m"]!,
        "12m": scenariosMap["12m"]!,
      },
      breakevenExit_3m: breakevenExit3m,
      breakevenExit_6m: breakevenExit6m,
      breakevenExit_12m: breakevenExit12m,
    };
  }
}
