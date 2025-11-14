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
 * - 난이도별 색상: Easy(브랜드 Green), Normal(브랜드 Amber), Hard(Red)
 * - 등급별 색상: S(Purple), A(브랜드 Blue), B(브랜드 Green), C(브랜드 Amber), D(Red)
 *
 * 브랜드 통합:
 * - Design System v2.2: 브랜드 Accent Colors 사용
 * - Green: Easy 난이도, B 등급 (성장 Growth)
 * - Amber: Normal 난이도, C 등급 (경고/학습 시그널)
 * - Blue: A 등급 (Financial clarity 핵심)
 *
 * @dependencies
 * - tailwindcss: 브랜드 Accent Colors (accent-green, accent-amber, accent-blue)
 *
 * @see {@link /docs/product/point-level-system.md} - 등급별 색상 체계
 * @see {@link /docs/system/difficulty-modes.md} - 난이도 설명
 * @see {@link /docs/ui/design-system.md} - 브랜드 Accent Colors 사용 규칙
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
          // 브랜드 Accent Green 사용
          return "bg-[hsl(var(--accent-green))]/10 text-[hsl(var(--accent-green))] dark:bg-[hsl(var(--accent-green))]/20 dark:text-[hsl(var(--accent-green))]";
        case "normal":
          // 브랜드 Accent Amber 사용
          return "bg-[hsl(var(--accent-amber))]/10 text-[hsl(var(--accent-amber))] dark:bg-[hsl(var(--accent-amber))]/20 dark:text-[hsl(var(--accent-amber))]";
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
          // 브랜드 Accent Blue 사용 (Financial clarity 핵심)
          return "bg-[hsl(var(--accent-blue))]/10 text-[hsl(var(--accent-blue))] dark:bg-[hsl(var(--accent-blue))]/20 dark:text-[hsl(var(--accent-blue))]";
        case "B":
          // 브랜드 Accent Green 사용 (성장 Growth)
          return "bg-[hsl(var(--accent-green))]/10 text-[hsl(var(--accent-green))] dark:bg-[hsl(var(--accent-green))]/20 dark:text-[hsl(var(--accent-green))]";
        case "C":
          // 브랜드 Accent Amber 사용 (경고/학습 시그널)
          return "bg-[hsl(var(--accent-amber))]/10 text-[hsl(var(--accent-amber))] dark:bg-[hsl(var(--accent-amber))]/20 dark:text-[hsl(var(--accent-amber))]";
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
