/**
 * @file QuickFacts.tsx
 * @description 입찰 페이지 핵심 정보 컴포넌트
 *
 * 주요 기능:
 * 1. FMV(adjustedFMV) 표시
 * 2. minBid 표시
 * 3. exitPrice 3/6/12개월 표시 (v2.2 핵심 변경)
 *
 * 핵심 구현 로직:
 * - Valuation 타입 사용
 * - exitPrice 객체 구조 (3m/6m/12m) 반영
 *
 * @dependencies
 * - @/lib/types: Valuation 타입
 * - @/components/common/DataRow: 데이터 행
 * - @/components/common/SectionCard: 섹션 카드
 *
 * @see {@link /docs/ui/component-spec.md} - QuickFacts Props 명세
 * @see {@link /docs/engine/json-schema.md} - Valuation 타입 구조
 */

import { Valuation } from "@/lib/types";
import { SectionCard } from "@/components/common/SectionCard";
import { DataRow } from "@/components/common/DataRow";

export interface QuickFactsProps {
  valuation: Valuation;
}

export function QuickFacts({ valuation }: QuickFactsProps) {
  return (
    <SectionCard title="핵심 정보">
      <div className="space-y-4">
        <DataRow
          label="조정된 시세 (adjustedFMV)"
          value={valuation.adjustedFMV}
          type="currency"
        />
        <DataRow
          label="최저 입찰가 (minBid)"
          value={valuation.minBid}
          type="currency"
        />
        
        <div className="pt-4 border-t">
          <p className="text-sm font-semibold mb-3">예상 매각가 (보유기간별)</p>
          <div className="space-y-2">
            <DataRow
              label="3개월"
              value={valuation.exitPrice["3m"]}
              type="currency"
            />
            <DataRow
              label="6개월"
              value={valuation.exitPrice["6m"]}
              type="currency"
            />
            <DataRow
              label="12개월"
              value={valuation.exitPrice["12m"]}
              type="currency"
            />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

