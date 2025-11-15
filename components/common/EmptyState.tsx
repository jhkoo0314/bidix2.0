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
 * - 브랜드 보이스 반영: 격려하되 과장하지 않음
 *
 * 브랜드 통합:
 * - Design System v2.2: Empty State 규칙 준수
 * - 브랜드 보이스: 격려하되 과장하지 않음, 사용자를 평가하지 않음
 * - 메시지 톤 예시: "아직 데이터가 없습니다. 이것은 당신의 첫 경험이 될 것입니다."
 * - 브랜드 메시지 스타일 적용
 *
 * @dependencies
 * - @/components/ui/button: shadcn 버튼 컴포넌트
 * - lucide-react: Inbox 아이콘
 *
 * @see {@link /docs/ui/design-system.md} - 빈 상태 처리 가이드 및 인터랙션 규칙
 * @see {@link /docs/product/brand-story.md} - 브랜드 보이스 가이드
 */

import { Button } from "@/components/ui/button";
import { Inbox } from "lucide-react";

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
      <Inbox className="w-12 h-12 text-[hsl(var(--accent-blue))] mb-4 opacity-60" />
      <p className="text-lg text-muted-foreground mb-4 font-[var(--font-noto-sans-kr)] brand-message">
        {message}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="brand-hover">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

