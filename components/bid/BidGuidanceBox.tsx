/**
 * @file BidGuidanceBox.tsx
 * @description 입찰 가이드 박스 컴포넌트
 *
 * 주요 기능:
 * 1. 안전마진 설명
 * 2. 권장 입찰가 범위 표시
 * 3. 가이드 메시지 제공
 *
 * 핵심 구현 로직:
 * - Valuation의 recommendedBidRange 사용
 * - 사용자 친화적인 가이드 메시지
 *
 * @dependencies
 * - @/lib/types: Valuation 타입
 * - @/components/common/SectionCard: 섹션 카드
 *
 * @see {@link /docs/ui/component-spec.md} - BidGuidanceBox Props 명세
 */

import { Valuation } from "@/lib/types";
import { SectionCard } from "@/components/common/SectionCard";

export interface BidGuidanceBoxProps {
  valuation: Valuation;
}

export function BidGuidanceBox({ valuation }: BidGuidanceBoxProps) {
  const { min, max } = valuation.recommendedBidRange;

  return (
    <SectionCard>
      <div className="space-y-4 bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
        <h3 className="text-lg font-semibold">입찰 가이드</h3>
        
        <div className="space-y-2">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>권장 입찰가 범위:</strong>
          </p>
          <p className="text-base font-semibold">
            {min.toLocaleString()}원 ~ {max.toLocaleString()}원
          </p>
        </div>

        <div className="space-y-2 pt-2 border-t">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            • 안전마진을 고려한 입찰가를 권장합니다.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            • 권장 범위 내 입찰 시 수익 가능성이 높습니다.
          </p>
        </div>
      </div>
    </SectionCard>
  );
}

