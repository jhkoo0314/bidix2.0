/**
 * @file ResultActions.tsx
 * @description 결과 페이지 액션 컴포넌트 (Client Component)
 *
 * 주요 기능:
 * 1. 히스토리 저장 버튼 - saveHistoryAction 호출
 * 2. 다음 연습 버튼 - Dashboard로 리다이렉트
 *
 * 핵심 구현 로직:
 * - Client Component로 구현 ("use client")
 * - useState를 통한 로딩/에러 상태 관리
 * - saveHistoryAction 호출 (Server Action)
 * - 저장 성공/실패 피드백
 * - 브랜드 보이스 가이드 준수
 *
 * 브랜드 통합:
 * - 버튼 스타일 통일
 * - 에러 메시지 브랜드 톤 적용
 * - Layout Rules 준수 (반응형 레이아웃)
 *
 * @dependencies
 * - react: useState (상태 관리)
 * - @/components/ui/button: shadcn 버튼 컴포넌트
 * - next/navigation: useRouter (리다이렉트)
 * - @/app/action/savehistory: saveHistoryAction (Server Action)
 *
 * @see {@link /docs/ui/component-spec.md} - ResultActions Props 명세 (v2.2)
 * @see {@link /docs/engine/api-contracts.md} - saveHistoryAction 명세
 * @see {@link /docs/product/todov3.md} - Result Page 요구사항
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export interface ResultActionsProps {
  simulationId: string;
  isSaved?: boolean;
}

export function ResultActions({
  simulationId,
  isSaved = false,
}: ResultActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [saved, setSaved] = useState(isSaved);

  const handleSaveHistory = async () => {
    console.group("ResultActions - Save History");
    console.log("Simulation ID:", simulationId);
    console.log("Current saved status:", saved);

    setIsLoading(true);
    setError("");

    try {
      // TODO: saveHistoryAction 구현 후 연결
      // import { saveHistoryAction } from "@/app/action/savehistory";
      // const result = await saveHistoryAction(simulationId);
      
      // 임시 구현 (실제 Server Action 연결 필요)
      const response = await fetch("/api/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ simulationId }),
      });

      if (!response.ok) {
        throw new Error("히스토리 저장에 실패했습니다.");
      }

      console.log("History saved successfully");
      setSaved(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "히스토리 저장 중 오류가 발생했습니다.";
      console.error("Save history error:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      console.groupEnd();
    }
  };

  const handleNextPractice = () => {
    console.log("Navigate to dashboard for next practice");
    router.push("/dashboard");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="outline"
          onClick={handleSaveHistory}
          disabled={saved || isLoading}
          className="flex-1"
        >
          {isLoading
            ? "저장 중..."
            : saved
            ? "✅ 저장됨"
            : "히스토리 저장"}
        </Button>
        <Button onClick={handleNextPractice} className="flex-1">
          다음 연습
        </Button>
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

