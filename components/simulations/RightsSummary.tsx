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
 *
 * @dependencies
 * - @/lib/types: Rights 타입
 * - @/components/common/SectionCard: 섹션 카드
 * - @/components/common/DataRow: 데이터 행
 *
 * @see {@link /docs/ui/component-spec.md} - RightsSummary Props 명세
 */

import { Rights } from "@/lib/types";
import { SectionCard } from "@/components/common/SectionCard";
import { DataRow } from "@/components/common/DataRow";

export interface RightsSummaryProps {
  rights: Rights;
}

export function RightsSummary({ rights }: RightsSummaryProps) {
  const getRiskLabel = (risk: number): string => {
    if (risk >= 0.7) return "높음";
    if (risk >= 0.4) return "보통";
    return "낮음";
  };

  return (
    <SectionCard title="권리 분석 요약">
      <div className="space-y-4">
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
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600 dark:text-gray-400">명도 위험도</span>
          <span className="font-semibold">{getRiskLabel(rights.evictionRisk)}</span>
        </div>
      </div>
    </SectionCard>
  );
}

