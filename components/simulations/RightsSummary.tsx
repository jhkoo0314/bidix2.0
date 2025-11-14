/**
 * @file RightsSummary.tsx
 * @description 권리 분석 요약 컴포넌트 (무료 제공)
 *
 * 주요 기능:
 * 1. 총 인수금액 표시
 * 2. 명도 비용 표시
 * 3. 명도 위험도 표시
 * 4. riskFlags 태그 표시
 *
 * 핵심 구현 로직:
 * - Rights 타입 데이터 사용
 * - 무료로 제공되는 요약 정보만 표시
 * - 브랜드 통합 디자인 시스템 v2.2 적용
 *
 * 브랜드 통합:
 * - Design System v2.2: SectionCard 사용, 브랜드 보이스 메시지
 * - 브랜드 보이스: 감성·멘토 톤의 한 줄 메시지 추가
 * - 브랜드 Accent Colors: riskFlags Badge에 Amber 사용
 * - Data Mapping: 향후 Property difficulty Props 추가 시 구현 예정
 *
 * @dependencies
 * - @/lib/types: Rights 타입
 * - @/components/common/SectionCard: 섹션 카드
 * - @/components/common/DataRow: 데이터 행
 * - @/components/common/Badge: 리스크 플래그 배지
 *
 * @see {@link /docs/ui/component-spec.md} - RightsSummary Props 명세
 * @see {@link /docs/product/todov3.md} - 브랜드 패치 명세
 * @see {@link /docs/ui/design-system.md} - Data Mapping 규칙
 */

import { Rights } from "@/lib/types";
import { SectionCard } from "@/components/common/SectionCard";
import { DataRow } from "@/components/common/DataRow";
import { Badge } from "@/components/common/Badge";

export interface RightsSummaryProps {
  rights: Rights;
}

export function RightsSummary({ rights }: RightsSummaryProps) {
  const getRiskLabel = (risk: number): string => {
    if (risk >= 0.7) return "높음";
    if (risk >= 0.4) return "보통";
    return "낮음";
  };

  const getRiskColor = (risk: number): string => {
    if (risk >= 0.7) return "text-red-600 dark:text-red-400";
    if (risk >= 0.4) return "text-[hsl(var(--accent-amber))]";
    return "text-[hsl(var(--accent-green))]";
  };

  return (
    <SectionCard title="권리 분석 요약">
      <div className="space-y-4">
        {/* 브랜드 메시지 */}
        <p className="text-sm text-muted-foreground italic border-l-2 border-[hsl(var(--accent-blue))] pl-3 py-2">
          사실을 먼저 이해한 다음, 분석이 시작됩니다.
        </p>

        <DataRow
          label="총 인수금액"
          value={rights.assumableRightsTotal}
          type="currency"
        />
        <DataRow
          label="예상 명도비용"
          value={rights.evictionCostEstimated}
          type="currency"
        />

        {/* 명도 위험도 */}
        <div className="flex justify-between items-center py-2">
          <span className="text-muted-foreground">명도 위험도</span>
          <span
            className={`font-semibold ${getRiskColor(rights.evictionRisk)}`}
          >
            {getRiskLabel(rights.evictionRisk)}
          </span>
        </div>

        {/* riskFlags 표시 */}
        {rights.riskFlags && rights.riskFlags.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 text-sm">리스크 플래그</h4>
            <div className="flex flex-wrap gap-2">
              {rights.riskFlags.map((flag, index) => (
                <Badge
                  key={index}
                  type="grade"
                  value={flag}
                  className="bg-[hsl(var(--accent-amber))]/10 text-[hsl(var(--accent-amber))] border-[hsl(var(--accent-amber))]/20"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
