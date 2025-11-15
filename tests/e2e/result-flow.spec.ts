/**
 * @file result-flow.spec.ts
 * @description 결과 확인 플로우 E2E 테스트
 *
 * 주요 테스트 대상:
 * 1. 결과 페이지 데이터 확인 (BidOutcomeBlock, MetricsStrip, ExitScenarioTable)
 * 2. 모든 섹션 헤더 확인
 * 3. Premium 잠금 UI 확인
 * 4. 브랜드 메시지 확인
 *
 * 핵심 구현 로직:
 * - Playwright를 사용한 브라우저 자동화 테스트
 * - Clerk storageState를 사용한 인증 상태 관리
 * - JSON Schema 기반 데이터 구조 검증
 * - 테스트 후 DB 데이터 자동 정리
 *
 * @dependencies
 * - @playwright/test: Playwright 테스트 프레임워크
 * - @/tests/fixtures/test-helpers: 테스트 헬퍼 함수
 *
 * @see {@link /docs/product/todov3.md} - Phase 6.1 테스트 계획
 * @see {@link /docs/engine/json-schema.md} - AuctionAnalysisResult 구조
 * @see {@link /.cursor/rules/web/playwright-test-guide.mdc} - Playwright 테스트 가이드
 */

import { test, expect } from "@playwright/test";
import {
  createSimulation,
  submitBid,
  cleanupSimulations,
  getTestUserId,
  verifyResultPageData,
} from "../fixtures/test-helpers";
import { DifficultyMode } from "@/lib/types";

// Clerk 인증 상태 사용 (storageState)
test.use({ storageState: "./tests/fixtures/auth.json" });

