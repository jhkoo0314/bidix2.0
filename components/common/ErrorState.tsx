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
 * - 브랜드 보이스 반영: 단호하지만 따뜻하게, 사용자 평가 금지
 *
 * 브랜드 통합:
 * - Design System v2.2: Error State 규칙 준수
 * - 브랜드 보이스: 격려하되 과장하지 않음, 사용자를 평가하지 않음
 * - 메시지 톤: "이 결과는 당신의 학습을 위한 데이터입니다." 스타일
 * - 브랜드 Accent Color 적용
 *
 * @dependencies
 * - @/components/ui/button: shadcn 버튼 컴포넌트
 * - lucide-react: AlertCircle 아이콘
 *
 * @see {@link /docs/ui/design-system.md} - 에러 처리 가이드 및 인터랙션 규칙
 * @see {@link /docs/product/brand-story.md} - 브랜드 보이스 가이드
 */

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message,
  onRetry,
}: ErrorStateProps) {
  // 브랜드 보이스에 맞는 기본 메시지
  // 원칙: 단호하지만 따뜻하게, 사용자를 평가하지 않음
  const defaultMessage =
    message ||
    "이 결과는 당신의 학습을 위한 데이터입니다. 문제가 발생했지만 괜찮습니다.";

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center" role="alert" aria-live="polite">
      <AlertCircle className="w-12 h-12 text-[hsl(var(--accent-amber))] mb-4" aria-hidden="true" />
      <p className="text-lg text-muted-foreground mb-4 font-[var(--font-noto-sans-kr)]">
        {defaultMessage}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="brand-hover">
          다시 시도
        </Button>
      )}
    </div>
  );
}

