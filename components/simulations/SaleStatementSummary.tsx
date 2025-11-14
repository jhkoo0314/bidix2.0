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
 * - 브랜드 통합 디자인 시스템 v2.2 적용
 *
 * 브랜드 통합:
 * - Design System v2.2: SectionCard 사용, 브랜드 보이스 메시지
 * - 브랜드 보이스: 감성·멘토 톤의 한 줄 메시지 추가
 * - Data Mapping: 향후 Valuation Props 추가 시 구현 예정
 *
 * @dependencies
 * - @/lib/types: Property, CourtDocsNormalized 타입
 * - @/components/common/SectionCard: 섹션 카드
 *
 * @see {@link /docs/ui/component-spec.md} - SaleStatementSummary Props 명세
 * @see {@link /docs/product/prdv2.md} - 무료 제공 정책
 * @see {@link /docs/product/todov3.md} - 브랜드 패치 명세
 * @see {@link /docs/ui/design-system.md} - Data Mapping 규칙
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
        {/* 브랜드 메시지 */}
        <p className="text-sm text-muted-foreground italic border-l-2 border-[hsl(var(--accent-blue))] pl-3 py-2">
          사실을 먼저 이해한 다음, 분석이 시작됩니다.
        </p>

        {/* 부동산 정보 */}
        <div>
          <h4 className="font-semibold mb-2">부동산 표시</h4>
          <p className="text-sm text-muted-foreground">{property.address}</p>
          <p className="text-sm text-muted-foreground">
            {property.type} · {property.sizeM2}㎡
          </p>
        </div>

        {/* 권리 정보 */}
        <div>
          <h4 className="font-semibold mb-2">등기 권리</h4>
          <p className="text-sm text-muted-foreground">
            등기된 권리: {registeredRightsCount}건
          </p>
        </div>

        {/* 점유자 정보 */}
        <div>
          <h4 className="font-semibold mb-2">점유자/임차인</h4>
          <p className="text-sm text-muted-foreground">
            {occupantsCount > 0
              ? `임차인 ${occupantsCount}명 존재`
              : "임차인 없음"}
          </p>
        </div>

        {/* 비고 */}
        {courtDocs.remarks && (
          <div>
            <h4 className="font-semibold mb-2">비고</h4>
            <p className="text-sm text-muted-foreground">{courtDocs.remarks}</p>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
