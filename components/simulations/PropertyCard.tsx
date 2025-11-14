/**
 * @file PropertyCard.tsx
 * @description 매물 카드 컴포넌트
 *
 * 주요 기능:
 * 1. 시뮬레이션 목록에서 매물 정보 표시
 * 2. 유형, 주소, 감정가, 최저입찰가, 난이도 표시
 * 3. 클릭 시 상세 페이지로 이동
 *
 * 핵심 구현 로직:
 * - Property 타입과 Valuation의 minBid 사용
 * - 난이도 배지 표시
 * - 브랜드 통합 디자인 시스템 v2.2 적용
 *
 * 브랜드 통합:
 * - Design System v2.2: Numeric Highlight 스타일 적용 (금액)
 * - 브랜드 Accent Colors: Badge 컴포넌트로 난이도 표시
 * - Layout Rules: 호버 효과는 소극적 강조
 *
 * @dependencies
 * - @/lib/types: Property 타입
 * - @/components/common/Badge: 난이도 배지
 * - next/link: 내비게이션
 *
 * @see {@link /docs/ui/component-spec.md} - PropertyCard Props 명세
 * @see {@link /docs/ui/design-system.md} - Numeric Highlight 규칙
 */

import Link from "next/link";
import { Property } from "@/lib/types";
import { Badge } from "@/components/common/Badge";

export interface PropertyCardProps {
  property: Property;
  valuation: {
    minBid: number;
  };
}

export function PropertyCard({ property, valuation }: PropertyCardProps) {
  return (
    <Link
      href={`/simulations/${property.id}`}
      className="block p-6 border rounded-lg hover:shadow-md transition-shadow hover:border-[hsl(var(--accent-blue))]/20"
    >
      <div className="space-y-4">
        {/* 헤더 */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold">{property.type}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {property.address}
            </p>
          </div>
          <Badge type="difficulty" value={property.difficulty} />
        </div>

        {/* 정보 */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-sm text-muted-foreground">감정가</p>
            <p className="text-lg numeric-highlight">
              {property.appraisalValue
                ? property.appraisalValue.toLocaleString()
                : "정보 없음"}원
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">최저 입찰가</p>
            <p className="text-lg numeric-highlight">
              {valuation.minBid
                ? valuation.minBid.toLocaleString()
                : "정보 없음"}원
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

