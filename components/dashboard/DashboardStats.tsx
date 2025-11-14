/**
 * @file DashboardStats.tsx
 * @description 대시보드 브랜드 Value Chain 통계 컴포넌트
 *
 * 주요 기능:
 * 1. 브랜드 Value Chain (IX) 3모듈 구조 표시
 * 2. Experience Module: 이번 주 시뮬레이션 횟수
 * 3. Insight Module: 무료 리포트 조회 수
 * 4. Index Module: 점수/레벨/히스토리
 *
 * 핵심 구현 로직:
 * - 브랜드 가치 사슬을 UI로 직접 표현
 * - 각 모듈별 아이콘 및 설명 제공
 * - 브랜드 Accent Colors 사용
 *
 * 브랜드 통합:
 * - Design System v2.2: 브랜드 Value Chain 4축 반영
 *   - Infinite eXperience (경험) → Experience Module
 *   - Insight (통찰) → Insight Module
 *   - Index (지표) → Index Module
 * - 브랜드 Accent Colors:
 *   - Green: Experience Module (성장/긍정적 지표)
 *   - Blue: Insight Module (Financial clarity 핵심)
 *   - Amber: Index Module (경고/학습 시그널)
 * - Numeric Highlight: 점수에 적용
 * - Layout Rules: SectionCard 사용, 3개 카드 그리드 레이아웃
 *
 * @dependencies
 * - @/components/common/SectionCard: 섹션 카드
 * - lucide-react: 아이콘
 *
 * @see {@link /docs/ui/design-system.md} - 브랜드 Value Chain 4축 (Section 1)
 * @see {@link /docs/product/brand-story.md} - BIDIX의 'ix' 가치 사슬
 * @see {@link /docs/product/todov3.md} - DashboardStats 명세 (라인 315-323)
 */

import { SectionCard } from "@/components/common/SectionCard";
import { Activity, Eye, Target } from "lucide-react";

export interface DashboardStatsProps {
  experience: { count: number }; // Experience Module
  insight: { count: number }; // Insight Module
  index: { score: number; level: number }; // Index Module
}

export function DashboardStats({
  experience,
  insight,
  index,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Experience Module - Infinite eXperience */}
      <SectionCard>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[hsl(var(--accent-green))]/10">
              <Activity className="w-5 h-5 text-[hsl(var(--accent-green))]" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Infinite eXperience
            </h3>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold numeric-highlight">
              {experience.count}
            </p>
            <p className="text-sm text-muted-foreground">
              이번 주 시뮬레이션 횟수
            </p>
          </div>
          <p className="text-xs text-muted-foreground pt-2 border-t">
            리스크 없는 실전에서 무한히 경험하고 있습니다.
          </p>
        </div>
      </SectionCard>

      {/* Insight Module - 날카로운 통찰 */}
      <SectionCard>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[hsl(var(--accent-blue))]/10">
              <Eye className="w-5 h-5 text-[hsl(var(--accent-blue))]" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Insight
            </h3>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold numeric-highlight">
              {insight.count}
            </p>
            <p className="text-sm text-muted-foreground">
              무료 리포트 조회 수
            </p>
          </div>
          <p className="text-xs text-muted-foreground pt-2 border-t">
            데이터 기반의 복기를 통해 날카로운 통찰을 얻고 있습니다.
          </p>
        </div>
      </SectionCard>

      {/* Index Module - 성장의 지표 */}
      <SectionCard>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[hsl(var(--accent-amber))]/10">
              <Target className="w-5 h-5 text-[hsl(var(--accent-amber))]" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Index
            </h3>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold numeric-highlight">
              {index.score}
            </p>
            <p className="text-sm text-muted-foreground">
              현재 점수 · 레벨 {index.level}
            </p>
          </div>
          <p className="text-xs text-muted-foreground pt-2 border-t">
            당신의 실력을 증명하는 객관적인 지표입니다.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}

