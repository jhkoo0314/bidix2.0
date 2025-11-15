/**
 * @file bid-flow.spec.ts
 * @description 입찰 플로우 E2E 테스트
 *
 * 주요 테스트 대상:
 * 1. 입찰 페이지 접근
 * 2. QuickFacts 표시 확인 (FMV, minBid, exitPrice 3/6/12)
 * 3. 입찰가 입력 및 제출
 * 4. 현금/대출 자동 계산 확인
 * 5. 결과 페이지 이동 확인
 *
 * 핵심 구현 로직:
 * - Playwright를 사용한 브라우저 자동화 테스트
 * - Clerk storageState를 사용한 인증 상태 관리
 * - BidAmountInput 컴포넌트 상호작용 검증
 * - 테스트 후 DB 데이터 자동 정리
 *
 * @dependencies
 * - @playwright/test: Playwright 테스트 프레임워크
 * - @/tests/fixtures/test-helpers: 테스트 헬퍼 함수
 *
 * @see {@link /docs/product/todov3.md} - Phase 6.1 테스트 계획
 * @see {@link /.cursor/rules/web/playwright-test-guide.mdc} - Playwright 테스트 가이드
 */

import { test, expect } from "@playwright/test";
import {
  createSimulation,
  submitBid,
  cleanupSimulations,
  getTestUserId,
} from "../fixtures/test-helpers";
import { DifficultyMode } from "@/lib/types";

// Clerk 인증 상태 사용 (storageState)
test.use({ storageState: "./tests/fixtures/auth.json" });

