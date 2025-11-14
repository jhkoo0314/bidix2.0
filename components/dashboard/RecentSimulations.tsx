/**
 * @file RecentSimulations.tsx
 * @description 최근 시뮬레이션 목록 컴포넌트
 *
 * 주요 기능:
 * 1. 최근 시뮬레이션 3개 표시
 * 2. PropertyCard 형태로 표시
 * 3. 클릭 시 결과 페이지로 이동
 *
 * 핵심 구현 로직:
 * - Property 타입 기반으로 시뮬레이션 목록 렌더링
 * - PropertyCard 컴포넌트 사용 (component-spec.md 준수)
 * - 빈 상태는 EmptyState 컴포넌트 사용
 *
 * 브랜드 통합:
 * - Design System v2.2: PropertyCard 사용으로 일관된 UI
 * - 브랜드 보이스: 격려하는 메시지 ("첫 시뮬레이션을 시작해보세요!")
 * - EmptyState: 사용자를 평가하지 않는 따뜻한 톤
 *
 * @dependencies
 * - @/components/simulations/PropertyCard: 매물 카드 컴포넌트
 * - @/components/common/EmptyState: 빈 상태 컴포넌트
 * - @/lib/types: Property 타입
 *
 * @see {@link /docs/product/user-flow.md} - 사용자 플로우
 * @see {@link /docs/ui/component-spec.md} - RecentSimulations Props 명세
 * @see {@link /docs/ui/component-architecture.md} - 컴포넌트 구조
 */

import { Property } from "@/lib/types";
import { PropertyCard } from "@/components/simulations/PropertyCard";
import { EmptyState } from "@/components/common/EmptyState";

export interface SimulationListItem {
  id: string;
  property: Property;
  valuation: {
    minBid: number;
  };
}

export interface RecentSimulationsProps {
  simulations: SimulationListItem[];
}

export function RecentSimulations({
  simulations,
}: RecentSimulationsProps) {
  if (simulations.length === 0) {
    return (
      <EmptyState
        message="아직 시뮬레이션이 없습니다. 첫 시뮬레이션을 시작해보세요!"
      />
    );
  }

  return (
    <div className="space-y-4">
      {simulations.map((simulation) => (
        <PropertyCard
          key={simulation.id}
          property={simulation.property}
          valuation={simulation.valuation}
        />
      ))}
    </div>
  );
}

