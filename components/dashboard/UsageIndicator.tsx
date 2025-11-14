/**
 * @file UsageIndicator.tsx
 * @description 사용량 표시 컴포넌트
 *
 * 주요 기능:
 * 1. 일일 사용량 표시 (used / limit)
 * 2. 프로그레스바 형태
 * 3. 남은 횟수 강조
 * 4. 5회 초과 시 메시지 표시
 *
 * 핵심 구현 로직:
 * - 사용량과 제한을 받아 프로그레스바 표시
 * - prdv2.md의 Freemium 전략 반영 (일 5회 제한)
 * - 브랜드 통합 디자인 시스템 v2.2 적용
 *
 * 브랜드 통합:
 * - Design System v2.2: 브랜드 Accent Colors 사용
 *   - Amber: 경고/학습 시그널 (80% 이상)
 *   - Blue: Financial clarity 핵심 (일반 상태)
 * - 브랜드 보이스: 따뜻하고 격려하는 톤, 사용자를 평가하지 않음
 * - Layout Rules: SectionCard 사용하여 일관된 카드 스타일
 *
 * @dependencies
 * - @/components/common/SectionCard: 섹션 카드
 * - tailwindcss: 브랜드 Accent Colors
 *
 * @see {@link /docs/product/prdv2.md} - Freemium 전략 (일 5회 제한)
 * @see {@link /docs/product/brand-story.md} - 브랜드 보이스 가이드
 * @see {@link /docs/ui/design-system.md} - 브랜드 Accent Colors 사용 규칙
 */

import { SectionCard } from "@/components/common/SectionCard";

export interface UsageIndicatorProps {
  used: number;
  limit: number;
}

export function UsageIndicator({ used, limit }: UsageIndicatorProps) {
  const remaining = limit - used;
  const percentage = (used / limit) * 100;
  const isExceeded = used >= limit;
  const isWarning = percentage >= 80 && !isExceeded;

  // 브랜드 Accent Colors 사용
  const getProgressBarColor = () => {
    if (isExceeded) {
      return "bg-red-500";
    }
    if (isWarning) {
      // 브랜드 Accent Amber (경고/학습 시그널)
      return "bg-[hsl(var(--accent-amber))]";
    }
    // 브랜드 Accent Blue (Financial clarity 핵심)
    return "bg-[hsl(var(--accent-blue))]";
  };

  return (
    <SectionCard title="일일 사용량">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            오늘 사용한 횟수
          </span>
          <span
            className={`text-sm font-medium numeric-highlight ${
              isExceeded
                ? "text-red-600 dark:text-red-400"
                : isWarning
                ? "text-[hsl(var(--accent-amber))]"
                : "text-[hsl(var(--accent-blue))]"
            }`}
          >
            {used} / {limit}회
          </span>
        </div>

        <div className="w-full bg-muted rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${getProgressBarColor()}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>

        {isExceeded ? (
          <p className="text-sm text-muted-foreground">
            오늘의 사용량을 모두 사용하셨습니다. 내일 다시 시도해주세요.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            남은 횟수: <span className="font-semibold numeric-highlight">{remaining}회</span>
          </p>
        )}
      </div>
    </SectionCard>
  );
}

