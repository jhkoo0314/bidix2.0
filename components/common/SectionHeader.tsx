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
 * 브랜드 통합:
 * - Design System v2.2: Typography 규칙 준수
 * - Heading 폰트: Inter / Poppins (기하학적, 안정감)
 * - Body 폰트: Pretendard / Noto Sans KR (높은 가독성)
 * - 브랜드 문구 스타일: 넓은 letter-spacing + 얇은 weight (선택적)
 *
 * @dependencies
 * - tailwindcss: 스타일링
 * - 브랜드 Typography: Heading은 Inter/Poppins, Body는 Pretendard/Noto Sans KR
 *
 * @see {@link /docs/ui/design-system.md} - UI/UX 디자인 토큰 및 Typography 규칙
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
        <p className="text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

