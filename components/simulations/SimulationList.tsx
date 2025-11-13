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
 * - 필터 상태 관리
 * - PropertyCard 컴포넌트 사용
 *
 * @dependencies
 * - react: useState
 * - @/components/simulations/PropertyCard: 매물 카드
 * - @/components/simulations/FilterBar: 필터 바
 * - @/components/common/EmptyState: 빈 상태
 *
 * @see {@link /docs/ui/component-architecture.md} - 컴포넌트 구조
 */

"use client";

import { useState } from "react";
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
  const [_filters, setFilters] = useState<FilterState>({});
  const [simulations] = useState(initialSimulations);

  // TODO: 필터링 로직 구현
  const filteredSimulations = simulations;

  return (
    <div className="space-y-6">
      <FilterBar onFilterChange={setFilters} />

      {filteredSimulations.length === 0 ? (
        <EmptyState message="시뮬레이션이 없습니다." />
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
