/**
 * @file ErrorState.tsx
 * @description 에러 상태 컴포넌트
 *
 * 주요 기능:
 * 1. 에러 발생 시 사용자에게 친화적인 메시지 표시
 * 2. 재시도 옵션 제공 (선택적)
 *
 * 핵심 구현 로직:
 * - 에러 메시지와 선택적 재시도 버튼 표시
 * - Design System v2.2 원칙 준수
 * - brand-story.md의 브랜드 보이스 반영 (격려하되 과장하지 않음)
 *
 * @dependencies
 * - @/components/ui/button: shadcn 버튼 컴포넌트
 *
 * @see {@link /docs/ui/design-system.md} - 에러 처리 가이드
 * @see {@link /docs/product/brand-story.md} - 브랜드 보이스 가이드
 */

import { Button } from "@/components/ui/button";

export interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message,
  onRetry,
}: ErrorStateProps) {
  // 브랜드 보이스에 맞는 기본 메시지
  const defaultMessage =
    message ||
    "문제가 발생했습니다. 괜찮습니다. 다시 시도해 주세요.";

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
        {defaultMessage}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          다시 시도
        </Button>
      )}
    </div>
  );
}

