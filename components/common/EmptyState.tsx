/**
 * @file EmptyState.tsx
 * @description 빈 상태 컴포넌트
 *
 * 주요 기능:
 * 1. 데이터가 없을 때 사용자에게 안내 메시지 표시
 * 2. CTA 버튼 제공 (선택적)
 *
 * 핵심 구현 로직:
 * - 메시지와 선택적 액션 버튼 표시
 * - Design System v2.2 원칙 준수
 *
 * @dependencies
 * - @/components/ui/button: shadcn 버튼 컴포넌트
 *
 * @see {@link /docs/ui/design-system.md} - 빈 상태 처리 가이드
 */

import { Button } from "@/components/ui/button";

export interface EmptyStateProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
        {message}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}