test.describe("결과 확인 플로우", () => {
  const createdSimulationIds: string[] = [];

  // 각 테스트 후 DB 정리
  test.afterEach(async () => {
    const userId = getTestUserId();
    if (createdSimulationIds.length > 0) {
      await cleanupSimulations(userId, createdSimulationIds);
      createdSimulationIds.length = 0; // 배열 초기화
    }
  });

  test("결과 페이지에 필수 데이터가 표시되어야 함", async ({ page }) => {
    const simulationId = await createSimulation(page, DifficultyMode.Normal);
    createdSimulationIds.push(simulationId);

    // minBid 가져오기
    await page.goto(`/simulations/${simulationId}/bid`);
    await page.waitForLoadState("networkidle");
    const minBidText = await page
      .getByText(/최저.*입찰가|minBid/i)
      .first()
      .textContent();
    const minBidMatch = minBidText?.match(/[\d,]+/);
    const minBid = minBidMatch
      ? parseInt(minBidMatch[0].replace(/,/g, ""), 10)
      : 100_000_000;
    const bidAmount = minBid + 10_000_000;

    // 입찰 제출
    await submitBid(page, simulationId, bidAmount);
    await page.waitForLoadState("networkidle");

    await test.step("BidOutcomeBlock 표시 확인", async () => {
      const outcomeText = page.getByText(/입찰|성공|실패|근접/i);
      await expect(outcomeText.first()).toBeVisible({ timeout: 10000 });
    });

    await test.step("MetricsStrip 표시 확인", async () => {
      const metricsText = page.getByText(/안전마진|ROI|점수|주요 지표/i);
      await expect(metricsText.first()).toBeVisible();
    });

    await test.step("ExitScenarioTable 표시 확인", async () => {
      const scenarioText = page.getByText(/보유기간별|3개월|6개월|12개월/i);
      await expect(scenarioText.first()).toBeVisible();
    });

    await test.step("등급 표시 확인", async () => {
      const gradeText = page.getByText(/S|A|B|C|D|등급/i);
      await expect(gradeText.first()).toBeVisible();
    });
  });

  test("모든 섹션 헤더가 올바르게 표시되어야 함", async ({ page }) => {
    const simulationId = await createSimulation(page, DifficultyMode.Normal);
    createdSimulationIds.push(simulationId);

    // minBid 가져오기 및 입찰 제출
    await page.goto(`/simulations/${simulationId}/bid`);
    await page.waitForLoadState("networkidle");
    const minBidText = await page
      .getByText(/최저.*입찰가|minBid/i)
      .first()
      .textContent();
    const minBidMatch = minBidText?.match(/[\d,]+/);
    const minBid = minBidMatch
      ? parseInt(minBidMatch[0].replace(/,/g, ""), 10)
      : 100_000_000;
    const bidAmount = minBid + 10_000_000;

    await submitBid(page, simulationId, bidAmount);
    await page.waitForLoadState("networkidle");

    await test.step("입찰 결과 섹션 확인", async () => {
      const resultHeader = page.getByRole("heading", {
        name: /입찰 결과|결과/i,
      });
      await expect(resultHeader.first()).toBeVisible();
    });

    await test.step("주요 지표 섹션 확인", async () => {
      const metricsHeader = page.getByText(/주요 지표/i);
      await expect(metricsHeader.first()).toBeVisible();
    });

    await test.step("보유기간별 수익 시나리오 섹션 확인", async () => {
      const scenarioHeader = page.getByText(/보유기간별|수익 시나리오/i);
      await expect(scenarioHeader.first()).toBeVisible();
    });
  });

  test("Premium 잠금 UI가 올바르게 표시되어야 함", async ({ page }) => {
    const simulationId = await createSimulation(page, DifficultyMode.Normal);
    createdSimulationIds.push(simulationId);

    // minBid 가져오기 및 입찰 제출
    await page.goto(`/simulations/${simulationId}/bid`);
    await page.waitForLoadState("networkidle");
    const minBidText = await page
      .getByText(/최저.*입찰가|minBid/i)
      .first()
      .textContent();
    const minBidMatch = minBidText?.match(/[\d,]+/);
    const minBid = minBidMatch
      ? parseInt(minBidMatch[0].replace(/,/g, ""), 10)
      : 100_000_000;
    const bidAmount = minBid + 10_000_000;

    await submitBid(page, simulationId, bidAmount);
    await page.waitForLoadState("networkidle");

    await test.step("권리 분석 리포트 잠금 UI 확인", async () => {
      const rightsLock = page.getByText(/권리 분석|🔒/i);
      await expect(rightsLock.first()).toBeVisible({ timeout: 10000 });
    });

    await test.step("수익 분석 리포트 잠금 UI 확인", async () => {
      const profitLock = page.getByText(/수익 분석|🔒/i);
      await expect(profitLock.first()).toBeVisible();
    });

    await test.step("경매 분석 리포트 잠금 UI 확인", async () => {
      const auctionLock = page.getByText(/경매 분석|🔒/i);
      await expect(auctionLock.first()).toBeVisible();
    });

    await test.step("매각물건명세서 해설판 확인", async () => {
      const saleStatement = page.getByText(/매각물건명세서|해설판/i);
      await expect(saleStatement.first()).toBeVisible();
    });
  });

  test("브랜드 메시지가 올바르게 표시되어야 함", async ({ page }) => {
    const simulationId = await createSimulation(page, DifficultyMode.Normal);
    createdSimulationIds.push(simulationId);

    // minBid보다 낮은 입찰가로 제출 (실패 시나리오)
    await page.goto(`/simulations/${simulationId}/bid`);
    await page.waitForLoadState("networkidle");
    const minBidText = await page
      .getByText(/최저.*입찰가|minBid/i)
      .first()
      .textContent();
    const minBidMatch = minBidText?.match(/[\d,]+/);
    const minBid = minBidMatch
      ? parseInt(minBidMatch[0].replace(/,/g, ""), 10)
      : 100_000_000;
    const bidAmount = minBid - 10_000_000; // minBid보다 낮게

    await submitBid(page, simulationId, bidAmount);
    await page.waitForLoadState("networkidle");

    await test.step("브랜드 메시지 확인", async () => {
      const brandMessage = page.getByText(/실패는 비용이 아니라|자산입니다/i);
      await expect(brandMessage.first()).toBeVisible({ timeout: 10000 });
    });
  });

  test("데이터 검증 헬퍼 함수가 정상 작동해야 함", async ({ page }) => {
    const simulationId = await createSimulation(page, DifficultyMode.Normal);
    createdSimulationIds.push(simulationId);

    // minBid 가져오기 및 입찰 제출
    await page.goto(`/simulations/${simulationId}/bid`);
    await page.waitForLoadState("networkidle");
    const minBidText = await page
      .getByText(/최저.*입찰가|minBid/i)
      .first()
      .textContent();
    const minBidMatch = minBidText?.match(/[\d,]+/);
    const minBid = minBidMatch
      ? parseInt(minBidMatch[0].replace(/,/g, ""), 10)
      : 100_000_000;
    const bidAmount = minBid + 10_000_000;

    await submitBid(page, simulationId, bidAmount);
    await page.waitForLoadState("networkidle");

    // 데이터 검증 헬퍼 함수 사용
    await verifyResultPageData(page);
  });
});

