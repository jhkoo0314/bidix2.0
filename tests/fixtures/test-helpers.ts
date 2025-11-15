/**
 * @file test-helpers.ts
 * @description E2E 테스트 헬퍼 함수 모음
 *
 * 주요 기능:
 * 1. 시뮬레이션 생성 헬퍼
 * 2. 입찰 제출 헬퍼
 * 3. 데이터 검증 헬퍼
 * 4. DB 정리 헬퍼 (각 테스트 후 자동 정리)
 *
 * 핵심 구현 로직:
 * - Supabase Service Role 클라이언트 사용 (RLS 우회)
 * - 테스트 데이터 생성 및 삭제
 * - 시뮬레이션 ID 추출 및 검증
 * - 사용자 ID 기반 데이터 정리
 *
 * @dependencies
 * - @playwright/test: Page 타입
 * - @/lib/supabase/service-role: getServiceRoleClient
 * - @/lib/types: DifficultyMode
 *
 * @see {@link /docs/product/todov3.md} - Phase 6.1 테스트 계획
 */

import { Page } from "@playwright/test";
import { getServiceRoleClient } from "@/lib/supabase/service-role";
import { DifficultyMode } from "@/lib/types";

/**
 * 시뮬레이션 생성 헬퍼
 * Dashboard에서 시뮬레이션을 생성하고 상세 페이지로 이동
 *
 * @param page Playwright Page 객체
 * @param difficulty 난이도 (Easy/Normal/Hard)
 * @returns 생성된 시뮬레이션 ID
 */
export async function createSimulation(
  page: Page,
  difficulty: DifficultyMode = DifficultyMode.Normal,
): Promise<string> {
  console.group("Test Helper: Create Simulation");
  console.log("난이도:", difficulty);

  // 1. Dashboard 접근
  await page.goto("/dashboard");
  await page.waitForLoadState("networkidle");

  // 2. 난이도 선택 버튼 클릭
  await page.getByRole("button", { name: "난이도 선택" }).click();
  await page.waitForTimeout(500); // 애니메이션 대기

  // 3. 난이도 선택
  const difficultyLabels: Record<DifficultyMode, string> = {
    [DifficultyMode.Easy]: "Easy",
    [DifficultyMode.Normal]: "Normal",
    [DifficultyMode.Hard]: "Hard",
  };
  await page
    .getByRole("button", { name: new RegExp(difficultyLabels[difficulty]) })
    .click();

  // 4. 시뮬레이션 생성 버튼 클릭
  await page.getByRole("button", { name: "새로운 시뮬레이션 생성" }).click();

  // 5. 상세 페이지로 이동 대기
  await page.waitForURL(/\/simulations\/[^/]+$/, { timeout: 30000 });

  // 6. URL에서 시뮬레이션 ID 추출
  const url = page.url();
  const match = url.match(/\/simulations\/([^/]+)$/);
  if (!match || !match[1]) {
    throw new Error("시뮬레이션 ID를 추출할 수 없습니다.");
  }

  const simulationId = match[1];
  console.log("시뮬레이션 ID:", simulationId);
  console.groupEnd();

  return simulationId;
}

/**
 * 입찰 제출 헬퍼
 * 입찰 페이지에서 입찰가를 입력하고 제출
 *
 * @param page Playwright Page 객체
 * @param simulationId 시뮬레이션 ID
 * @param bidAmount 입찰가
 * @param cashAmount 현금 (선택적)
 * @param loanAmount 대출 (선택적)
 */
