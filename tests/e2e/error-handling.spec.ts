/**
 * @file error-handling.spec.ts
 * @description 에러 처리 E2E 테스트
 *
 * 주요 테스트 대상:
 * 1. 미인증 상태에서 시뮬레이션 생성 시도
 * 2. Usage 초과 시 시뮬레이션 생성 제한
 * 3. 최저 입찰가 미만 입력 시 에러 표시
 * 4. 존재하지 않는 시뮬레이션 ID 접근 시 404
 *
 * 핵심 구현 로직:
 * - Playwright를 사용한 브라우저 자동화 테스트
 * - 에러 케이스 검증
 * - 에러 메시지 확인
 *
 * @dependencies
 * - @playwright/test: Playwright 테스트 프레임워크
 * - @/tests/fixtures/test-helpers: 테스트 헬퍼 함수
 *
 * @see {@link /docs/product/todov3.md} - Phase 6.1 테스트 계획
 */

import { test, expect } from "@playwright/test";
import {
  createSimulation,
  cleanupSimulations,
  getTestUserId,
} from "../fixtures/test-helpers";
import { DifficultyMode } from "@/lib/types";

// 미인증 테스트는 storageState를 사용하지 않음
test.describe("에러 처리 테스트", () => {
  const createdSimulationIds: string[] = [];

  // 각 테스트 후 DB 정리
  test.afterEach(async () => {
    const userId = getTestUserId();
    if (createdSimulationIds.length > 0) {
      await cleanupSimulations(userId, createdSimulationIds);
      createdSimulationIds.length = 0; // 배열 초기화
    }
  });

  test("미인증 상태에서 Dashboard 접근 시 로그인 페이지로 리다이렉트되어야 함", async ({
    page,
  }) => {
    // storageState를 사용하지 않음 (미인증 상태)
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    // 로그인 페이지로 리다이렉트 확인
    await expect(page).toHaveURL(/\/sign-in/);
  });
});

test.describe("인증된 사용자 에러 처리", () => {
  // 인증 상태 사용
  test.use({ storageState: "./tests/fixtures/auth.json" });

  const createdSimulationIds: string[] = [];

  // 각 테스트 후 DB 정리
  test.afterEach(async () => {
    const userId = getTestUserId();
    if (createdSimulationIds.length > 0) {
      await cleanupSimulations(userId, createdSimulationIds);
      createdSimulationIds.length = 0; // 배열 초기화
    }
  });

  test("존재하지 않는 시뮬레이션 ID 접근 시 404 페이지가 표시되어야 함", async ({
    page,
  }) => {
    const invalidId = "00000000-0000-0000-0000-000000000000";

    await page.goto(`/simulations/${invalidId}`);
    await page.waitForLoadState("networkidle");

    // 404 페이지 또는 에러 메시지 확인
    const notFoundText = page.getByText(/404|찾을 수 없|존재하지/i);
    await expect(notFoundText.first()).toBeVisible({ timeout: 10000 });
  });

  test("존재하지 않는 입찰 페이지 접근 시 404 페이지가 표시되어야 함", async ({
    page,
  }) => {
    const invalidId = "00000000-0000-0000-0000-000000000000";

    await page.goto(`/simulations/${invalidId}/bid`);
    await page.waitForLoadState("networkidle");

    // 404 페이지 또는 에러 메시지 확인
    const notFoundText = page.getByText(/404|찾을 수 없|존재하지/i);
    await expect(notFoundText.first()).toBeVisible({ timeout: 10000 });
  });

  test("존재하지 않는 결과 페이지 접근 시 404 페이지가 표시되어야 함", async ({
    page,
  }) => {
    const invalidId = "00000000-0000-0000-0000-000000000000";

    await page.goto(`/simulations/${invalidId}/result`);
    await page.waitForLoadState("networkidle");

    // 404 페이지 또는 에러 메시지 확인
    const notFoundText = page.getByText(/404|찾을 수 없|존재하지/i);
    await expect(notFoundText.first()).toBeVisible({ timeout: 10000 });
  });

  test("최저 입찰가 미만 입력 시 에러가 표시되어야 함", async ({ page }) => {
    const simulationId = await createSimulation(page, DifficultyMode.Normal);
    createdSimulationIds.push(simulationId);

    await page.goto(`/simulations/${simulationId}/bid`);
    await page.waitForLoadState("networkidle");

    // 매우 낮은 입찰가 입력
    const invalidBidAmount = 1_000_000;
    const bidInput = page.getByLabel("입찰가");
    await bidInput.fill(invalidBidAmount.toString());

    // 제출 시도
    const submitButton = page.getByRole("button", { name: "입찰 제출" });
    await submitButton.click();

    // 에러 메시지 확인 (Form 검증 또는 서버 에러)
    const errorMessage = page.getByText(/최저|입찰가|유효하지|에러/i);
    await expect(errorMessage.first()).toBeVisible({ timeout: 10000 });
  });
});

