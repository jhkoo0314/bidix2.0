/**
 * @file CreateSimulationButton.tsx
 * @description 시뮬레이션 생성 버튼 컴포넌트 (Client Component)
 *
 * 주요 기능:
 * 1. 난이도 선택 드롭다운 (Easy/Normal/Hard)
 * 2. 사용량 체크 (5회 초과 시 비활성화)
 * 3. Server Action 호출: generateSimulationAction
 * 4. 로딩 상태 표시
 * 5. 생성 성공 시 /simulations/[id]로 리다이렉트
 * 6. 에러 처리 (사용량 초과, 네트워크 에러 등)
 *
 * 핵심 구현 로직:
 * - useState로 로딩, 에러, 난이도 선택 상태 관리
 * - Server Action 호출: generateSimulationAction(difficulty)
 * - useRouter로 리다이렉트
 * - 사용량 체크: usageUsed >= usageLimit 시 비활성화
 *
 * 브랜드 통합:
 * - 브랜드 보이스: 에러 메시지는 따뜻하고 격려하는 톤
 * - 사용량 초과 메시지: "오늘의 사용량을 모두 사용하셨습니다. 내일 다시 시도해주세요."
 * - Design System v2.2: Button 컴포넌트 사용, 브랜드 Accent Colors 적용
 *
 * @dependencies
 * - react: useState
 * - next/navigation: useRouter
 * - @/app/action/generatesimulation: generateSimulationAction
 * - @/components/ui/button: shadcn 버튼 컴포넌트
 * - @/components/ui/alert: shadcn Alert 컴포넌트 (에러 표시용)
 *
 * @see {@link /docs/product/user-flow.md} - 시뮬레이션 생성 플로우
 * @see {@link /docs/engine/api-contracts.md} - generateSimulationAction 명세
 * @see {@link /docs/product/brand-story.md} - 브랜드 보이스 가이드
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateSimulationAction } from "@/app/action/generatesimulation";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DifficultyMode } from "@/lib/types";
import { AlertCircle } from "lucide-react";

export interface CreateSimulationButtonProps {
  usageLimit: number;
  usageUsed: number;
}

const DIFFICULTY_OPTIONS: {
  value: DifficultyMode;
  label: string;
  description: string;
}[] = [
  { value: DifficultyMode.Easy, label: "Easy", description: "튜토리얼" },
  { value: DifficultyMode.Normal, label: "Normal", description: "일반 연습" },
  { value: DifficultyMode.Hard, label: "Hard", description: "고화 챌린지" },
];

export function CreateSimulationButton({
  usageLimit,
  usageUsed,
}: CreateSimulationButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyMode>(DifficultyMode.Normal);
  const [showDifficultySelect, setShowDifficultySelect] = useState(false);

  const isExceeded = usageUsed >= usageLimit;

  const handleCreateSimulation = async () => {
    console.group("Create Simulation");
    console.log("난이도 선택:", selectedDifficulty);
    console.log("사용량:", usageUsed, "/", usageLimit);

    if (isExceeded) {
      console.log("사용량 초과: 시뮬레이션 생성 불가");
      setError("오늘의 사용량을 모두 사용하셨습니다. 내일 다시 시도해주세요.");
      console.groupEnd();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Server Action 호출 시작");
      const result = await generateSimulationAction(selectedDifficulty);

      if (!result.ok) {
        console.error("시뮬레이션 생성 실패:", result.error);
        setError(result.error || "시뮬레이션 생성 중 문제가 발생했습니다.");
        setIsLoading(false);
        console.groupEnd();
        return;
      }

      console.log("시뮬레이션 생성 성공:", result.data.simulationId);
      console.log(
        "리다이렉트 시작:",
        `/simulations/${result.data.simulationId}`,
      );

      // 리다이렉트
      router.push(`/simulations/${result.data.simulationId}`);
      console.groupEnd();
    } catch (err) {
      console.error("예상치 못한 에러:", err);
      setError(
        err instanceof Error
          ? err.message
          : "시뮬레이션 생성 중 문제가 발생했습니다.",
      );
      setIsLoading(false);
      console.groupEnd();
    }
  };

  return (
    <div className="space-y-4">
      {showDifficultySelect && !isExceeded && (
        <div className="p-4 border rounded-lg bg-muted/50 space-y-3">
          <label className="text-sm font-medium">난이도 선택</label>
          <div className="flex gap-2 flex-wrap">
            {DIFFICULTY_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedDifficulty(option.value)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedDifficulty === option.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border hover:bg-muted"
                }`}
              >
                {option.label}
                <span className="ml-1 text-xs opacity-75">
                  ({option.description})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        {!showDifficultySelect && !isExceeded && (
          <Button
            onClick={() => setShowDifficultySelect(true)}
            variant="outline"
            disabled={isLoading}
          >
            난이도 선택
          </Button>
        )}
        <Button
          onClick={handleCreateSimulation}
          size="lg"
          disabled={isLoading || isExceeded}
          className="flex-1"
        >
          {isLoading
            ? "생성 중..."
            : isExceeded
            ? "일일 사용량 초과"
            : "새로운 시뮬레이션 생성"}
        </Button>
      </div>

      {isExceeded && (
        <p className="text-sm text-muted-foreground text-center">
          오늘의 사용량을 모두 사용하셨습니다. 내일 다시 시도해주세요.
        </p>
      )}
    </div>
  );
}