export async function submitBid(
  page: Page,
  simulationId: string,
  bidAmount: number,
  cashAmount?: number,
  loanAmount?: number,
): Promise<void> {
  console.group("Test Helper: Submit Bid");
  console.log("시뮬레이션 ID:", simulationId);
  console.log("입찰가:", bidAmount);
  console.log("현금:", cashAmount);
  console.log("대출:", loanAmount);

  // 1. 입찰 페이지 접근
  await page.goto(`/simulations/${simulationId}/bid`);
  await page.waitForLoadState("networkidle");

    // 2. 입찰가 입력
    const bidInput = page.getByLabel("입찰가");
    await bidInput.fill(bidAmount.toString());

    // 3. 현금/대출 입력 (제공된 경우)
    if (cashAmount !== undefined) {
      const cashInput = page.getByLabel("현금");
      await cashInput.fill(cashAmount.toString());
      // 대출 자동 계산 대기
      await page.waitForTimeout(1000);
    }

    if (loanAmount !== undefined) {
      const loanInput = page.getByLabel("대출");
      await loanInput.fill(loanAmount.toString());
      // 현금 자동 계산 대기
      await page.waitForTimeout(1000);
    }

    // 4. 제출 버튼 클릭
    await page.getByRole("button", { name: "입찰 제출" }).click();

  // 5. 결과 페이지로 이동 대기
  await page.waitForURL(
    new RegExp(`/simulations/${simulationId}/result`),
    { timeout: 30000 },
  );

  console.log("입찰 제출 완료");
  console.groupEnd();
}

/**
 * DB 정리 헬퍼
 * 테스트 중 생성된 시뮬레이션 데이터를 삭제
 *
 * @param userId 사용자 ID (Clerk user ID)
 * @param simulationIds 삭제할 시뮬레이션 ID 배열
 */
export async function cleanupSimulations(
  userId: string,
  simulationIds: string[],
): Promise<void> {
  console.group("Test Helper: Cleanup Simulations");
  console.log("사용자 ID:", userId);
  console.log("삭제할 시뮬레이션 수:", simulationIds.length);

  if (simulationIds.length === 0) {
    console.log("삭제할 시뮬레이션이 없습니다.");
    console.groupEnd();
    return;
  }

  try {
    const supabase = getServiceRoleClient();

    // 시뮬레이션 삭제
    const { error } = await supabase
      .from("simulations")
      .delete()
      .in("id", simulationIds)
      .eq("user_id", userId);

    if (error) {
      console.error("시뮬레이션 삭제 에러:", error);
      throw error;
    }

    console.log("시뮬레이션 삭제 완료:", simulationIds.length, "개");
  } catch (err) {
    console.error("DB 정리 중 에러:", err);
    // 에러가 발생해도 테스트는 계속 진행
  }

  console.groupEnd();
}

/**
 * 사용자 ID 추출 헬퍼
 * Clerk 인증 상태에서 사용자 ID를 추출
 * (테스트 환경에서는 storageState에서 추출하거나 환경 변수 사용)
 *
 * @returns 사용자 ID (Clerk user ID)
 */
export function getTestUserId(): string {
  // 환경 변수에서 테스트 사용자 ID 가져오기
  const testUserId = process.env.TEST_USER_ID;
  if (!testUserId) {
    throw new Error(
      "TEST_USER_ID 환경 변수가 설정되지 않았습니다. 테스트용 Clerk 사용자 ID를 설정하세요.",
    );
  }
  return testUserId;
}

/**
 * 데이터 검증 헬퍼
 * 결과 페이지의 필수 데이터가 올바르게 표시되는지 확인
 *
 * @param page Playwright Page 객체
 */
export async function verifyResultPageData(page: Page): Promise<void> {
  console.group("Test Helper: Verify Result Page Data");

  // 1. 입찰 결과 섹션 확인
  await page.waitForSelector('text="입찰 결과"', { timeout: 10000 });
  console.log("✅ 입찰 결과 섹션 확인");

  // 2. 주요 지표 섹션 확인
  const metricsSection = page.getByText(/주요 지표|안전마진|ROI|점수/i);
  await metricsSection.first().waitFor({ state: "visible", timeout: 10000 });
  console.log("✅ 주요 지표 섹션 확인");

  // 3. 보유기간별 수익 시나리오 테이블 확인
  const scenarioTable = page.getByText(/보유기간별|3개월|6개월|12개월/i);
  await scenarioTable.first().waitFor({ state: "visible", timeout: 10000 });
  console.log("✅ 보유기간별 수익 시나리오 테이블 확인");

  console.groupEnd();
}

