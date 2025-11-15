/**
 * @file QuickStats.tsx
 * @description 대시보드 빠른 통계 컴포넌트
 *
 * 주요 기능:
 * 1. 레벨, 총 점수, 총 시뮬레이션 수 표시
 * 2. 3개 카드 레이아웃
 *
 * 핵심 구현 로직:
 * - Point & Level System 공식 사용
 * - 티어 계산 및 표시
 * - 브랜드 통합 디자인 시스템 v2.2 적용
 *
 * 브랜드 통합:
 * - Design System v2.2: Numeric Highlight 스타일 적용 (점수)
 * - 브랜드 Accent Colors: Badge 컴포넌트로 티어 표시
 * - Layout Rules: SectionCard 사용하여 일관된 카드 스타일
 *
 * @dependencies
 * - @/components/common/SectionCard: 섹션 카드
 * - @/components/common/Badge: 티어 배지
 *
 * @see {@link /docs/product/point-level-system.md} - 점수/레벨/티어 계산 로직
 * @see {@link /docs/ui/design-system.md} - Numeric Highlight 규칙 및 브랜드 Accent Colors
 */

import { memo } from "react";
import { SectionCard } from "@/components/common/SectionCard";
import { Badge } from "@/components/common/Badge";

export interface QuickStatsProps {
  level: number;
  totalScore: number;
  simulationCount: number;
}

function getTier(level: number): string {
  if (level >= 41) return "Diamond";
  if (level >= 31) return "Platinum";
  if (level >= 21) return "Gold";
  if (level >= 11) return "Silver";
  return "Bronze";
}

export const QuickStats = memo(function QuickStats({
  level,
  totalScore,
  simulationCount,
}: QuickStatsProps) {
  const tier = getTier(level);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 레벨 카드 */}
      <SectionCard>
        <div className="space-y-2">
          <h3 className="text-sm text-muted-foreground font-[var(--font-noto-sans-kr)]">레벨</h3>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold numeric-highlight">{level}</p>
            <Badge type="grade" value={tier} />
          </div>
        </div>
      </SectionCard>

      {/* 총 점수 카드 */}
      <SectionCard>
        <div className="space-y-2">
          <h3 className="text-sm text-muted-foreground font-[var(--font-noto-sans-kr)]">총 점수</h3>
          <p className="text-3xl numeric-highlight">
            {totalScore.toLocaleString()}
          </p>
        </div>
      </SectionCard>

      {/* 총 시뮬레이션 카드 */}
      <SectionCard>
        <div className="space-y-2">
          <h3 className="text-sm text-muted-foreground font-[var(--font-noto-sans-kr)]">총 시뮬레이션</h3>
          <p className="text-3xl font-bold numeric-highlight">{simulationCount}</p>
        </div>
      </SectionCard>
    </div>
  );
});

