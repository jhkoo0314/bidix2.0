/**
 * @file ExitScenarioTable.tsx
 * @description 보유기간별 수익 시나리오 테이블 컴포넌트
 *
 * 주요 기능:
 * 1. 3개월/6개월/12개월 비교 테이블
 * 2. exitPrice, totalCost, netProfit, ROI 표시
 * 3. 최적 시나리오 하이라이트
 *
 * 핵심 구현 로직:
 * - ProfitScenario[] 배열 사용 (3개 보유기간)
 * - 금액 포맷팅: toLocaleString()
 * - 모바일 스크롤 가능한 테이블
 *
 * @dependencies
 * - @/lib/types: ProfitScenario 타입
 * - @/components/common/SectionCard: 섹션 카드
 *
 * @see {@link /docs/ui/component-spec.md} - ExitScenarioTable Props 명세
 */

import { Profit } from "@/lib/types";
import { SectionCard } from "@/components/common/SectionCard";

export interface ExitScenarioTableProps {
  profit: Profit;
}

export function ExitScenarioTable({ profit }: ExitScenarioTableProps) {
  // scenarios 객체를 배열로 변환
  const scenarios = [
    profit.scenarios["3m"],
    profit.scenarios["6m"],
    profit.scenarios["12m"],
  ];
  
  // 최적 시나리오 찾기 (ROI 기준)
  const bestScenario = scenarios.reduce((best, current) =>
    current.roi > best.roi ? current : best
  );

  return (
    <SectionCard title="보유기간별 수익 시나리오">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 text-sm font-semibold">보유기간</th>
              <th className="text-right p-3 text-sm font-semibold">매각가</th>
              <th className="text-right p-3 text-sm font-semibold">총비용</th>
              <th className="text-right p-3 text-sm font-semibold">순이익</th>
              <th className="text-right p-3 text-sm font-semibold">ROI</th>
              <th className="text-right p-3 text-sm font-semibold">연환산 ROI</th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((scenario) => {
              const isBest = scenario.months === bestScenario.months;
              return (
                <tr
                  key={scenario.months}
                  className={`border-b ${
                    isBest ? "bg-yellow-50 dark:bg-yellow-950" : ""
                  }`}
                >
                  <td className="p-3">
                    <span className="font-semibold">{scenario.months}개월</span>
                    {isBest && (
                      <span className="ml-2 text-xs text-yellow-600 dark:text-yellow-400">
                        (최적)
                      </span>
                    )}
                  </td>
                  <td className="text-right p-3">
                    {scenario.exitPrice.toLocaleString()}원
                  </td>
                  <td className="text-right p-3">
                    {scenario.totalCost.toLocaleString()}원
                  </td>
                  <td
                    className={`text-right p-3 font-semibold ${
                      scenario.netProfit >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {scenario.netProfit.toLocaleString()}원
                  </td>
                  <td className="text-right p-3">
                    {(scenario.roi * 100).toFixed(2)}%
                  </td>
                  <td className="text-right p-3">
                    {(scenario.annualizedRoi * 100).toFixed(2)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

