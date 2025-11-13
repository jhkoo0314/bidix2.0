/**
 * @file Badge.tsx
 * @description 배지 컴포넌트 (난이도/등급 표시)
 *
 * 주요 기능:
 * 1. 난이도 표시 (Easy/Normal/Hard)
 * 2. 등급 표시 (S/A/B/C/D)
 * 3. 색상별 구분
 *
 * 핵심 구현 로직:
 * - 난이도별 색상: Easy(초록), Normal(노랑), Hard(빨강)
 * - 등급별 색상: S(보라), A(파랑), B(초록), C(노랑), D(빨강)
 *
 * @dependencies
 * - tailwindcss: 색상 클래스
 *
 * @see {@link /docs/product/point-level-system.md} - 등급별 색상 체계
 * @see {@link /docs/system/difficulty-modes.md} - 난이도 설명
 */

export interface BadgeProps {
  type: "difficulty" | "grade";
  value: string;
}

export function Badge({ type, value }: BadgeProps) {
  const getColorClass = () => {
    if (type === "difficulty") {
      switch (value.toLowerCase()) {
        case "easy":
          return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
        case "normal":
          return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
        case "hard":
          return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
        default:
          return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      }
    }

    if (type === "grade") {
      switch (value.toUpperCase()) {
        case "S":
          return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
        case "A":
          return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
        case "B":
          return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
        case "C":
          return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
        case "D":
          return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
        default:
          return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      }
    }

    return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorClass()}`}
    >
      {value}
    </span>
  );
}

