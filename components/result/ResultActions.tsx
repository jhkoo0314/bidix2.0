/**
 * @file ResultActions.tsx
 * @description 결과 페이지 액션 컴포넌트
 *
 * 주요 기능:
 * 1. 히스토리 저장 버튼
 * 2. 다음 연습 버튼
 *
 * 핵심 구현 로직:
 * - saveHistoryAction 호출 (TODO)
 * - Dashboard로 리다이렉트
 *
 * @dependencies
 * - @/components/ui/button: shadcn 버튼 컴포넌트
 * - next/link: 내비게이션
 *
 * @see {@link /docs/ui/component-spec.md} - ResultActions Props 명세
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";

export interface ResultActionsProps {
  simulationId: string;
  isSaved?: boolean;
}

export function ResultActions({
  simulationId,
  isSaved = false,
}: ResultActionsProps) {
  const handleSaveHistory = async () => {
    // TODO: saveHistoryAction 호출
    console.log("히스토리 저장:", simulationId);
  };

  return (
    <div className="flex gap-4">
      <Button
        variant="outline"
        onClick={handleSaveHistory}
        disabled={isSaved}
      >
        {isSaved ? "저장됨" : "히스토리 저장"}
      </Button>
      <Link href="/dashboard">
        <Button>다음 연습</Button>
      </Link>
    </div>
  );
}

