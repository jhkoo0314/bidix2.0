/**
 * @file DataRow.tsx
 * @description 데이터 행 컴포넌트
 *
 * 주요 기능:
 * 1. 레이블과 값을 쌍으로 표시
 * 2. 타입별 포맷팅 (텍스트/통화/백분율)
 *
 * 핵심 구현 로직:
 * - currency: toLocaleString() 적용 + Numeric Highlight 스타일
 * - percentage: % 기호 추가 + Numeric Highlight 스타일
 * - text: 그대로 표시
 *
 * 브랜드 통합:
 * - Design System v2.2: Numeric Highlight 스타일 적용 (currency/percentage)
 * - 점수/금액/ROI는 두껍고 선명하게 표시
 *
 * @dependencies
 * - tailwindcss: numeric-highlight 유틸리티 클래스
 *
 * @see {@link /docs/ui/design-system.md} - 금액 표시 포맷팅 규칙 및 Numeric Highlight
 * @see {@link /app/globals.css} - .numeric-highlight 유틸리티 클래스 정의
 */

export interface DataRowProps {
  label: string;
  value: string | number;
  type?: "text" | "currency" | "percentage";
}

export function DataRow({ label, value, type = "text" }: DataRowProps) {
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

  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-gray-600 dark:text-gray-400 font-[var(--font-noto-sans-kr)]">{label}</span>
      <span
        className={`font-[var(--font-noto-sans-kr)] ${shouldHighlight ? "numeric-highlight" : "font-semibold"}`}
      >
        {formatValue()}
      </span>
    </div>
  );
}
