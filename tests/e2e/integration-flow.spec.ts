/**
 * @file integration-flow.spec.ts
 * @description 통합 플로우 E2E 테스트
 *
 * 주요 테스트 대상:
 * 1. 시뮬레이션 생성 → 입찰 제출 → 결과 확인 전체 플로우
 * 2. 각 단계별 데이터 일관성 확인
 * 3. DB 저장 데이터 검증
 *
 * 핵심 구현 로직:
 * - Playwright를 사용한 브라우저 자동화 테스트
 * - Clerk storageState를 사용한 인증 상태 관리
 * - 전체 사용자 플로우 검증
 * - 테스트 후 DB 데이터 자동 정리
 *
 * @dependencies
 * - @playwright/test: Playwright 테스트 프레임워크
 * - @/tests/fixtures/test-helpers: 테스트 헬퍼 함수
 *
 * @see {@link /docs/product/todov3.md} - Phase 6.1 테스트 계획
 * @see {@link /docs/product/user-flow.md} - 사용자 플로우 차트
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

test.describe("통합 플로우 테스트", () => {
  const createdSimulationIds: string[] = [];

  // 각 테스트 후 DB 정리
  test.afterEach(async () => {
    const userId = getTestUserId();
    if (createdSimulationIds.length > 0) {
      await cleanupSimulations(userId, createdSimulationIds);
      createdSimulationIds.length = 0; // 배열 초기화
    }
  });

  test("시뮬레이션 생성 → 입찰 제출 → 결과 확인 전체 플로우가 정상 작동해야 함", async ({
    page,
  }) => {
    await test.step("1. 시뮬레이션 생성", async () => {
      const simulationId = await createSimulation(page, DifficultyMode.Normal);
      createdSimulationIds.push(simulationId);
      await expect(page).toHaveURL(
        new RegExp(`/simulations/${simulationId}$`),
      );
    });

    await test.step("2. 입찰 페이지 접근", async () => {
      const bidButton = page.getByRole("button", { name: /입찰하기|입찰/i });
      await expect(bidButton).toBeVisible();
      await bidButton.click();
      await page.waitForURL(/\/simulations\/[^/]+\/bid$/, { timeout: 10000 });
    });

    await test.step("3. 입찰가 입력 및 제출", async () => {
      // minBid 가져오기
      const minBidText = await page
        .getByText(/최저.*입찰가|minBid/i)
        .first()
        .textContent();
      const minBidMatch = minBidText?.match(/[\d,]+/);
      const minBid = minBidMatch
        ? parseInt(minBidMatch[0].replace(/,/g, ""), 10)
        : 100_000_000;
      const bidAmount = minBid + 10_000_000;

      // 입찰가 입력
      const bidInput = page.getByLabel("입찰가");
      await bidInput.fill(bidAmount.toString());

      // 제출
      const submitButton = page.getByRole("button", { name: "입찰 제출" });
      await submitButton.click();
    });

    await test.step("4. 결과 페이지 이동 확인", async () => {
      const simulationId = createdSimulationIds[0];
      await page.waitForURL(
        new RegExp(`/simulations/${simulationId}/result`),
        { timeout: 30000 },
      );
      await expect(page).toHaveURL(
        new RegExp(`/simulations/${simulationId}/result`),
      );
    });

    await test.step("5. 결과 페이지 데이터 확인", async () => {
      await verifyResultPageData(page);
    });
  });

  test("난이도별 전체 플로우가 정상 작동해야 함", async ({ page }) => {
    const difficulties = [
      DifficultyMode.Easy,
      DifficultyMode.Normal,
      DifficultyMode.Hard,
    ];

    for (const difficulty of difficulties) {
      await test.step(`${difficulty} 모드 전체 플로우`, async () => {
        // 시뮬레이션 생성
        const simulationId = await createSimulation(page, difficulty);
        createdSimulationIds.push(simulationId);

        // 입찰 페이지 접근
        await page.goto(`/simulations/${simulationId}/bid`);
        await page.waitForLoadState("networkidle");

        // minBid 가져오기
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

        // 결과 페이지 확인
        await expect(page).toHaveURL(
          new RegExp(`/simulations/${simulationId}/result`),
        );
      });
    }
  });
});

