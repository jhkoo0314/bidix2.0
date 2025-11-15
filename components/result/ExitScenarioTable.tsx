/**
 * @file ExitScenarioTable.tsx
 * @description 보유기간별 수익 시나리오 테이블 컴포넌트
 *
 * 주요 기능:
 * 1. 3개월/6개월/12개월 비교 테이블 - profit.scenarios 기반
 * 2. exitPrice, totalCost, netProfit, ROI 표시 - 금액 및 백분율 포맷팅
 * 3. 최적 시나리오 하이라이트 - bestHoldingPeriod 기준
 *
 * 핵심 구현 로직:
 * - Profit 타입 사용 (scenarios 객체 형태)
 * - scenarios 객체를 배열로 변환하여 표시
 * - 금액 포맷팅: toLocaleString()
 * - ROI/연환산 ROI에 Numeric Highlight 스타일 적용
 * - 브랜드 Accent Colors 적용 (최적 시나리오: Amber/Green)
 *
 * 브랜드 통합:
 * - 브랜드 Accent Colors: Amber(최적 시나리오), Green(수익), Red(손실)
 * - Design System v2.2: Numeric Highlight 스타일 (ROI 컬럼)
 * - Layout Rules: 모바일 스크롤 가능한 테이블
 *
 * @dependencies
 * - @/lib/types: Profit 타입 (SSOT)
 * - @/components/common/SectionCard: 섹션 카드
 *
 * @see {@link /docs/ui/component-spec.md} - ExitScenarioTable Props 명세 (v2.2)
 * @see {@link /docs/engine/json-schema.md} - ProfitScenario 타입 구조
 * @see {@link /docs/ui/design-system.md} - Accent Colors 규칙 및 Numeric Highlight
 */

import { memo, useMemo } from "react";
import { Profit } from "@/lib/types";
import { SectionCard } from "@/components/common/SectionCard";
import { BrandTooltip } from "@/components/common/BrandTooltip";
import { formatPercentage } from "@/lib/utils/number";

export interface ExitScenarioTableProps {
  profit: Profit; // scenarios 객체 포함
}

export const ExitScenarioTable = memo(function ExitScenarioTable({ profit }: ExitScenarioTableProps) {
  console.group("ExitScenarioTable Component");
  console.log("Profit scenarios:", {
    "3m": profit.scenarios["3m"],
    "6m": profit.scenarios["6m"],
    "12m": profit.scenarios["12m"],
  });

  // scenarios 객체를 배열로 변환 - useMemo로 최적화
  const scenarios = useMemo(() => [
    profit.scenarios["3m"],
    profit.scenarios["6m"],
    profit.scenarios["12m"],
  ], [profit.scenarios]);

  // 최적 시나리오 찾기 (ROI 기준) - useMemo로 최적화
  const bestScenario = useMemo(() => 
    scenarios.reduce((best, current) =>
      current.roi > best.roi ? current : best
    ), [scenarios]
  );

  console.log("Best scenario:", {
    months: bestScenario.months,
    roi: bestScenario.roi,
    annualizedRoi: bestScenario.annualizedRoi,
  });
  console.groupEnd();

  const tableId = "exit-scenario-table";

  return (
    <SectionCard title="보유기간별 수익 시나리오">
      <div className="overflow-x-auto">
        <table id={tableId} className="w-full" role="table" aria-label="보유기간별 수익 시나리오 비교">
          <thead>
            <tr className="border-b">
              <th scope="col" className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300 font-[var(--font-noto-sans-kr)]">
                보유기간
              </th>
              <th scope="col" className="text-right p-3 text-sm font-semibold text-gray-700 dark:text-gray-300 font-[var(--font-noto-sans-kr)]">
                매각가
              </th>
              <th scope="col" className="text-right p-3 text-sm font-semibold text-gray-700 dark:text-gray-300 font-[var(--font-noto-sans-kr)]">
                총비용
              </th>
              <th scope="col" className="text-right p-3 text-sm font-semibold text-gray-700 dark:text-gray-300 font-[var(--font-noto-sans-kr)]">
                순이익
              </th>
              <th scope="col" className="text-right p-3 text-sm font-semibold text-gray-700 dark:text-gray-300 font-[var(--font-noto-sans-kr)]">
                ROI
              </th>
              <th scope="col" className="text-right p-3 text-sm font-semibold text-gray-700 dark:text-gray-300 font-[var(--font-noto-sans-kr)]">
                연환산 ROI
              </th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((scenario) => {
              const isBest = scenario.months === bestScenario.months;
              const isProfitable = scenario.netProfit >= 0;

              return (
                <tr
                  key={scenario.months}
                  className={`border-b transition-colors ${
                    isBest
                      ? "bg-[hsl(var(--accent-amber))]/10 dark:bg-[hsl(var(--accent-amber))]/20"
                      : ""
                  }`}
                >
                  <th scope="row" className="p-3 text-left">
                    <span className="font-semibold font-[var(--font-noto-sans-kr)]">{scenario.months}개월</span>
                    {isBest && (
                      <span className="ml-2 text-xs text-[hsl(var(--accent-amber))] dark:text-[hsl(var(--accent-amber))] font-[var(--font-noto-sans-kr)]" aria-label="최적 보유기간">
                        (최적)
                      </span>
                    )}
                  </th>
                  <td className="text-right p-3 font-[var(--font-noto-sans-kr)]">
                    {scenario.exitPrice.toLocaleString()}원
                  </td>
                  <td className="text-right p-3 font-[var(--font-noto-sans-kr)]">
                    {scenario.totalCost.toLocaleString()}원
                  </td>
                  <td
                    className={`text-right p-3 font-semibold font-[var(--font-noto-sans-kr)] ${
                      isProfitable
                        ? "text-[hsl(var(--accent-green))] dark:text-[hsl(var(--accent-green))]"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {scenario.netProfit.toLocaleString()}원
                  </td>
                  <td className="text-right p-3">
                    <BrandTooltip content="이 보유기간 동안의 수익률입니다.">
                      <span className="numeric-highlight font-semibold font-[var(--font-noto-sans-kr)] brand-hover cursor-help">
                        {formatPercentage(scenario.roi * 100)}
                      </span>
                    </BrandTooltip>
                  </td>
                  <td className="text-right p-3">
                    <BrandTooltip content="연간 기준으로 환산한 수익률입니다.">
                      <span className="numeric-highlight font-semibold font-[var(--font-noto-sans-kr)] brand-hover cursor-help">
                        {formatPercentage(scenario.annualizedRoi * 100)}
                      </span>
                    </BrandTooltip>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
});

