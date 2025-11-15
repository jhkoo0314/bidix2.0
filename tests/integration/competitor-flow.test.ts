/**
 * @file competitor-flow.test.ts
 * @description 경쟁자 시뮬레이션 통합 테스트
 *
 * 주요 테스트 대상:
 * 1. 전체 입찰 플로우 테스트 (시뮬레이션 생성 → 입찰 제출 → 결과 확인)
 * 2. 난이도별 경쟁 강도 차이 검증
 * 3. 경쟁자 입찰가 생성 및 outcome 판단 통합 검증
 *
 * 핵심 구현 로직:
 * - generateCompetitorBids와 determineOutcome의 통합 동작 검증
 * - 난이도별 정책 차이가 실제 결과에 반영되는지 확인
 * - 시드 기반 일관성이 전체 플로우에서 유지되는지 확인
 *
 * @dependencies
 * - vitest: 테스트 프레임워크
 * - @/lib/services/simulationservice: 테스트 대상 함수
 * - @/tests/fixtures/competitor-test-data: 테스트 데이터 Fixture
 *
 * @see {@link /docs/product/todov3.md} - 4.5.6 테스트 및 검증 계획
 */

import { describe, it, expect } from "vitest";
import {
  generateCompetitorBids,
  determineOutcome,
} from "@/lib/services/simulationservice";
import {
  createMockPropertySeed,
  createMockValuation,
  createMockPolicy,
  createMockAuctionAnalysisResult,
} from "@/tests/fixtures/competitor-test-data";
import { DifficultyMode } from "@/lib/types";

