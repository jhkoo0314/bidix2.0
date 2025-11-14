/**
 * @file BidForm.tsx
 * @description 입찰가 입력 및 제출 폼 (Client Component)
 *
 * 주요 기능:
 * 1. 입찰가 입력 (BidAmountInput 컴포넌트 사용)
 * 2. submitBidAction 호출 (FormData 기반)
 * 3. 로딩 상태 관리
 * 4. 에러 처리 및 표시
 * 5. 성공 시 결과 페이지로 리다이렉트
 *
 * 핵심 구현 로직:
 * - Client Component ("use client")
 * - useState를 통한 로딩 상태 관리
 * - FormData 생성 및 submitBidAction 호출
 * - useRouter를 통한 리다이렉트
 * - 브랜드 톤 에러 메시지 적용
 *
 * 브랜드 통합:
 * - 브랜드 톤 에러 메시지: 단호하지만 따뜻하게
 * - 사용자를 평가하지 않는 메시지
 * - 실패를 허용하는 톤
 *
 * @dependencies
 * - react: useState (상태 관리)
 * - next/navigation: useRouter (리다이렉트)
 * - @/components/bid/BidAmountInput: 입찰가 입력 컴포넌트
 * - @/app/action/submitbid: submitBidAction
 * - @/components/ui/alert: 에러 메시지 표시
 *
 * @see {@link /docs/ui/component-spec.md} - BidAmountInput Props 명세
 * @see {@link /docs/engine/api-contracts.md} - submitBidAction 명세
 * @see {@link /docs/product/prdv2.md} - 브랜드 보이스 가이드
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BidAmountInput } from "@/components/bid/BidAmountInput";
import { submitBidAction } from "@/app/action/submitbid";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SectionCard } from "@/components/common/SectionCard";

export interface BidFormProps {
  simulationId: string;
  minBid: number;
}

export function BidForm({ simulationId, minBid }: BidFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (bidAmount: number) => {
    console.group("Bid Submission");
    console.log("입찰 제출 시작:", { simulationId, bidAmount });

    setIsLoading(true);
    setError("");

    try {
      // FormData 생성
      const formData = new FormData();
      formData.append("simulationId", simulationId);
      formData.append("bidAmount", bidAmount.toString());

      console.log("FormData 생성 완료:", {
        simulationId,
        bidAmount,
      });

      // submitBidAction 호출
      console.log("submitBidAction 호출 중...");
      const result = await submitBidAction(formData);

      console.log("submitBidAction 결과:", result);

      if (!result.ok) {
        const errorMessage =
          result.error || "입찰 처리 중 오류가 발생했습니다.";
        console.error("입찰 제출 실패:", errorMessage);
        setError(errorMessage);
        setIsLoading(false);
        console.groupEnd();
        return;
      }

      console.log("입찰 제출 성공, 결과 페이지로 리다이렉트");
      console.groupEnd();

      // 성공 시 결과 페이지로 리다이렉트
      router.push(`/simulations/${simulationId}/result`);
    } catch (err) {
      console.error("예상치 못한 에러:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "입찰 처리 중 예상치 못한 오류가 발생했습니다.";
      setError(errorMessage);
      setIsLoading(false);
      console.groupEnd();
    }
  };

  return (
    <SectionCard title="입찰가 입력">
      <div className="space-y-4">
        {/* 에러 메시지 */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* BidAmountInput */}
        <BidAmountInput
          minBid={minBid}
          onSubmit={handleSubmit}
          disabled={isLoading}
        />

        {/* 로딩 상태 안내 */}
        {isLoading && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            입찰을 처리하고 있습니다...
          </p>
        )}
      </div>
    </SectionCard>
  );
}

