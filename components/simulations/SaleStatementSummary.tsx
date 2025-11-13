/**
 * @file SaleStatementSummary.tsx
 * @description 매각물건명세서 요약 컴포넌트 (무료 제공)
 *
 * 주요 기능:
 * 1. 부동산의 표시 정보 요약
 * 2. 비고란 요약
 * 3. 주요 권리 수 표시
 * 4. 임차인 존재 여부 표시
 *
 * 핵심 구현 로직:
 * - Property와 CourtDocsNormalized 데이터 사용
 * - 무료로 제공되는 요약 정보만 표시
 *
 * @dependencies
 * - @/lib/types: Property, CourtDocsNormalized 타입
 * - @/components/common/SectionCard: 섹션 카드
 *
 * @see {@link /docs/ui/component-spec.md} - SaleStatementSummary Props 명세
 * @see {@link /docs/product/prdv2.md} - 무료 제공 정책
 */

import { Property, CourtDocsNormalized } from "@/lib/types";
import { SectionCard } from "@/components/common/SectionCard";

export interface SaleStatementSummaryProps {
  property: Property;
  courtDocs: CourtDocsNormalized;
}

export function SaleStatementSummary({
  property,
  courtDocs,
}: SaleStatementSummaryProps) {
  const registeredRightsCount = courtDocs.registeredRights?.length || 0;
  const occupantsCount = courtDocs.occupants?.length || 0;

  return (
    <SectionCard title="매각물건명세서 요약">
      <div className="space-y-4">
        {/* 부동산 정보 */}
        <div>
          <h4 className="font-semibold mb-2">부동산 표시</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {property.address}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {property.type} · {property.sizeM2}㎡
          </p>
        </div>

        {/* 권리 정보 */}
        <div>
          <h4 className="font-semibold mb-2">등기 권리</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            등기된 권리: {registeredRightsCount}건
          </p>
        </div>

        {/* 점유자 정보 */}
        <div>
          <h4 className="font-semibold mb-2">점유자/임차인</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {occupantsCount > 0
              ? `임차인 ${occupantsCount}명 존재`
              : "임차인 없음"}
          </p>
        </div>

        {/* 비고 */}
        {courtDocs.remarks && (
          <div>
            <h4 className="font-semibold mb-2">비고</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {courtDocs.remarks}
            </p>
          </div>
        )}
      </div>
    </SectionCard>
  );
}

