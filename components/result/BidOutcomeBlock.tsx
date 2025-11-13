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
 * - prdv2.md의 브랜드 메시지 반영
 *
 * @dependencies
 * - @/lib/types: AuctionSummary 타입
 * - @/components/common/Badge: 등급 배지
 *
 * @see {@link /docs/ui/component-spec.md} - BidOutcomeBlock Props 명세
 * @see {@link /docs/product/prdv2.md} - 브랜드 메시지
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

  const getOutcomeMessage = () => {
    if (isSuccess) {
      return "축하합니다! 입찰에 성공하셨습니다.";
    }
    if (isClose) {
      return "입찰에 실패하셨지만, 근소한 차이였습니다.";
    }
    return "입찰에 실패하셨습니다. 하지만 괜찮으니 이게 바로 BIDIX가 존재하는 이유입니다.";
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

