/**
 * @file DataRow.tsx
 * @description 데이터 행 컴포넌트
 *
 * 주요 기능:
 * 1. 레이블과 값을 쌍으로 표시
 * 2. 타입별 포맷팅 (텍스트/통화/백분율)
 * 3. 브랜드 메시지 tooltip 제공 (currency/percentage 타입)
 *
 * 핵심 구현 로직:
 * - currency: toLocaleString() 적용 + Numeric Highlight 스타일
 * - percentage: % 기호 추가 + Numeric Highlight 스타일
 * - text: 그대로 표시
 * - currency/percentage 타입에 브랜드 tooltip 추가
 *
 * 브랜드 통합:
 * - Design System v2.2: Numeric Highlight 스타일 적용 (currency/percentage)
 * - 점수/금액/ROI는 두껍고 선명하게 표시
 * - 브랜드 메시지 tooltip: "이 금액은 시세 대비 정확도를 의미합니다."
 *
 * @dependencies
 * - tailwindcss: numeric-highlight 유틸리티 클래스
 * - @/components/common/BrandTooltip: 브랜드 tooltip 컴포넌트
 *
 * @see {@link /docs/ui/design-system.md} - 금액 표시 포맷팅 규칙 및 Numeric Highlight
 * @see {@link /app/globals.css} - .numeric-highlight 유틸리티 클래스 정의
 */

import { BrandTooltip } from "./BrandTooltip";

export interface DataRowProps {
  label: string;
  value: string | number;
  type?: "text" | "currency" | "percentage";
  /** 브랜드 메시지 tooltip (선택적, 기본값은 타입별 메시지) */
  tooltipMessage?: string;
}

export function DataRow({
  label,
  value,
  type = "text",
  tooltipMessage,
}: DataRowProps) {
  const formatValue = () => {
    if (type === "currency" && typeof value === "number") {
      return `${value.toLocaleString()}원`;
    }
    if (type === "percentage" && typeof value === "number") {
      return `${value.toFixed(2)}%`;
    }
    return value;
  };

  // currency와 percentage 타입에 Numeric Highlight 스타일 적용
  const shouldHighlight = type === "currency" || type === "percentage";

  // 브랜드 메시지 tooltip 기본값
  const defaultTooltipMessage =
    tooltipMessage ||
    (type === "currency"
      ? "이 금액은 시세 대비 정확도를 의미합니다."
      : type === "percentage"
        ? "이 비율은 시세 대비 정확도를 의미합니다."
        : undefined);

  const valueElement = (
    <span
      className={`font-[var(--font-noto-sans-kr)] ${shouldHighlight ? "numeric-highlight" : "font-semibold"} ${shouldHighlight ? "brand-hover cursor-help" : ""}`}
    >
      {formatValue()}
    </span>
  );

  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-gray-600 dark:text-gray-400 font-[var(--font-noto-sans-kr)]">
        {label}
      </span>
      {defaultTooltipMessage && shouldHighlight ? (
        <BrandTooltip content={defaultTooltipMessage}>
          {valueElement}
        </BrandTooltip>
      ) : (
        valueElement
      )}
    </div>
  );
}
