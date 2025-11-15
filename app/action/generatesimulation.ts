/**
 * @file generatesimulation.ts
 * @description 시뮬레이션 생성 Server Action
 *
 * 주요 기능:
 * 1. 사용자가 선택한 난이도로 시뮬레이션 생성
 * 2. v2.2 Generator를 통한 시나리오 생성
 * 3. v2.2 AuctionEngine을 통한 초기 분석 실행
 * 4. 생성된 시뮬레이션 ID 및 초기 결과 반환
 *
 * 핵심 구현 로직:
 * - Server Action으로 구현 ("use server")
 * - Clerk 인증 확인 (auth())
 * - simulationService.create() 호출
 * - 난이도별 Policy 적용 (Easy/Normal/Hard)
 * - 에러 처리 및 로깅
 *
 * 브랜드 통합:
 * - Design System v2.2 준수
 * - 브랜드 보이스: 따뜻하고 격려하는 톤
 *
 * @dependencies
 * - @clerk/nextjs/server: auth() 인증 확인
 * - @/lib/services/simulationservice: create 함수
 * - @/lib/types: DifficultyMode 타입
 *
 * @see {@link /docs/engine/api-contracts.md} - API 명세
 * @see {@link /docs/product/todov3.md} - Phase 4.1 요구사항
 */

"use server";

import { auth } from "@clerk/nextjs/server";
import { simulationService } from "@/lib/services/simulationservice";
import { DifficultyMode } from "@/lib/types";

/**
 * generateSimulationAction (v2.2)
 * ---------------------------------------
 * 시뮬레이션 생성 Server Action
 *
 * @param difficulty - 난이도 모드 (Easy/Normal/Hard)
 * @returns 시뮬레이션 ID 및 초기 분석 결과
 *
 * @example
 * ```typescript
 * const result = await generateSimulationAction(DifficultyMode.Normal);
 * if (result.ok) {
 *   router.push(`/simulations/${result.data.simulationId}`);
 * }
 * ```
 */
export async function generateSimulationAction(difficulty: DifficultyMode) {
  try {
    /* ----------------------------------------------------
     * 1. Authentication (Clerk) — 사용자 인증 필수
     * ---------------------------------------------------- */
    const { userId } = await auth();
    if (!userId) {
      return {
        ok: false,
        error: "로그인이 필요합니다.",
      };
    }

    /* ----------------------------------------------------
     * 2. Simulation 생성 — v2.2 시나리오 + 초기 엔진 분석
     * ---------------------------------------------------- */
    const { simulationId, initialResult } = await simulationService.create(
      userId,
      difficulty
    );

    /* ----------------------------------------------------
     * 3. UI에서 사용할 결과 구조
     * ---------------------------------------------------- */
    return {
      ok: true,
      data: {
        simulationId,     // 시뮬레이션 상세 페이지 이동 시 사용
        initialResult,    // 목록 또는 카드 UI에서 바로 활용 가능
      },
    };
  } catch (err) {
    console.error("[generateSimulationAction ERROR]:", err);

    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "시뮬레이션 생성 중 문제가 발생했습니다.",
    };
  }
}
