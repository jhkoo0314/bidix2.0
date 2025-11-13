// tests/defaultpolicy.test.ts
// BIDIX AI - v2.2 Policy Test
// Version: 2.2
// Last Updated: 2025-11-13

import { describe, it, expect } from "vitest";
import defaultPolicy from "@/lib/policy/defaultpolicy";

describe("defaultpolicy.ts (v2.2)", () => {
  it("정책 객체가 필수 섹션을 모두 포함한다", () => {
    expect(defaultPolicy.version).toBeDefined();
    expect(defaultPolicy.updatedAt).toBeDefined();

    expect(defaultPolicy.valuation).toBeDefined();
    expect(defaultPolicy.rights).toBeDefined();
    expect(defaultPolicy.costs).toBeDefined();  // v2.2: costs
    expect(defaultPolicy.profit).toBeDefined();
  });

  it("Valuation 정책 값의 범위가 정상이다", () => {
    const v = defaultPolicy.valuation;

    expect(v.baseFMVRatePerType.apartment).toBeGreaterThan(0.5);
    expect(v.initialMinBidRate).toBeGreaterThan(0.3);
    expect(v.exitDiscountRate).toBeLessThan(1.0);
  });

  it("Profit 정책 값이 기본값으로서 유효한 숫자 범위를 가진다", () => {
    const p = defaultPolicy.profit;

    // v2.2는 기본 정책값이 업데이트되었기 때문에 '정확값' 검증이 아닌 '범위 검증'이 적합함
    expect(p.targetMarginRate).toBeGreaterThan(0);
    expect(p.targetMarginRate).toBeLessThan(0.3);

    expect(p.targetAnnualRoi).toBeGreaterT
