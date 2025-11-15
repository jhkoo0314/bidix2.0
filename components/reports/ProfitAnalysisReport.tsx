/**
 * @file ProfitAnalysisReport.tsx
 * @description 수익 분석 상세 리포트 컴포넌트 (Premium)
 *
 * 주요 기능:
 * 1. 수익 분석 상세 리포트 표시 - report-result.md Section 2 기반 구조
 * 2. Profit Summary, 필요 자기자본, 비용 구조 상세, Profit Scenarios 비교 테이블 제공
 * 3. Profit, Valuation, Costs 타입 구조 100% 준수
 *
 * 핵심 구현 로직:
 * - Part 1: Profit Summary (초기 안전마진, 3/6/12개월 순이익, 최적 보유기간)
 * - Part 2: 필요 자기자본 (총취득원가, 대출금, 필요 자기자본)
 * - Part 3: 비용 구조 상세 (취득원가 상세, 보유기간별 비용)
 * - Part 4: Profit Scenarios 비교 테이블 (3/6/12개월 시나리오, 최적 시나리오 하이라이트, 수익분기점)
 * - SectionCard 및 DataRow 사용하여 레이아웃 구성
 *
 * 브랜드 통합:
 * - 브랜드 메시지: "사실을 이해하셨습니다. 이제 분석을 시작할 준비가 되셨나요?"
 * - 브랜드 Accent Color: Blue (Financial clarity 핵심)
 * - Design System v2.2: Layout Rules 준수 (간격 넓게, 경계 옅게)
 * - Numeric Highlight 스타일 적용 (금액/백분율)
 *
 * @dependencies
 * - @/lib/types: Profit, Valuation, Costs 타입
 * - @/components/common/SectionCard: 섹션 카드
 * - @/components/common/DataRow: 데이터 행 컴포넌트
 * - @/lib/utils/number: formatCurrency, formatPercentage 유틸리티
 *
 * @see {@link /docs/ui/component-spec.md} - ProfitAnalysisReport Props 명세 (v2.2)
 * @see {@link /docs/product/report-result.md} - 수익 분석 리포트 상세 명세 (Section 2)
 * @see {@link /docs/product/prdv2.md} - Premium 기능 정책 및 브랜드 메시지
 * @see {@link /docs/ui/design-system.md} - Color Tokens 및 Layout Rules
 */

import { Profit, Valuation, Costs } from "@/lib/types";
import { SectionCard } from "@/components/common/SectionCard";
import { DataRow } from "@/components/common/DataRow";
import { formatCurrency, formatPercentage } from "@/lib/utils/number";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface ProfitAnalysisReportProps {
  profit: Profit;
  valuation: Valuation;
  costs: Costs;
}

