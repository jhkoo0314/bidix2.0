/**
 * @file savehistory.ts
 * @description 히스토리 저장 Server Action
 *
 * 주요 기능:
 * 1. 사용자가 완료한 시뮬레이션을 히스토리에 저장
 * 2. simulations 테이블의 pinned 필드를 true로 업데이트
 * 3. 입찰 완료된 시뮬레이션만 저장 가능 (pending 상태 제외)
 *
 * 핵심 구현 로직:
 * - Clerk 인증 확인
 * - Zod를 통한 simulationId UUID 검증
 * - simulationService.saveHistory() 호출
 * - 에러 처리 및 로깅
 *
 * 브랜드 통합:
 * - Design System v2.2 준수
 * - 브랜드 보이스: 따뜻하고 격려하는 톤
 *
 * @dependencies
 * - @clerk/nextjs/server: auth() 인증 확인
 * - @/lib/services/simulationservice: saveHistory 함수
 * - zod: 입력값 검증
 *
 * @see {@link /docs/engine/api-contracts.md} - API 명세
 * @see {@link /docs/product/todov3.md} - Phase 4.2 요구사항
 */

"use server";

import { auth } from "@clerk/nextjs/server";
import { simulationService } from "@/lib/services/simulationservice";
import { z } from "zod";

/**
 * Zod 스키마 (simulationId UUID 검증)
 */
const SaveHistorySchema = z.object({
  simulationId: z.string().uuid("유효한 시뮬레이션 ID가 필요합니다."),
});

/**
 * saveHistoryAction (v2.2)
 * ---------------------------------------
 * - 사용자가 결과 페이지에서 "히스토리 저장" 버튼 클릭 시 호출
 * - simulationService.saveHistory() → DB 업데이트 (pinned = true)
 * - 입찰 완료된 시뮬레이션만 저장 가능
 */
export async function saveHistoryAction(simulationId: string) {
  console.group("saveHistoryAction");
  console.log("히스토리 저장 요청:", simulationId);

  try {
    /* ----------------------------------------------------
     * [1] Clerk Authentication
     * ---------------------------------------------------- */
    const { userId } = await auth();
    if (!userId) {
      console.log("인증 실패: userId 없음");
      console.groupEnd();
      return {
        ok: false,
        error: "로그인이 필요합니다.",
      };
    }

    console.log("인증 성공:", userId);

    /* ----------------------------------------------------
     * [2] Zod Validation
     * ---------------------------------------------------- */
    const parsed = SaveHistorySchema.safeParse({ simulationId });
    if (!parsed.success) {
      console.log("검증 실패:", parsed.error.flatten().fieldErrors);
      console.groupEnd();
      return {
        ok: false,
        error: "입력값이 유효하지 않습니다.",
        errorDetails: parsed.error.flatten().fieldErrors,
      };
    }

    const { simulationId: validatedId } = parsed.data;
    console.log("검증 성공:", validatedId);

    /* ----------------------------------------------------
     * [3] Domain Logic — v2.2 Core (Service Layer)
     * ---------------------------------------------------- */
    await simulationService.saveHistory(validatedId, userId);

    console.log("히스토리 저장 성공");
    console.groupEnd();

    /* ----------------------------------------------------
     * [4] 최종 성공 결과 반환
     * ---------------------------------------------------- */
    return {
      ok: true,
    };
  } catch (err) {
    console.error("[saveHistoryAction ERROR]:", err);
    console.groupEnd();

    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "히스토리 저장 중 오류가 발생했습니다.",
    };
  }
}