describe("전체 입찰 플로우 통합 테스트", () => {
  describe("시뮬레이션 생성 → 입찰 제출 → 결과 확인", () => {
    it("전체 플로우가 올바르게 작동해야 함", () => {
      // 1. 시뮬레이션 생성 (Mock 데이터)
      const seed = createMockPropertySeed(DifficultyMode.Normal);
      const result = createMockAuctionAnalysisResult(
        DifficultyMode.Normal,
        100_000_000,
      );
      const policy = createMockPolicy(DifficultyMode.Normal);

      // 2. 경쟁자 입찰가 생성
      const competitorBids = generateCompetitorBids(
        seed,
        result.valuation,
        policy,
      );

      // 경쟁자 입찰가가 올바르게 생성되었는지 확인
      expect(competitorBids.length).toBe(4); // Normal 모드: 4명
      expect(competitorBids.length).toBeGreaterThan(0);
      competitorBids.forEach((bid) => {
        expect(bid).toBeGreaterThanOrEqual(result.valuation.minBid);
      });

      // 3. 사용자 입찰가 설정 및 결과 확인
      const maxCompetitorBid = Math.max(...competitorBids);
      const userBid = maxCompetitorBid + 5_000_000; // 경쟁자보다 높게

      const outcome = determineOutcome(result, userBid, seed, policy);

      // 4. 결과 검증
      expect(outcome).toBe("win"); // 경쟁자보다 높으므로 승리
    });

    it("경쟁자에게 패배하는 경우를 올바르게 처리해야 함", () => {
      const seed = createMockPropertySeed(DifficultyMode.Normal);
      const result = createMockAuctionAnalysisResult(
        DifficultyMode.Normal,
        100_000_000,
      );
      const policy = createMockPolicy(DifficultyMode.Normal);

      // 경쟁자 입찰가 생성
      const competitorBids = generateCompetitorBids(
        seed,
        result.valuation,
        policy,
      );
      const maxCompetitorBid = Math.max(...competitorBids);

      // 사용자 입찰가가 경쟁자보다 낮게 설정
      const userBid = maxCompetitorBid - 1_000_000; // 경쟁자보다 낮게

      const outcome = determineOutcome(result, userBid, seed, policy);

      // 패배해야 함
      expect(outcome).toBe("lose");
    });

    it("과입찰인 경우를 올바르게 처리해야 함", () => {
      const seed = createMockPropertySeed(DifficultyMode.Normal);
      const result = createMockAuctionAnalysisResult(
        DifficultyMode.Normal,
        100_000_000,
      );
      const policy = createMockPolicy(DifficultyMode.Normal);

      const maxRecommended = result.valuation.recommendedBidRange.max;
      const userBid = maxRecommended * 1.1 + 10_000_000; // 과입찰

      const outcome = determineOutcome(result, userBid, seed, policy);

      // 과입찰이므로 overpay 반환
      expect(outcome).toBe("overpay");
    });
  });

  describe("난이도별 경쟁 강도 차이 검증", () => {
    it("Easy 모드에서 경쟁자 수가 2명이어야 함", () => {
      const easySeed = createMockPropertySeed(DifficultyMode.Easy);
      const easyResult = createMockAuctionAnalysisResult(
        DifficultyMode.Easy,
        100_000_000,
      );
      const easyPolicy = createMockPolicy(DifficultyMode.Easy);

      const competitorBids = generateCompetitorBids(
        easySeed,
        easyResult.valuation,
        easyPolicy,
      );

      expect(competitorBids.length).toBe(2);
    });

    it("Normal 모드에서 경쟁자 수가 4명이어야 함", () => {
      const normalSeed = createMockPropertySeed(DifficultyMode.Normal);
      const normalResult = createMockAuctionAnalysisResult(
        DifficultyMode.Normal,
        100_000_000,
      );
      const normalPolicy = createMockPolicy(DifficultyMode.Normal);

      const competitorBids = generateCompetitorBids(
        normalSeed,
        normalResult.valuation,
        normalPolicy,
      );

      expect(competitorBids.length).toBe(4);
    });

    it("Hard 모드에서 경쟁자 수가 6명이어야 함", () => {
      const hardSeed = createMockPropertySeed(DifficultyMode.Hard);
      const hardResult = createMockAuctionAnalysisResult(
        DifficultyMode.Hard,
        100_000_000,
      );
      const hardPolicy = createMockPolicy(DifficultyMode.Hard);

      const competitorBids = generateCompetitorBids(
        hardSeed,
        hardResult.valuation,
        hardPolicy,
      );

      expect(competitorBids.length).toBe(6);
    });

    it("난이도별 입찰가 범위 차이를 확인해야 함", () => {
      const minBid = 100_000_000;

      // Easy 모드
      const easySeed = createMockPropertySeed(DifficultyMode.Easy);
      const easyValuation = createMockValuation(minBid);
      const easyPolicy = createMockPolicy(DifficultyMode.Easy);
      const easyBids = generateCompetitorBids(
        easySeed,
        easyValuation,
        easyPolicy,
      );

      // Normal 모드
      const normalSeed = createMockPropertySeed(DifficultyMode.Normal);
      const normalValuation = createMockValuation(minBid);
      const normalPolicy = createMockPolicy(DifficultyMode.Normal);
      const normalBids = generateCompetitorBids(
        normalSeed,
        normalValuation,
        normalPolicy,
      );

      // Hard 모드
      const hardSeed = createMockPropertySeed(DifficultyMode.Hard);
      const hardValuation = createMockValuation(minBid);
      const hardPolicy = createMockPolicy(DifficultyMode.Hard);
      const hardBids = generateCompetitorBids(
        hardSeed,
        hardValuation,
        hardPolicy,
      );

      // 각 난이도별 최고 입찰가 비교
      const easyMax = Math.max(...easyBids);
      const normalMax = Math.max(...normalBids);
      const hardMax = Math.max(...hardBids);

      // Hard 모드가 가장 높은 범위를 가져야 함 (일반적으로)
      // 하지만 시드에 따라 다를 수 있으므로 범위 자체를 확인
      const easyRange = Math.max(...easyBids) - Math.min(...easyBids);
      const normalRange = Math.max(...normalBids) - Math.min(...normalBids);
      const hardRange = Math.max(...hardBids) - Math.min(...hardBids);

      // Hard 모드의 범위가 가장 넓어야 함
      expect(hardRange).toBeGreaterThanOrEqual(normalRange);
      expect(normalRange).toBeGreaterThanOrEqual(easyRange);
    });

    it("난이도별 승/패 확률 차이를 통계적으로 검증해야 함", () => {
      const testCases = 100; // 테스트 케이스 수
      const userBid = 120_000_000; // 고정 입찰가

      // Easy 모드 승리 횟수
      let easyWins = 0;
      for (let i = 0; i < testCases; i++) {
        const easySeed = createMockPropertySeed(DifficultyMode.Easy, {
          address: `서울시 강남구 테스트동 Easy ${i}`,
        });
        const easyResult = createMockAuctionAnalysisResult(
          DifficultyMode.Easy,
          100_000_000,
        );
        const easyPolicy = createMockPolicy(DifficultyMode.Easy);

        const outcome = determineOutcome(
          easyResult,
          userBid,
          easySeed,
          easyPolicy,
        );
        if (outcome === "win") easyWins++;
      }

      // Hard 모드 승리 횟수
      let hardWins = 0;
      for (let i = 0; i < testCases; i++) {
        const hardSeed = createMockPropertySeed(DifficultyMode.Hard, {
          address: `서울시 강남구 테스트동 Hard ${i}`,
        });
        const hardResult = createMockAuctionAnalysisResult(
          DifficultyMode.Hard,
          100_000_000,
        );
        const hardPolicy = createMockPolicy(DifficultyMode.Hard);

        const outcome = determineOutcome(
          hardResult,
          userBid,
          hardSeed,
          hardPolicy,
        );
        if (outcome === "win") hardWins++;
      }

      // Easy 모드가 Hard 모드보다 승리 확률이 높아야 함
      // (경쟁자 수가 적고 범위가 좁으므로)
      expect(easyWins).toBeGreaterThan(hardWins);
    });
  });

  describe("시드 기반 일관성 통합 검증", () => {
    it("같은 시드로 여러 번 실행 시 동일한 경쟁자 입찰가와 결과를 반환해야 함", () => {
      const seed = createMockPropertySeed(DifficultyMode.Normal);
      const result = createMockAuctionAnalysisResult(
        DifficultyMode.Normal,
        100_000_000,
      );
      const policy = createMockPolicy(DifficultyMode.Normal);

      // 첫 번째 실행
      const competitorBids1 = generateCompetitorBids(
        seed,
        result.valuation,
        policy,
      );
      const userBid = Math.max(...competitorBids1) + 1_000_000;
      const outcome1 = determineOutcome(result, userBid, seed, policy);

      // 두 번째 실행 (같은 시드)
      const competitorBids2 = generateCompetitorBids(
        seed,
        result.valuation,
        policy,
      );
      const outcome2 = determineOutcome(result, userBid, seed, policy);

      // 세 번째 실행 (같은 시드)
      const competitorBids3 = generateCompetitorBids(
        seed,
        result.valuation,
        policy,
      );
      const outcome3 = determineOutcome(result, userBid, seed, policy);

      // 모든 결과가 동일해야 함
      expect(competitorBids1).toEqual(competitorBids2);
      expect(competitorBids2).toEqual(competitorBids3);
      expect(outcome1).toBe(outcome2);
      expect(outcome2).toBe(outcome3);
    });
  });
});


