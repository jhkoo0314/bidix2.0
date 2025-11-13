// tests/rightsengine.test.ts
// BIDIX AI - Rights Engine Test (v2.2 Compatible)
// Version: 2.2
// Last Updated: 2025-11-13

import { describe, it, expect } from "vitest";

import AuctionEngine from "@/lib/engines/auctionengine";
import { generateSimulationScenario } from "@/lib/generators/simulationgenerator";

import defaultPolicy from "@/lib/policy/defaultpolicy";
import { easyModePolicy, hardModePolicy } from "@/lib/policy/difficultypolicy";
import { mergePolicy } from "@/lib/policy/policy";

describe("Rights Calculation within AuctionEngine (v2.2)", () => {
  it("easy 모드에서 인수금액과 명도 위험도가 낮아야 한다", () => {
    const { propertySeed, courtDocs } = generateSimulationScenario({
      difficulty: "easy",
    });

    const userBid = propertySeed.appraisalValue * 0.8;
    const policy = mergePolicy(defaultPolicy, easyModePolicy);

    const result = AuctionEngine.run({
      seed: propertySeed,
      courtDocs,
      userBid,
      policy,
      difficulty: "easy",
    });

    const rights = result.rights;

    // Easy 모드는 대부분 인수금 0에 가깝다
    expect(rights.assumableRightsTotal).toBeGreaterThanOrEqual(0);
    expect(rights.assumableRightsTotal).toBeLessThanOrEqual(0);

    // 명도 위험도는 낮아야 함
    expect(rights.evictionRisk).toBeLessThan(2);
  });

  it("hard 모드에서는 인수금액이 있거나, 명도비용 또는 위험도가 높아야 한다", () => {
    const { propertySeed, courtDocs } = generateSimulationScenario({
      difficulty: "hard",
    });

    const userBid = propertySeed.appraisalValue * 0.8;
    const policy = mergePolicy(defaultPolicy, hardModePolicy);

    const result = AuctionEngine.run({
      seed: propertySeed,
      courtDocs,
      userBid,
      policy,
      difficulty: "hard",
    });

    const rights = result.rights;

    const hasHighRisk =
      rights.assumableRightsTotal > 0 ||
      rights.evictionCostEstimated > 0 ||
      rights.evictionRisk >= 3;

    expect(hasHighRisk).toBe(true);
  });
});
