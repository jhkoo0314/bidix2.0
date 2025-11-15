/**
 * @file submitbid.ts
 * @description 입찰 제출 Server Action
 *
 * 주요 기능:
 * 1. 사용자 입찰가 및 자금 구성 제출 처리
 * 2. Zod를 통한 입력값 검증 (simulationId, bidAmount, cashAmount, loanAmount)
 * 3. simulationService.submitBid() 호출하여 엔진 재실행
 * 4. DB 업데이트 및 결과 반환
 * 5. 페이지 캐시 재검증 (revalidatePath)
 *
 * 핵심 구현 로직:
 * - Server Action으로 구현 ("use server")
 * - Clerk 인증 확인 (auth())
 * - FormData → Raw Object 변환
 * - Zod 스키마 검증 (BidFormSchema)
 * - 현금 + 대출 = 입찰가 검증
 * - simulationService.submitBid() 호출
 * - 결과 페이지 캐시 재검증
 *
 * 브랜드 통합:
 * - Design System v2.2 준수
 * - 브랜드 보이스: 따뜻하고 격려하는 톤
 *
 * @dependencies
 * - @clerk/nextjs/server: auth() 인증 확인
 * - @/lib/services/simulationservice: submitBid 함수
 * - zod: 입력값 검증
 * - next/cache: revalidatePath
 *
 * @see {@link /docs/engine/api-contracts.md} - API 명세
 * @see {@link /docs/product/todov3.md} - Phase 4.2 요구사항
 */

"use server";

import { simulationService } from "@/lib/services/simulationservice";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";

/**
 * Zod 스키마 (v2.2)
 * - simulationId: UUID
 * - bidAmount: 양수
 * - cashAmount: 현금 (optional)
 * - loanAmount: 대출 (optional)
 * - 검증 규칙: 현금 + 대출 = 입찰가 (둘 다 입력한 경우)
 */
const BidFormSchema = z.object({
  simulationId: z.string().uuid("유효한 시뮬레이션 ID가 필요합니다."),
  bidAmount: z
    .number({ invalid_type_error: "입찰가는 숫자여야 합니다." })
    .positive("입찰가는 0보다 커야 합니다."),
  cashAmount: z.number().min(0).optional(),
  loanAmount: z.number().min(0).optional(),
}).refine(
  (data) => {
    // 둘 다 입력했으면 합이 입찰가와 일치해야 함
    if (data.cashAmount !== undefined && data.loanAmount !== undefined) {
      return data.cashAmount + data.loanAmount === data.bidAmount;
    }
    // 둘 다 비어있으면 정책 기본값 사용 (허용)
    if (data.cashAmount === undefined && data.loanAmount === undefined) {
      return true;
    }
    // 하나만 입력하면 에러
    return false;
  },
  { 
    message: "현금과 대출을 모두 입력하거나 모두 비워두세요." 
  }
);

/**
 * submitBidAction (v2.2)
 * ---------------------------------------
 * 입찰 제출 Server Action
 *
 * @param formData - FormData 객체 (simulationId, bidAmount, cashAmount, loanAmount)
 * @returns 입찰 결과 데이터
 *
 * @example
 * ```typescript
 * const formData = new FormData();
 * formData.append("simulationId", simulationId);
 * formData.append("bidAmount", "50000000");
 * const result = await submitBidAction(formData);
 * if (result.ok) {
 *   router.push(`/simulations/${simulationId}/result`);
 * }
 * ```
 */
export async function submitBidAction(formData: FormData) {
  try {
    /* ----------------------------------------------------
     * [1] Clerk Authentication
     * ---------------------------------------------------- */
    const { userId } = await auth();
    if (!userId) {
      return { ok: false, error: "로그인이 필요합니다." };
    }

    /* ----------------------------------------------------
     * [2] FormData → Raw Object 변환
     * ---------------------------------------------------- */
    const rawData = {
      simulationId: formData.get("simulationId"),
      bidAmount: Number(formData.get("bidAmount")),
      cashAmount: formData.get("cashAmount") ? Number(formData.get("cashAmount")) : undefined,
      loanAmount: formData.get("loanAmount") ? Number(formData.get("loanAmount")) : undefined,
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

    const { simulationId, bidAmount, cashAmount, loanAmount } = parsed.data;

    /* ----------------------------------------------------
     * [4] Domain Logic — v2.2 Core (Service Layer)
     * ---------------------------------------------------- */
    const finalResult = await simulationService.submitBid(
      simulationId,
      userId,
      bidAmount,
      cashAmount,
      loanAmount
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