export function ProfitAnalysisReport({
  profit,
  valuation,
  costs,
}: ProfitAnalysisReportProps) {
  console.group("ProfitAnalysisReport Component");
  console.log("Profit data:", {
    initialSafetyMargin: profit.initialSafetyMargin,
    scenarios: {
      "3m": profit.scenarios["3m"],
      "6m": profit.scenarios["6m"],
      "12m": profit.scenarios["12m"],
    },
    breakevenExit: {
      "3m": profit.breakevenExit_3m,
      "6m": profit.breakevenExit_6m,
      "12m": profit.breakevenExit_12m,
    },
  });
  console.log("Costs data:", {
    acquisition: costs.acquisition,
    byPeriod: costs.byPeriod,
  });
  console.log("Valuation data:", {
    adjustedFMV: valuation.adjustedFMV,
    exitPrice: valuation.exitPrice,
  });
  console.groupEnd();

  // 최적 보유기간 계산 (ROI 기준으로 최고값 찾기)
  const scenarios = [
    profit.scenarios["3m"],
    profit.scenarios["6m"],
    profit.scenarios["12m"],
  ];
  const bestScenario = scenarios.reduce((best, current) =>
    current.annualizedRoi > best.annualizedRoi ? current : best
  );
  const bestHoldingPeriod = bestScenario.months;

  // 초기 안전마진을 백분율로 변환 (profit.initialSafetyMargin은 decimal 형태)
  const initialSafetyMarginPercent = profit.initialSafetyMargin * 100;

  return (
    <SectionCard title="수익 분석 상세 리포트">
      <div className="space-y-6">
        {/* 브랜드 메시지 */}
        <div className="p-4 rounded-lg bg-[hsl(var(--accent-blue))]/10 dark:bg-[hsl(var(--accent-blue))]/20 border border-[hsl(var(--accent-blue))]/30">
          <p className="text-sm text-gray-700 dark:text-gray-300 italic">
            &quot;사실을 이해하셨습니다. 이제 분석을 시작할 준비가 되셨나요?&quot;
          </p>
        </div>

        {/* Part 1: Profit Summary */}
        <div className="space-y-4 pb-4 border-b">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            [Part 1] Profit Summary
          </h3>
          <div className="space-y-3">
            <DataRow
              label="초기 안전마진"
              value={initialSafetyMarginPercent}
              type="percentage"
            />
            <DataRow
              label="3개월 순이익"
              value={profit.scenarios["3m"].netProfit}
              type="currency"
            />
            <DataRow
              label="6개월 순이익"
              value={profit.scenarios["6m"].netProfit}
              type="currency"
            />
            <DataRow
              label="12개월 순이익"
              value={profit.scenarios["12m"].netProfit}
              type="currency"
            />
            <div className="pt-2">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                최적 보유기간:{" "}
                <span className="numeric-highlight text-[hsl(var(--accent-amber))] dark:text-[hsl(var(--accent-amber))]">
                  {bestHoldingPeriod}개월
                </span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                연환산 ROI 기준 최고 수익 시나리오
              </p>
            </div>
          </div>
        </div>

        {/* Part 2: 필요 자기자본 */}
        <div className="space-y-4 pb-4 border-b">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            [Part 2] 필요 자기자본
          </h3>
          <div className="space-y-3">
            <DataRow
              label="총취득원가"
              value={costs.acquisition.totalAcquisition}
              type="currency"
            />
            <DataRow
              label="대출금"
              value={costs.acquisition.loanPrincipal}
              type="currency"
            />
            <DataRow
              label="필요 자기자본"
              value={costs.acquisition.ownCash}
              type="currency"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              필요 자기자본 = 총취득원가 - 대출금
            </p>
          </div>
        </div>

        {/* Part 3: 비용 구조 상세 */}
        <div className="space-y-4 pb-4 border-b">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            [Part 3] 비용 구조 상세
          </h3>

          {/* 취득원가 상세 */}
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              취득원가 상세
            </h4>
            <div className="pl-4 space-y-2 border-l-2 border-gray-200 dark:border-gray-700">
              <DataRow
                label="취득세"
                value={costs.acquisition.taxes}
                type="currency"
              />
              <DataRow
                label="법무비용"
                value={costs.acquisition.legalFees}
                type="currency"
              />
              <DataRow
                label="수리비"
                value={costs.acquisition.repairCost}
                type="currency"
              />
              <DataRow
                label="명도비용"
                value={costs.acquisition.evictionCost}
                type="currency"
              />
            </div>
          </div>

          {/* 보유기간별 비용 */}
          <div className="space-y-3 pt-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              보유기간별 비용
            </h4>
            <div className="space-y-4">
              {(["3m", "6m", "12m"] as const).map((period) => {
                const periodCost = costs.byPeriod[period];
                return (
                  <div
                    key={period}
                    className="pl-4 border-l-2 border-gray-200 dark:border-gray-700"
                  >
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {periodCost.months}개월
                    </p>
                    <div className="space-y-2">
                      <DataRow
                        label="보유비용"
                        value={periodCost.holdingCost}
                        type="currency"
                      />
                      <DataRow
                        label="이자비용"
                        value={periodCost.interestCost}
                        type="currency"
                      />
                      <DataRow
                        label="총비용"
                        value={periodCost.totalCost}
                        type="currency"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Part 4: Profit Scenarios 비교 테이블 */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            [Part 4] Profit Scenarios 비교
          </h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-[var(--font-noto-sans-kr)]">
                    기간
                  </TableHead>
                  <TableHead className="text-right font-[var(--font-noto-sans-kr)]">
                    ExitPrice
                  </TableHead>
                  <TableHead className="text-right font-[var(--font-noto-sans-kr)]">
                    TotalCost
                  </TableHead>
                  <TableHead className="text-right font-[var(--font-noto-sans-kr)]">
                    Net Profit
                  </TableHead>
                  <TableHead className="text-right font-[var(--font-noto-sans-kr)]">
                    Annualized ROI
                  </TableHead>
                  <TableHead className="text-right font-[var(--font-noto-sans-kr)]">
                    수익분기점
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scenarios.map((scenario) => {
                  const isBest = scenario.months === bestScenario.months;
                  const isProfitable = scenario.netProfit >= 0;
                  const breakevenExit =
                    scenario.months === 3
                      ? profit.breakevenExit_3m
                      : scenario.months === 6
                        ? profit.breakevenExit_6m
                        : profit.breakevenExit_12m;

                  return (
                    <TableRow
                      key={scenario.months}
                      className={
                        isBest
                          ? "bg-[hsl(var(--accent-amber))]/10 dark:bg-[hsl(var(--accent-amber))]/20"
                          : ""
                      }
                    >
                      <TableCell className="font-[var(--font-noto-sans-kr)]">
                        <span className="font-semibold">
                          {scenario.months}개월
                        </span>
                        {isBest && (
                          <span className="ml-2 text-xs text-[hsl(var(--accent-amber))] dark:text-[hsl(var(--accent-amber))]">
                            (최적)
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-[var(--font-noto-sans-kr)]">
                        {formatCurrency(scenario.exitPrice)}
                      </TableCell>
                      <TableCell className="text-right font-[var(--font-noto-sans-kr)]">
                        {formatCurrency(scenario.totalCost)}
                      </TableCell>
                      <TableCell
                        className={`text-right font-semibold font-[var(--font-noto-sans-kr)] ${
                          isProfitable
                            ? "text-[hsl(var(--accent-green))] dark:text-[hsl(var(--accent-green))]"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {formatCurrency(scenario.netProfit)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="numeric-highlight font-semibold font-[var(--font-noto-sans-kr)]">
                          {formatPercentage(scenario.annualizedRoi * 100)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-[var(--font-noto-sans-kr)]">
                        {formatCurrency(breakevenExit)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            수익분기점: 해당 기간 동안 손익분기점을 달성하기 위한 최소 ExitPrice
          </p>
        </div>
      </div>
    </SectionCard>
  );
}
