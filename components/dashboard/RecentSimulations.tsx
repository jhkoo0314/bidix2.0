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
 * - 시뮬레이션 목록을 카드 형태로 렌더링
 * - Link를 통한 네비게이션
 *
 * @dependencies
 * - next/link: 내비게이션
 * - @/components/simulations/PropertyCard: 매물 카드 컴포넌트
 *
 * @see {@link /docs/product/user-flow.md} - 사용자 플로우
 */

import Link from "next/link";

export interface SimulationListItem {
  id: string;
  property: {
    type: string;
    address: string;
    appraisalValue: number;
  };
  valuation: {
    minBid: number;
  };
  difficulty: "easy" | "normal" | "hard";
}

export interface RecentSimulationsProps {
  simulations: SimulationListItem[];
}

export function RecentSimulations({
  simulations,
}: RecentSimulationsProps) {
  if (simulations.length === 0) {
    return (
      <div className="p-6 border rounded-lg text-center text-gray-500">
        아직 시뮬레이션이 없습니다. 첫 시뮬레이션을 시작해보세요!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {simulations.map((simulation) => (
        <Link
          key={simulation.id}
          href={`/simulations/${simulation.id}/result`}
          className="block p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold">{simulation.property.type}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {simulation.property.address}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                감정가
              </p>
              <p className="font-semibold">
                {simulation.property.appraisalValue.toLocaleString()}원
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

