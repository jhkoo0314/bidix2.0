/**
 * @file BidOutcomeBlock.tsx
 * @description 입찰 결과 블록 컴포넌트
 *
 * 주요 기능:
 * 1. 입찰 성공/실패/근접 표시 - userBid vs minBid 비교
 * 2. 등급 표시 (S/A/B/C/D) - point-level-system.md 기준 색상 적용
 * 3. isProfitable3m/6m/12m 표시 - profit.scenarios 기반 수익성 판단
 * 4. 브랜드 메시지 표시 - "실패는 자산입니다" (브랜드 스토리 시나리오 2)
 *
 * 핵심 구현 로직:
 * - AuctionSummary와 userBid 비교
 * - profit.scenarios의 각 시나리오에서 meetsTargetMargin/meetsTargetROI 기반 수익성 판단
 * - 등급별 색상 적용 (브랜드 Accent Colors)
 * - 브랜드 보이스 가이드 준수 (단호하지만 따뜻하게)
 *
 * 브랜드 통합:
 * - 브랜드 메시지: "실패는 비용이 아니라, 자산입니다."
 * - Accent Colors: Green(성공), Amber(경고/근접), Red(실패)
 * - 등급별 색상: S(purple), A(blue), B(green), C(amber), D(red)
 * - Design System v2.2: 브랜드 Color Tokens 사용
 *
 * @dependencies
 * - @/lib/types: AuctionSummary, Profit 타입 (SSOT)
 * - @/components/common/Badge: 등급 배지 (브랜드 Accent Colors 적용)
 *
 * @see {@link /docs/ui/component-spec.md} - BidOutcomeBlock Props 명세 (v2.2)
 * @see {@link /docs/engine/json-schema.md} - AuctionSummary 타입 구조
 * @see {@link /docs/product/point-level-system.md} - 등급별 색상 체계
 * @see {@link /docs/product/brand-story.md} - 브랜드 메시지 시나리오 2
 * @see {@link /docs/ui/design-system.md} - Accent Colors 사용 규칙
 */

import { AuctionSummary, Profit } from "@/lib/types";
import { Badge } from "@/components/common/Badge";

export interface BidOutcomeBlockProps {
  summary: AuctionSummary;
  userBid: number;
  minBid: number;
  profit: Profit; // isProfitable3m/6m/12m 판단용
}

export function BidOutcomeBlock({
  summary,
  userBid,
  minBid,
  profit,
}: BidOutcomeBlockProps) {
  console.group("BidOutcomeBlock Component");
  console.log("Bid outcome analysis:", {
    userBid,
    minBid,
    isSuccess: userBid >= minBid,
    grade: summary.grade,
    riskLabel: summary.riskLabel,
  });

  const isSuccess = userBid >= minBid;
  const isClose = !isSuccess && userBid >= minBid * 0.9;

  // 실패 시 적정가 대비 차이 계산
  const bidDifferencePercent = isSuccess
    ? 0
    : ((minBid - userBid) / minBid) * 100;

  // isProfitable3m/6m/12m 판단 (profit.scenarios 기반)
  const isProfitable3m =
    profit.scenarios["3m"].meetsTargetMargin ||
    profit.scenarios["3m"].meetsTargetROI;
  const isProfitable6m =
    profit.scenarios["6m"].meetsTargetMargin ||
    profit.scenarios["6m"].meetsTargetROI;
  const isProfitable12m =
    profit.scenarios["12m"].meetsTargetMargin ||
    profit.scenarios["12m"].meetsTargetROI;

  console.log("Profitability by period:", {
    "3m": isProfitable3m,
    "6m": isProfitable6m,
    "12m": isProfitable12m,
  });
  console.groupEnd();

  const getOutcomeMessage = () => {
    if (isSuccess) {
      return "축하합니다! 입찰에 성공하셨습니다.";
    }
    if (isClose) {
      return "입찰에 실패하셨지만, 근소한 차이였습니다.";
    }
    return "낙찰에 실패했습니다. 하지만 괜찮습니다. 이것이 바로 BIDIX가 존재하는 이유입니다.";
  };

  const getFailureAnalysis = () => {
    if (isSuccess || isClose) return null;

    return (
      <div className="mt-4 space-y-2">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          당신의 입찰가는 적정가보다{" "}
          <span className="font-semibold">
            {bidDifferencePercent.toFixed(1)}%
          </span>{" "}
          낮았습니다.
        </p>
        {summary.riskLabel && (
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {summary.riskLabel.includes("임차인") ||
            summary.riskLabel.includes("전세") ||
            summary.riskLabel.includes("권리")
              ? `숨겨진 ${summary.riskLabel} 리스크를 놓쳤습니다.`
              : `${summary.riskLabel} 리스크를 고려하지 않았습니다.`}
          </p>
        )}
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-3">
          이제 이 데이터를 가지고 다시 도전하세요.{" "}
          <span
            className="text-[hsl(var(--accent-blue))] dark:text-[hsl(var(--accent-blue))]"
            style={{ letterSpacing: "0.05em", fontWeight: 300 }}
          >
            실패는 비용이 아니라, 자산입니다.
          </span>
        </p>
      </div>
    );
  };

  // Accent Colors 적용 (브랜드 Design System v2.2)
  const getOutcomeColorClasses = () => {
    if (isSuccess) {
      // Green (성공) - 브랜드 Accent Green
      return "bg-[hsl(var(--accent-green))]/10 border-[hsl(var(--accent-green))]/20 dark:bg-[hsl(var(--accent-green))]/20 dark:border-[hsl(var(--accent-green))]/30";
    }
    if (isClose) {
      // Amber (경고/근접) - 브랜드 Accent Amber
      return "bg-[hsl(var(--accent-amber))]/10 border-[hsl(var(--accent-amber))]/20 dark:bg-[hsl(var(--accent-amber))]/20 dark:border-[hsl(var(--accent-amber))]/30";
    }
    // Red (실패)
    return "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800";
  };

  return (
    <div className="p-6 border rounded-lg space-y-4">
      {/* 브랜드 메시지 섹션 */}
      {!isSuccess && (
        <div className="pb-4 border-b">
          <p
            className="text-sm text-gray-600 dark:text-gray-400 italic"
            style={{ letterSpacing: "0.1em", fontWeight: 300 }}
          >
            실패는 비용이 아니라, 자산입니다.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">입찰 결과</h2>
        <Badge type="grade" value={summary.grade} />
      </div>

      <div className={`p-4 rounded-lg border ${getOutcomeColorClasses()}`}>
        <p className="text-lg font-medium">{getOutcomeMessage()}</p>
        {getFailureAnalysis()}
      </div>

      {/* 수익성 표시 (3m/6m/12m) */}
      <div className="pt-4 border-t">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          보유기간별 수익성
        </p>
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 border rounded text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              3개월
            </p>
            <p className="text-sm font-semibold">
              {isProfitable3m ? "✅ 수익" : "❌ 손실"}
            </p>
          </div>
          <div className="p-2 border rounded text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              6개월
            </p>
            <p className="text-sm font-semibold">
              {isProfitable6m ? "✅ 수익" : "❌ 손실"}
            </p>
          </div>
          <div className="p-2 border rounded text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              12개월
            </p>
            <p className="text-sm font-semibold">
              {isProfitable12m ? "✅ 수익" : "❌ 손실"}
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          최적 보유기간: {summary.bestHoldingPeriod}개월
        </p>
      </div>
    </div>
  );
}

