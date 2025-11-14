/**
 * @file BidGuidanceBox.tsx
 * @description 입찰 가이드 박스 컴포넌트
 *
 * 주요 기능:
 * 1. 안전마진 설명 - adjustedFMV와 minBid 차이를 안전마진으로 설명
 * 2. 권장 입찰가 범위 표시 - recommendedBidRange 기반
 * 3. 가이드 메시지 제공 - 브랜드 톤의 멘토 메시지
 *
 * 핵심 구현 로직:
 * - Valuation 타입 사용 (엔진 타입 직접 사용)
 * - 안전마진 계산: adjustedFMV - minBid
 * - 브랜드 Accent Color 적용 (Blue - Financial clarity)
 * - 브랜드 보이스 가이드 준수
 *
 * 브랜드 통합:
 * - 브랜드 메시지: "안전마진은 실패를 허용하는 공간입니다."
 * - 브랜드 메시지: "이 범위는 데이터 기반 권장사항입니다."
 * - Design System v2.2: accent-blue 색상 사용
 * - Layout Rules: 간격 넓게, 경계 옅게
 *
 * @dependencies
 * - @/lib/types: Valuation 타입 (SSOT)
 * - @/components/common/SectionCard: 섹션 카드
 * - @/components/common/DataRow: 데이터 행 (금액 표시)
 *
 * @see {@link /docs/ui/component-spec.md} - BidGuidanceBox Props 명세 (v2.2)
 * @see {@link /docs/ui/design-system.md} - Color Tokens (accent-blue)
 * @see {@link /docs/product/prdv2.md} - 브랜드 보이스 DO's/DON'Ts
 */

import { Valuation } from "@/lib/types";
import { SectionCard } from "@/components/common/SectionCard";
import { DataRow } from "@/components/common/DataRow";

export interface BidGuidanceBoxProps {
  valuation: Valuation;
}

export function BidGuidanceBox({ valuation }: BidGuidanceBoxProps) {
  const { min, max } = valuation.recommendedBidRange;
  
  // 안전마진 계산: adjustedFMV - minBid
  const safetyMargin = valuation.adjustedFMV - valuation.minBid;
  const safetyMarginPercent = (safetyMargin / valuation.adjustedFMV) * 100;

  console.group("BidGuidanceBox Component");
  console.log("Recommended bid range:", { min, max });
  console.log("Safety margin:", {
    amount: safetyMargin,
    percent: safetyMarginPercent.toFixed(2) + "%",
  });
  console.groupEnd();

  return (
    <SectionCard title="입찰 가이드">
      <div className="space-y-6">
        {/* 브랜드 메시지 */}
        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-gray-700 dark:text-gray-300 italic">
            안전마진은 실패를 허용하는 공간입니다.
          </p>
        </div>

        {/* 안전마진 설명 */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            안전마진
          </h4>
          <div className="space-y-2">
            <DataRow
              label="안전마진 금액"
              value={safetyMargin}
              type="currency"
            />
            <DataRow
              label="안전마진 비율"
              value={safetyMarginPercent}
              type="percentage"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            조정된 시세와 최저 입찰가의 차이입니다. 이 공간이 클수록 입찰 실패 시에도
            손실을 최소화할 수 있습니다.
          </p>
        </div>

        {/* 권장 입찰가 범위 */}
        <div className="space-y-3 pt-4 border-t">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            권장 입찰가 범위
          </h4>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-base font-semibold text-blue-700 dark:text-blue-300 mb-2">
              {min.toLocaleString()}원 ~ {max.toLocaleString()}원
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              이 범위는 데이터 기반 권장사항입니다. 안전마진과 수익 가능성을 고려하여
              계산되었습니다.
            </p>
          </div>
        </div>

        {/* 가이드 포인트 */}
        <div className="space-y-2 pt-2 border-t">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            입찰 시 고려사항
          </p>
          <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>권장 범위 내 입찰 시 수익 가능성이 높습니다.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>안전마진을 충분히 확보하면 리스크를 줄일 수 있습니다.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>최저 입찰가 미만으로는 입찰할 수 없습니다.</span>
            </li>
          </ul>
        </div>
      </div>
    </SectionCard>
  );
}

