/**
 * @file AuctionAnalysisReport.tsx
 * @description 경매 분석 상세 리포트 컴포넌트 (Premium)
 *
 * 주요 기능:
 * 1. 경매 분석 상세 리포트 표시 - report-result.md Section 3 기반 구조
 * 2. Result Summary, 입찰 포지션 분석, 점수 구조 상세, 입찰 전략 개선 포인트 제공
 * 3. AuctionSummary, Valuation, Profit, ScoreBreakdown 타입 구조 100% 준수
 *
 * 핵심 구현 로직:
 * - Part 1: Result Summary (내 입찰가, 결과 판단, 입찰 등급, 최종 점수)
 * - Part 2: 입찰 포지션 분석 (기준별 금액 비교 테이블, FMV 대비 비율)
 * - Part 3: 점수 구조 상세 (ScoreBreakdown 조건부 렌더링, 정확성/수익성/안정성 점수)
 * - Part 4: 입찰 전략 개선 포인트 (안전마진 보너스, 권장입찰가 보너스, 위험도 패널티)
 * - SectionCard 및 DataRow 사용하여 레이아웃 구성
 *
 * 브랜드 통합:
 * - 브랜드 메시지: "사실을 이해하셨습니다. 이제 분석을 시작할 준비가 되셨나요?"
 * - 브랜드 Accent Color: Blue (Financial clarity 핵심)
 * - Design System v2.2: Layout Rules 준수 (간격 넓게, 경계 옅게)
 * - Numeric Highlight 스타일 적용 (금액/백분율/점수)
 * - 등급별 색상: S(purple), A(blue), B(green), C(amber), D(red)
 *
 * @dependencies
 * - @/lib/types: AuctionSummary, Valuation, Profit 타입
 * - @/lib/engines/scoreengine: ScoreBreakdown 타입
 * - @/components/common/SectionCard: 섹션 카드
 * - @/components/common/DataRow: 데이터 행 컴포넌트
 * - @/components/common/Badge: 등급 배지
 * - @/lib/utils/number: formatCurrency, formatPercentage 유틸리티
 *
 * @see {@link /docs/ui/component-spec.md} - AuctionAnalysisReport Props 명세 (v2.2)
 * @see {@link /docs/product/report-result.md} - 경매 분석 리포트 상세 명세 (Section 3)
 * @see {@link /docs/product/prdv2.md} - Premium 기능 정책 및 브랜드 메시지
 * @see {@link /docs/ui/design-system.md} - Color Tokens 및 Layout Rules
 */

import { AuctionSummary, Valuation, Profit } from "@/lib/types";
import { ScoreBreakdown } from "@/lib/engines/scoreengine";
import { SectionCard } from "@/components/common/SectionCard";
import { DataRow } from "@/components/common/DataRow";
import { Badge } from "@/components/common/Badge";
import { formatCurrency, formatPercentage } from "@/lib/utils/number";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface AuctionAnalysisReportProps {
  summary: AuctionSummary;
  valuation: Valuation;
  profit: Profit;
  userBid: number;
  scoreBreakdown?: ScoreBreakdown;
}

