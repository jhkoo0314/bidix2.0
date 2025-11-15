/**
 * @file QuickFacts.tsx
 * @description 입찰 페이지 핵심 정보 컴포넌트
 *
 * 주요 기능:
 * 1. FMV(adjustedFMV) 표시 - 조정된 시장가
 * 2. minBid 표시 - 최저 입찰가
 * 3. exitPrice 3/6/12개월 표시 (v2.2 핵심 변경) - 보유기간별 예상 매각가
 *
 * 핵심 구현 로직:
 * - Valuation 타입 사용 (엔진 타입 직접 사용, DTO/Adapter 생성 금지)
 * - exitPrice 객체 구조 (3m/6m/12m) 반영
 * - DataRow 컴포넌트를 통한 Numeric Highlight 스타일 적용
 * - 브랜드 보이스 가이드 준수 (멘토 톤 메시지)
 *
 * 브랜드 통합:
 * - 브랜드 메시지: "당신은 이미 충분히 공부했습니다. 이제 경험할 차례입니다."
 * - Design System v2.2: Numeric Highlight 스타일 (currency 타입)
 * - Layout Rules: 간격 넓게, 경계 옅게
 *
 * @dependencies
 * - @/lib/types: Valuation 타입 (SSOT)
 * - @/components/common/DataRow: 데이터 행 (Numeric Highlight 적용)
 * - @/components/common/SectionCard: 섹션 카드
 *
 * @see {@link /docs/ui/component-spec.md} - QuickFacts Props 명세 (v2.2)
 * @see {@link /docs/engine/json-schema.md} - Valuation 타입 구조 (exitPrice_3m/6m/12m)
 * @see {@link /docs/ui/design-system.md} - Numeric Highlight 규칙
 * @see {@link /docs/product/prdv2.md} - 브랜드 보이스 가이드
 */

import { Valuation } from "@/lib/types";
import { SectionCard } from "@/components/common/SectionCard";
import { DataRow } from "@/components/common/DataRow";

export interface QuickFactsProps {
  valuation: Valuation;
}

export function QuickFacts({ valuation }: QuickFactsProps) {
  console.group("QuickFacts Component");
  console.log("Valuation data:", {
    adjustedFMV: valuation.adjustedFMV,
    minBid: valuation.minBid,
    exitPrice: valuation.exitPrice,
  });
  console.groupEnd();

  return (
    <SectionCard title="핵심 정보">
      <div className="space-y-4">
        {/* 브랜드 메시지 */}
        <div className="mb-4 pb-4 border-b">
          <p className="text-sm text-gray-600 dark:text-gray-400 italic">
            당신은 이미 충분히 공부했습니다. 이제 경험할 차례입니다.
          </p>
        </div>

        {/* 조정된 시세 및 최저 입찰가 */}
        <DataRow
          label="조정된 시세"
          value={valuation.adjustedFMV}
          type="currency"
          tooltipMessage="현재 시장가 기준 판단 정확도입니다."
        />
        <DataRow
          label="최저 입찰가"
          value={valuation.minBid}
          type="currency"
          tooltipMessage="최저 입찰가입니다. 이 금액 이상 입찰해야 합니다."
        />

        {/* 보유기간별 예상 매각가 */}
        <div className="pt-4 border-t">
          <p className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
            예상 매각가 (보유기간별)
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            각 보유기간 후 예상되는 매각가입니다. 이 데이터는 수익 계산의 기준이 됩니다.
          </p>
          <div className="space-y-2">
            <DataRow
              label="3개월 후 예상 매각가"
              value={valuation.exitPrice["3m"]}
              type="currency"
              tooltipMessage="3개월 후 예상 매각가입니다."
            />
            <DataRow
              label="6개월 후 예상 매각가"
              value={valuation.exitPrice["6m"]}
              type="currency"
              tooltipMessage="6개월 후 예상 매각가입니다."
            />
            <DataRow
              label="12개월 후 예상 매각가"
              value={valuation.exitPrice["12m"]}
              type="currency"
              tooltipMessage="12개월 후 예상 매각가입니다."
            />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

