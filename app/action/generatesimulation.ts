// src/app/actions/generateSimulation.ts
// BIDIX AI - Generate Simulation Action
// Version: 2.2
// Last Updated: 2025-11-14

"use server";

import { auth } from "@clerk/nextjs";
import { simulationService } from "@/lib/services/simulationservice";
import { DifficultyMode } from "@/lib/types";

/**
 * [Server Action] 시뮬레이션 생성 (입찰 전 단계)
 * - 난이도 선택 → v2.2 Generator → v2.2 AuctionEngine
 * - 생성된 시뮬레이션의 ID + 초기 분석 데이터를 반환
 * - UI는 simulationId를 사용하여 상세 페이지로 이동
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
