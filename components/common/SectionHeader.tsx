/**
 * @file SectionHeader.tsx
 * @description 섹션 헤더 컴포넌트
 *
 * 주요 기능:
 * 1. 섹션 제목 및 설명 표시
 * 2. 일관된 헤더 스타일 제공
 *
 * 핵심 구현 로직:
 * - 제목과 선택적 설명을 받아 표시
 * - Design System v2.2 준수
 *
 * @dependencies
 * - tailwindcss: 스타일링
 *
 * @see {@link /docs/ui/design-system.md} - UI/UX 디자인 토큰
 */

export interface SectionHeaderProps {
  title: string;
  description?: string;
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {description && (
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      )}
    </div>
  );
}