export function AuctionAnalysisReport({
  summary,
  valuation,
  profit,
  userBid,
  scoreBreakdown,
}: AuctionAnalysisReportProps) {
  console.group("AuctionAnalysisReport Component");
  console.log("Summary data:", {
    grade: summary.grade,
    riskLabel: summary.riskLabel,
    bestHoldingPeriod: summary.bestHoldingPeriod,
    recommendedBidRange: summary.recommendedBidRange,
    isProfitable: summary.isProfitable,
  });
  console.log("Valuation data:", {
    adjustedFMV: valuation.adjustedFMV,
    minBid: valuation.minBid,
    recommendedBidRange: valuation.recommendedBidRange,
  });
  console.log("Profit data:", {
    initialSafetyMargin: profit.initialSafetyMargin,
    scenarios: profit.scenarios,
  });
  console.log("User bid:", userBid);
  console.log("Score breakdown:", scoreBreakdown);
  console.groupEnd();

  // 결과 판단 로직 (BidOutcomeBlock 참고)
  const isSuccess = userBid >= valuation.minBid;
  const isClose = !isSuccess && userBid >= valuation.minBid * 0.9;

  const getOutcomeText = () => {
    if (isSuccess) return "낙찰 성공";
    if (isClose) return "근소 차이";
    return "낙찰 실패";
  };

  const getOutcomeColor = () => {
    if (isSuccess) return "text-[hsl(var(--accent-green))] dark:text-[hsl(var(--accent-green))]";
    if (isClose) return "text-[hsl(var(--accent-amber))] dark:text-[hsl(var(--accent-amber))]";
    return "text-red-600 dark:text-red-400";
  };

  // FMV 대비 비율 계산
  const calculateFmvRatio = (amount: number): number => {
    if (valuation.adjustedFMV === 0) return 0;
    return (amount / valuation.adjustedFMV) * 100;
  };

  // 권장입찰가 중간값 계산
  const recommendedBidMid =
    (valuation.recommendedBidRange.min + valuation.recommendedBidRange.max) / 2;

  // 입찰가가 권장 범위 내 위치 판단
  const getBidPosition = () => {
    if (userBid < valuation.recommendedBidRange.min) return "권장 범위 미만";
    if (userBid > valuation.recommendedBidRange.max) return "권장 범위 초과";
    if (userBid < recommendedBidMid) return "권장 범위 하단";
    if (userBid > recommendedBidMid) return "권장 범위 상단";
    return "권장 범위 중간";
  };

  // 초기 안전마진을 백분율로 변환
  const initialSafetyMarginPercent = profit.initialSafetyMargin * 100;

  return (
    <SectionCard title="경매 분석 상세 리포트">
      <div className="space-y-6">
        {/* 브랜드 메시지 */}
        <div className="p-4 rounded-lg bg-[hsl(var(--accent-blue))]/10 dark:bg-[hsl(var(--accent-blue))]/20 border border-[hsl(var(--accent-blue))]/30">
          <p className="text-sm text-gray-700 dark:text-gray-300 italic">
            &quot;사실을 이해하셨습니다. 이제 분석을 시작할 준비가 되셨나요?&quot;
          </p>
        </div>

        {/* Part 1: Result Summary */}
        <div className="space-y-4 pb-4 border-b">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            [Part 1] Result Summary
          </h3>
          <div className="space-y-3">
            <DataRow label="내 입찰가" value={userBid} type="currency" />
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400 font-[var(--font-noto-sans-kr)]">
                결과
              </span>
              <span className={`font-semibold font-[var(--font-noto-sans-kr)] ${getOutcomeColor()}`}>
                {getOutcomeText()}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400 font-[var(--font-noto-sans-kr)]">
                입찰 등급
              </span>
              <Badge type="grade" value={summary.grade} />
            </div>
            {scoreBreakdown && (
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600 dark:text-gray-400 font-[var(--font-noto-sans-kr)]">
                  최종 점수
                </span>
                <span className="numeric-highlight font-semibold font-[var(--font-noto-sans-kr)]">
                  {scoreBreakdown.finalScore} / 1000
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Part 2: 입찰 포지션 분석 */}
        <div className="space-y-4 pb-4 border-b">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            [Part 2] 입찰 포지션 분석
          </h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-[var(--font-noto-sans-kr)]">기준</TableHead>
                  <TableHead className="text-right font-[var(--font-noto-sans-kr)]">금액</TableHead>
                  <TableHead className="text-right font-[var(--font-noto-sans-kr)]">FMV 대비</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-[var(--font-noto-sans-kr)]">최저입찰가</TableCell>
                  <TableCell className="text-right font-[var(--font-noto-sans-kr)]">
                    {formatCurrency(valuation.minBid)}
                  </TableCell>
                  <TableCell className="text-right font-[var(--font-noto-sans-kr)]">
                    {formatPercentage(calculateFmvRatio(valuation.minBid), 1)}%
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-[var(--font-noto-sans-kr)]">권장가(하단)</TableCell>
                  <TableCell className="text-right font-[var(--font-noto-sans-kr)]">
                    {formatCurrency(valuation.recommendedBidRange.min)}
                  </TableCell>
                  <TableCell className="text-right font-[var(--font-noto-sans-kr)]">
                    {formatPercentage(calculateFmvRatio(valuation.recommendedBidRange.min), 1)}%
                  </TableCell>
                </TableRow>
                <TableRow className="bg-blue-50 dark:bg-blue-950/20">
                  <TableCell className="font-semibold font-[var(--font-noto-sans-kr)]">
                    내 입찰가
                  </TableCell>
                  <TableCell className="text-right font-semibold font-[var(--font-noto-sans-kr)]">
                    {formatCurrency(userBid)}
                  </TableCell>
                  <TableCell className="text-right font-semibold font-[var(--font-noto-sans-kr)]">
                    {formatPercentage(calculateFmvRatio(userBid), 1)}%
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-[var(--font-noto-sans-kr)]">권장가(상단)</TableCell>
                  <TableCell className="text-right font-[var(--font-noto-sans-kr)]">
                    {formatCurrency(valuation.recommendedBidRange.max)}
                  </TableCell>
                  <TableCell className="text-right font-[var(--font-noto-sans-kr)]">
                    {formatPercentage(calculateFmvRatio(valuation.recommendedBidRange.max), 1)}%
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-[var(--font-noto-sans-kr)]">FMV</TableCell>
                  <TableCell className="text-right font-[var(--font-noto-sans-kr)]">
                    {formatCurrency(valuation.adjustedFMV)}
                  </TableCell>
                  <TableCell className="text-right font-[var(--font-noto-sans-kr)]">100.0%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            입찰 포지션: {getBidPosition()}
          </p>
        </div>

        {/* Part 3: 점수 구조 상세 (ScoreBreakdown 있을 때만) */}
        {scoreBreakdown && (
          <div className="space-y-4 pb-4 border-b">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              [Part 3] 점수 구조 상세
            </h3>
            <div className="space-y-3">
              <DataRow
                label="정확성 점수"
                value={`${scoreBreakdown.accuracyScore} / 400`}
                type="text"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                권장입찰가 중간값 대비 편차를 측정합니다. 입찰가가 권장 범위에 가까울수록 높은 점수를
                받습니다.
              </p>
              <DataRow
                label="수익성 점수"
                value={`${scoreBreakdown.profitabilityScore} / 400`}
                type="text"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                12개월 ROI를 기반으로 계산되며, 안전마진과 수익분기점에 대한 보너스가 포함됩니다.
              </p>
              <DataRow
                label="안정성 점수"
                value={`${scoreBreakdown.riskControlScore} / 200`}
                type="text"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                권리 부담, 명도 위험도, 명도 비용을 종합하여 평가합니다. 리스크가 낮을수록 높은 점수를
                받습니다.
              </p>
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600 dark:text-gray-400 font-[var(--font-noto-sans-kr)]">
                    최종 점수
                  </span>
                  <span className="numeric-highlight font-semibold font-[var(--font-noto-sans-kr)]">
                    {scoreBreakdown.finalScore} / 1000
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600 dark:text-gray-400 font-[var(--font-noto-sans-kr)]">
                    등급
                  </span>
                  <Badge type="grade" value={scoreBreakdown.grade} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Part 4: 입찰 전략 개선 포인트 */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            [Part 4] 입찰 전략 개선 포인트
          </h3>

          {/* 안전마진 보너스 분석 */}
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              안전마진 보너스 분석
            </h4>
            <div className="pl-4 space-y-2 border-l-2 border-gray-200 dark:border-gray-700">
              <DataRow
                label="초기 안전마진"
                value={initialSafetyMarginPercent}
                type="percentage"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                FMV 대비 초기 안전마진이 높을수록 수익성 점수에 보너스가 추가됩니다. 현재 안전마진은{" "}
                {initialSafetyMarginPercent >= 10
                  ? "양호한 수준"
                  : initialSafetyMarginPercent >= 5
                    ? "보통 수준"
                    : "낮은 수준"}
                입니다.
              </p>
            </div>
          </div>

          {/* 권장입찰가 보너스 분석 */}
          <div className="space-y-3 pt-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              권장입찰가 보너스 분석
            </h4>
            <div className="pl-4 space-y-2 border-l-2 border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                입찰 포지션: <span className="font-semibold">{getBidPosition()}</span>
              </p>
              {userBid < valuation.recommendedBidRange.min ? (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  입찰가가 권장 범위보다 낮습니다. 정확성 점수 향상을 위해 권장 범위 내 입찰을 고려해보세요.
                </p>
              ) : userBid > valuation.recommendedBidRange.max ? (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  입찰가가 권장 범위를 초과했습니다. 과입찰 위험이 있으니 주의가 필요합니다.
                </p>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  입찰가가 권장 범위 내에 있어 정확성 점수에 긍정적으로 기여합니다.
                </p>
              )}
            </div>
          </div>

          {/* 위험도 패널티 분석 */}
          {summary.riskLabel && (
            <div className="space-y-3 pt-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                위험도 패널티 분석
              </h4>
              <div className="pl-4 space-y-2 border-l-2 border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  리스크 라벨: <span className="font-semibold">{summary.riskLabel}</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {summary.riskLabel.includes("임차인") ||
                  summary.riskLabel.includes("전세") ||
                  summary.riskLabel.includes("권리")
                    ? `${summary.riskLabel} 리스크가 안정성 점수에 영향을 미칩니다. 명도 비용과 권리 부담을 고려한 입찰 전략이 필요합니다.`
                    : `${summary.riskLabel} 리스크를 고려하여 안정성 점수가 조정되었습니다.`}
                </p>
              </div>
            </div>
          )}

          {/* 개선 제안 메시지 */}
          <div className="pt-4 border-t">
            <div className="p-4 rounded-lg bg-[hsl(var(--accent-blue))]/5 dark:bg-[hsl(var(--accent-blue))]/10 border border-[hsl(var(--accent-blue))]/20">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                개선 제안
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                당신의 입찰 전략을 개선할 수 있는 포인트입니다. 다음 입찰에서는 권장 범위 내에서
                안전마진을 고려한 입찰가를 제시하고, 리스크 요소를 충분히 분석한 후 결정하시기
                바랍니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
