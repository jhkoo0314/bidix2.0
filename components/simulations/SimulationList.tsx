/**
 * @file SimulationList.tsx
 * @description 시뮬레이션 목록 컴포넌트 (Client Component)
 *
 * 주요 기능:
 * 1. 시뮬레이션 목록 표시
 * 2. 필터링 기능 통합
 * 3. PropertyCard 그리드 레이아웃
 *
 * 핵심 구현 로직:
 * - Client Component로 구현
 * - FilterState 기반 필터링 로직
 * - 난이도/매물 타입/지역 필터 적용
 * - 필터 변경 시 즉시 반영
 *
 * 브랜드 통합:
 * - Design System v2.2: 반응형 그리드 레이아웃
 * - 브랜드 보이스: 빈 상태 메시지 적용
 * - Layout Rules: 간격은 넓게, 경계는 옅게
 *
 * @dependencies
 * - react: useState, useMemo
 * - @/components/simulations/PropertyCard: 매물 카드
 * - @/components/simulations/FilterBar: 필터 바
 * - @/components/common/EmptyState: 빈 상태
 * - @/lib/types: Property 타입
 *
 * @see {@link /docs/ui/component-architecture.md} - 컴포넌트 구조
 * @see {@link /docs/product/todov3.md} - 필터링 로직 명세
 */

"use client";

import { useState, useMemo } from "react";
import { PropertyCard } from "./PropertyCard";
import { FilterBar, FilterState } from "./FilterBar";
import { EmptyState } from "@/components/common/EmptyState";
import { Property } from "@/lib/types";

export interface SimulationListItem {
  id: string;
  property: Property;
  valuation: {
    minBid: number;
  };
}

export interface SimulationListProps {
  simulations: SimulationListItem[];
}

export function SimulationList({
  simulations: initialSimulations,
}: SimulationListProps) {
  const [filters, setFilters] = useState<FilterState>({});

  // 필터링 로직 구현
  const filteredSimulations = useMemo(() => {
    return initialSimulations.filter((simulation) => {
      // 난이도 필터
      if (
        filters.difficulty &&
        simulation.property.difficulty !== filters.difficulty
      ) {
        return false;
      }

      // 매물 타입 필터
      if (filters.type && simulation.property.type !== filters.type) {
        return false;
      }

      // 지역 필터 (주소 포함 검색)
      if (
        filters.region &&
        !simulation.property.address
          .toLowerCase()
          .includes(filters.region.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [initialSimulations, filters]);

  return (
    <div className="space-y-6">
      <FilterBar onFilterChange={setFilters} />

      {filteredSimulations.length === 0 ? (
        <EmptyState message="필터 조건에 맞는 시뮬레이션이 없습니다. 다른 조건으로 검색해보세요." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSimulations.map((simulation) => (
            <PropertyCard
              key={simulation.id}
              property={simulation.property}
              valuation={simulation.valuation}
            />
          ))}
        </div>
      )}
    </div>
  );
}
