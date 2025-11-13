// tests/profitengine.test.ts
// BIDIX AI - Profit Engine Test (v2.2 Compatible)
// Version: 2.2
// Last Updated: 2025-11-13

import { describe, it, expect } from "vitest";

import AuctionEngine from "@/lib/engines/auctionengine";
import { generateSimulationScenario } from "@/lib/generators/simulationgenerator";

import defaultPolicy from "@/lib/policy/defaultpolicy";
import { easyModePolicy, hardModePolicy } from "@/lib/policy/difficultypolicy";
import { mergePolicy } from "@/lib/policy/policy";

describe("Profit Calculation within AuctionEngine (v2.2)", () => {
  it("easy 모드에서 수익 관련 지표들이 유효한 숫자로 계산되어야 한다", () => {
    const { propertySeed, courtDocs } = generateSimulationScenario({
      difficulty: "easy",
    });

    const userBid = propertySeed.appraisalValue * 0.75;
    const policy = mergePolicy(defaultPolicy, easyModePolicy);

    const result = AuctionEngine.run({
      seed: propertySeed,
      courtDocs,
      userBid,
      policy,
      difficulty: "easy",
    });

    const profit = result.profit;

    expect(profit).toBeDefined();
    expect(Number.isFinite(profit.netProfit)).toBe(true);
    expect(Number.isFinite(profit.roi)).toBe(true);
    expect(Number.isFinite(profit.annualizedRoi)).toBe(true);
    expect(Number.isFinite(profit.initialSafetyMargin)).toBe(true);
  });

  it("명백한 손실 케이스에서는 isProfitable=false, 목표치 미달이어야 한다", () => {
    const { propertySeed, courtDocs } = generateSimulationScenario({
      difficulty: "hard",
    });

    // FMV보다 훨씬 높은 비정상 입찰가
    const userBid = propertySeed.appraisalValue * 1.5;
    const policy = mergePolicy(defaultPolicy, hardModePolicy);

    const result = AuctionEngine.run({
      seed: propertySeed,
      courtDocs,
      userBid,
      policy,
      difficulty: "hard",
    });

    const profit = result.profit;

    expect(profit.netProfit).toBeLessThan(0);
    expect(result.summary.isProfitable).toBe(false);

    expect(profit.meetsTargetMargin).toBe(false);
    expect(profit.meetsTargetROI).toBe(false);
  });
});
