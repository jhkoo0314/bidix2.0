// src/app/actions/submitbid.ts
// BIDIX AI - Submit Bid Action (v2.2)
// Version: 2.2
// Last Updated: 2025-11-14

"use server";

import { simulationService } from "@/lib/services/simulationservice";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@clerk/nextjs";

/**
 * Zod 스키마 (v2.2)
 * - simulationId: UUID
 * - bidAmount: 양수
 */
const BidFormSchema = z.object({
  simulationId: z.string().uuid("유효한 시뮬레이션 ID가 필요합니다."),
  bidAmount: z
    .number({ invalid_type_error: "입찰가는 숫자여야 합니다." })
    .positive("입찰가는 0보다 커야 합니다."),
});

/**
 * submitbid.ts (v2.2)
 * ---------------------------------------
 * - 사용자가 입찰 제출 시 호출되는 Server Action
 * - simulationService.submitBid() → v2.2 엔진 실행
 * - DB 업데이트 + 결과 반환
 */
export async function submitBidAction(formData: FormData) {
  try {
    /* ----------------------------------------------------
     * [1] Clerk Authentication
     * ---------------------------------------------------- */
    const { userId } = auth();
    if (!userId) {
      return { ok: false, error: "사용자 인증이 필요합니다." };
    }

    /* ----------------------------------------------------
     * [2] FormData → Raw Object 변환
     * ---------------------------------------------------- */
    const rawData = {
      simulationId: formData.get("simulationId"),
      bidAmount: Number(formData.get("bidAmount")),
    };

    /* ----------------------------------------------------
     * [3] Zod Validation (v2.2)
     * ---------------------------------------------------- */
    const parsed = BidFormSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        ok: false,
        error: "입력값이 유효하지 않습니다.",
        errorDetails: parsed.error.flatten().fieldErrors,
      };
    }

    const { simulationId, bidAmount } = parsed.data;

    /* ----------------------------------------------------
     * [4] Domain Logic — v2.2 Core (Service Layer)
     * ---------------------------------------------------- */
    const finalResult = await simulationService.submitBid(
      simulationId,
      userId,
      bidAmount
    );

    /* ----------------------------------------------------
     * [5] Page Cache Revalidation
     * ---------------------------------------------------- */
    revalidatePath("/dashboard");
    revalidatePath("/history");
    revalidatePath(`/result/${simulationId}`); // 결과 상세 페이지 갱신

    /* ----------------------------------------------------
     * [6] 최종 성공 결과 반환
     * ---------------------------------------------------- */
    return {
      ok: true,
      data: finalResult,
    };
  } catch (err) {
    console.error("[submitBidAction ERROR]:", err);

    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "입찰 처리 중 오류가 발생했습니다.",
    };
  }
}