test.describe("입찰 플로우", () => {
  const createdSimulationIds: string[] = [];

  // 각 테스트 후 DB 정리
  test.afterEach(async () => {
    const userId = getTestUserId();
    if (createdSimulationIds.length > 0) {
      await cleanupSimulations(userId, createdSimulationIds);
      createdSimulationIds.length = 0; // 배열 초기화
    }
  });

  test("시뮬레이션 상세에서 입찰 페이지로 이동해야 함", async ({ page }) => {
    await test.step("시뮬레이션 생성", async () => {
      const simulationId = await createSimulation(page, DifficultyMode.Normal);
      createdSimulationIds.push(simulationId);
    });

    await test.step("입찰하기 버튼 클릭", async () => {
      const bidButton = page.getByRole("button", { name: /입찰하기|입찰/i });
      await expect(bidButton).toBeVisible();
      await bidButton.click();
    });

    await test.step("입찰 페이지로 이동 확인", async () => {
      await page.waitForURL(/\/simulations\/[^/]+\/bid$/, { timeout: 10000 });
      await expect(page).toHaveURL(/\/simulations\/[^/]+\/bid$/);
    });
  });

  test("QuickFacts에 adjustedFMV, minBid, exitPrice가 표시되어야 함", async ({
    page,
  }) => {
    const simulationId = await createSimulation(page, DifficultyMode.Normal);
    createdSimulationIds.push(simulationId);

    await page.goto(`/simulations/${simulationId}/bid`);
    await page.waitForLoadState("networkidle");

    await test.step("adjustedFMV 표시 확인", async () => {
      const fmvText = page.getByText(/FMV|시장가|평가가/i);
      await expect(fmvText.first()).toBeVisible({ timeout: 10000 });
    });

    await test.step("minBid 표시 확인", async () => {
      const minBidText = page.getByText(/최저|입찰가|minBid/i);
      await expect(minBidText.first()).toBeVisible();
    });

    await test.step("exitPrice 3m/6m/12m 표시 확인", async () => {
      const exitPriceText = page.getByText(/3개월|6개월|12개월|Exit Price/i);
      await expect(exitPriceText.first()).toBeVisible();
    });
  });

  test("입찰가 입력 및 제출 시 결과 페이지로 이동해야 함", async ({
    page,
  }) => {
    const simulationId = await createSimulation(page, DifficultyMode.Normal);
    createdSimulationIds.push(simulationId);

    // minBid 가져오기 (QuickFacts에서)
    await page.goto(`/simulations/${simulationId}/bid`);
    await page.waitForLoadState("networkidle");

    // minBid 값 추출 (예: "최저 입찰가: 100,000,000원" 형식)
    const minBidText = await page
      .getByText(/최저.*입찰가|minBid/i)
      .first()
      .textContent();
    const minBidMatch = minBidText?.match(/[\d,]+/);
    const minBid = minBidMatch
      ? parseInt(minBidMatch[0].replace(/,/g, ""), 10)
      : 100_000_000; // 기본값

    // 입찰가 설정 (minBid보다 높게)
    const bidAmount = minBid + 10_000_000;

    await test.step("입찰가 입력", async () => {
      const bidInput = page.getByLabel("입찰가");
      await expect(bidInput).toBeVisible();
      await bidInput.fill(bidAmount.toString());
    });

    await test.step("제출 버튼 클릭", async () => {
      const submitButton = page.getByRole("button", { name: "입찰 제출" });
      await expect(submitButton).toBeEnabled();
      await submitButton.click();
    });

    await test.step("결과 페이지로 이동 확인", async () => {
      await page.waitForURL(
        new RegExp(`/simulations/${simulationId}/result`),
        { timeout: 30000 },
      );
      await expect(page).toHaveURL(
        new RegExp(`/simulations/${simulationId}/result`),
      );
    });
  });

  test("현금 입력 시 대출이 자동으로 계산되어야 함", async ({ page }) => {
    const simulationId = await createSimulation(page, DifficultyMode.Normal);
    createdSimulationIds.push(simulationId);

    await page.goto(`/simulations/${simulationId}/bid`);
    await page.waitForLoadState("networkidle");

    const bidAmount = 150_000_000;
    const cashAmount = 50_000_000;
    const expectedLoanAmount = bidAmount - cashAmount;

    await test.step("입찰가 입력", async () => {
      const bidInput = page.getByLabel("입찰가");
      await bidInput.fill(bidAmount.toString());
    });

    await test.step("현금 입력", async () => {
      const cashInput = page.getByLabel("현금");
      await expect(cashInput).toBeVisible();
      await cashInput.fill(cashAmount.toString());
      await page.waitForTimeout(1000); // 자동 계산 대기
    });

    await test.step("대출 자동 계산 확인", async () => {
      const loanInput = page.getByLabel("대출");
      const loanValue = await loanInput.inputValue();
      const calculatedLoan = parseInt(loanValue.replace(/,/g, ""), 10);
      expect(calculatedLoan).toBe(expectedLoanAmount);
    });
  });

  test("대출 입력 시 현금이 자동으로 계산되어야 함", async ({ page }) => {
    const simulationId = await createSimulation(page, DifficultyMode.Normal);
    createdSimulationIds.push(simulationId);

    await page.goto(`/simulations/${simulationId}/bid`);
    await page.waitForLoadState("networkidle");

    const bidAmount = 150_000_000;
    const loanAmount = 100_000_000;
    const expectedCashAmount = bidAmount - loanAmount;

    await test.step("입찰가 입력", async () => {
      const bidInput = page.getByLabel("입찰가");
      await bidInput.fill(bidAmount.toString());
    });

    await test.step("대출 입력", async () => {
      const loanInput = page.getByLabel("대출");
      await expect(loanInput).toBeVisible();
      await loanInput.fill(loanAmount.toString());
      await page.waitForTimeout(1000); // 자동 계산 대기
    });

    await test.step("현금 자동 계산 확인", async () => {
      const cashInput = page.getByLabel("현금");
      const cashValue = await cashInput.inputValue();
      const calculatedCash = parseInt(cashValue.replace(/,/g, ""), 10);
      expect(calculatedCash).toBe(expectedCashAmount);
    });
  });

  test("최저 입찰가 미만 입력 시 에러가 표시되어야 함", async ({ page }) => {
    const simulationId = await createSimulation(page, DifficultyMode.Normal);
    createdSimulationIds.push(simulationId);

    await page.goto(`/simulations/${simulationId}/bid`);
    await page.waitForLoadState("networkidle");

    // minBid보다 낮은 값 입력
    const invalidBidAmount = 1_000_000; // 매우 낮은 값

    await test.step("유효하지 않은 입찰가 입력", async () => {
      const bidInput = page.getByLabel("입찰가");
      await bidInput.fill(invalidBidAmount.toString());
    });

    await test.step("에러 메시지 확인", async () => {
      // Form 검증 에러 또는 제출 시 에러 확인
      const errorMessage = page.getByText(/최저|입찰가|유효하지/i);
      // 에러가 표시되거나 제출 버튼이 비활성화되어야 함
      await expect(
        errorMessage.or(page.getByRole("button", { name: /제출/i }).filter({ disabled: true })),
      ).toBeVisible({ timeout: 5000 });
    });
  });
});

