/**
 * @file simulation-flow.spec.ts
 * @description 시뮬레이션 생성 플로우 E2E 테스트
 *
 * 주요 테스트 대상:
 * 1. Dashboard에서 시뮬레이션 생성
 * 2. 난이도별 시뮬레이션 생성 (Easy/Normal/Hard)
 * 3. Usage 제한 확인 (일 5회 제한)
 *
 * 핵심 구현 로직:
 * - Playwright를 사용한 브라우저 자동화 테스트
 * - Clerk storageState를 사용한 인증 상태 관리
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
  cleanupSimulations,
  getTestUserId,
} from "../fixtures/test-helpers";
import { DifficultyMode } from "@/lib/types";

// Clerk 인증 상태 사용 (storageState)
test.use({ storageState: "./tests/fixtures/auth.json" });

test.describe("시뮬레이션 생성 플로우", () => {
  const createdSimulationIds: string[] = [];

  // 각 테스트 후 DB 정리
  test.afterEach(async () => {
    const userId = getTestUserId();
    if (createdSimulationIds.length > 0) {
      await cleanupSimulations(userId, createdSimulationIds);
      createdSimulationIds.length = 0; // 배열 초기화
    }
  });

  test("Dashboard에서 시뮬레이션 생성 시 상세 페이지로 이동해야 함", async ({
    page,
  }) => {
    await test.step("Dashboard 접근", async () => {
      await page.goto("/dashboard");
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(/\/dashboard/);
    });

    await test.step("난이도 선택 버튼 클릭", async () => {
      const difficultyButton = page.getByRole("button", {
        name: "난이도 선택",
      });
      await expect(difficultyButton).toBeVisible();
      await difficultyButton.click();
      await page.waitForTimeout(500); // 애니메이션 대기
    });

    await test.step("Normal 난이도 선택", async () => {
      const normalButton = page.getByRole("button", {
        name: /Normal/i,
      });
      await expect(normalButton).toBeVisible();
      await normalButton.click();
    });

    await test.step("시뮬레이션 생성 버튼 클릭", async () => {
      const createButton = page.getByRole("button", {
        name: "새로운 시뮬레이션 생성",
      });
      await expect(createButton).toBeEnabled();
      await createButton.click();
    });

    await test.step("상세 페이지로 이동 확인", async () => {
      await page.waitForURL(/\/simulations\/[^/]+$/, { timeout: 30000 });
      const url = page.url();
      expect(url).toMatch(/\/simulations\/[^/]+$/);

      // 시뮬레이션 ID 추출 및 저장
      const match = url.match(/\/simulations\/([^/]+)$/);
      if (match && match[1]) {
        createdSimulationIds.push(match[1]);
      }
    });

    await test.step("시뮬레이션 상세 페이지 데이터 표시 확인", async () => {
      // Property 정보 표시 확인
      const addressElement = page.getByText(/서울|경기|부산|인천/i);
      await expect(addressElement.first()).toBeVisible({ timeout: 10000 });

      // 난이도 배지 표시 확인
      const difficultyBadge = page.getByText(/Easy|Normal|Hard/i);
      await expect(difficultyBadge.first()).toBeVisible();
    });
  });

  test("Easy 모드 시뮬레이션 생성이 정상적으로 작동해야 함", async ({
    page,
  }) => {
    const simulationId = await createSimulation(page, DifficultyMode.Easy);
    createdSimulationIds.push(simulationId);

    await expect(page).toHaveURL(new RegExp(`/simulations/${simulationId}$`));

    // Easy 모드 배지 확인
    const easyBadge = page.getByText(/Easy|튜토리얼/i);
    await expect(easyBadge.first()).toBeVisible();
  });

  test("Normal 모드 시뮬레이션 생성이 정상적으로 작동해야 함", async ({
    page,
  }) => {
    const simulationId = await createSimulation(page, DifficultyMode.Normal);
    createdSimulationIds.push(simulationId);

    await expect(page).toHaveURL(new RegExp(`/simulations/${simulationId}$`));

    // Normal 모드 배지 확인
    const normalBadge = page.getByText(/Normal|일반/i);
    await expect(normalBadge.first()).toBeVisible();
  });

  test("Hard 모드 시뮬레이션 생성이 정상적으로 작동해야 함", async ({
    page,
  }) => {
    const simulationId = await createSimulation(page, DifficultyMode.Hard);
    createdSimulationIds.push(simulationId);

    await expect(page).toHaveURL(new RegExp(`/simulations/${simulationId}$`));

    // Hard 모드 배지 확인
    const hardBadge = page.getByText(/Hard|고화|챌린지/i);
    await expect(hardBadge.first()).toBeVisible();
  });

  test("Usage Indicator가 올바르게 표시되어야 함", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    // Usage Indicator 확인
    const usageText = page.getByText(/사용량|남은 횟수|일일 제한/i);
    await expect(usageText.first()).toBeVisible();
  });
});

