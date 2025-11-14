/**
 * @file BidOutcomeBlock.tsx
 * @description 입찰 결과 블록 컴포넌트
 *
 * 주요 기능:
 * 1. 입찰 성공/실패/근접 표시
 * 2. 등급 표시 (S/A/B/C/D)
 * 3. isProfitable3m/6m/12m 표시
 * 4. 브랜드 메시지 표시
 *
 * 핵심 구현 로직:
 * - AuctionSummary와 userBid 비교
 * - 등급별 색상 적용
 * - brand-story.md의 브랜드 메시지 반영 (시나리오 2)
 *
 * @dependencies
 * - @/lib/types: AuctionSummary 타입
 * - @/components/common/Badge: 등급 배지
 *
 * @see {@link /docs/ui/component-spec.md} - BidOutcomeBlock Props 명세
 * @see {@link /docs/product/brand-story.md} - 브랜드 스토리 및 메시지
 */

import { AuctionSummary } from "@/lib/types";
import { Badge } from "@/components/common/Badge";

export interface BidOutcomeBlockProps {
  summary: AuctionSummary;
  userBid: number;
  minBid: number;
}

export function BidOutcomeBlock({
  summary,
  userBid,
  minBid,
}: BidOutcomeBlockProps) {
  const isSuccess = userBid >= minBid;
  const isClose = !isSuccess && userBid >= minBid * 0.9;

  // 실패 시 적정가 대비 차이 계산
  const bidDifferencePercent = isSuccess
    ? 0
    : ((minBid - userBid) / minBid) * 100;

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
          <span className="text-blue-600 dark:text-blue-400">
            실패는 비용이 아니라 자산입니다.
          </span>
        </p>
      </div>
    );
  };

  return (
    <div className="p-6 border rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">입찰 결과</h2>
        <Badge type="grade" value={summary.grade} />
      </div>

      <div
        className={`p-4 rounded-lg ${
          isSuccess
            ? "bg-green-50 dark:bg-green-950"
            : isClose
            ? "bg-yellow-50 dark:bg-yellow-950"
            : "bg-red-50 dark:bg-red-950"
        }`}
      >
        <p className="text-lg font-medium">{getOutcomeMessage()}</p>
        {getFailureAnalysis()}
      </div>

      <div className="pt-4 border-t">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          수익성: {summary.isProfitable ? "✅ 수익 가능" : "❌ 손실 가능"}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          최적 보유기간: {summary.bestHoldingPeriod}개월
        </p>
      </div>
    </div>
  );
}

