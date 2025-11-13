/**
 * @file DataRow.tsx
 * @description 데이터 행 컴포넌트
 *
 * 주요 기능:
 * 1. 레이블과 값을 쌍으로 표시
 * 2. 타입별 포맷팅 (텍스트/통화/백분율)
 *
 * 핵심 구현 로직:
 * - currency: toLocaleString() 적용
 * - percentage: % 기호 추가
 * - text: 그대로 표시
 *
 * @dependencies
 * - @/lib/utils/number: 숫자 포맷팅 유틸리티
 *
 * @see {@link /docs/ui/design-system.md} - 금액 표시 포맷팅 규칙
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

  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
      <span className="font-semibold">{formatValue()}</span>
    </div>
  );
}

