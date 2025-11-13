/**
 * @file SectionCard.tsx
 * @description 섹션 카드 컴포넌트
 *
 * 주요 기능:
 * 1. 콘텐츠를 카드 형태로 감싸기
 * 2. 선택적 제목 표시
 *
 * 핵심 구현 로직:
 * - shadcn/ui Card 컴포넌트 사용
 * - 제목이 있으면 헤더 표시
 *
 * @dependencies
 * - @/components/ui/card: shadcn 카드 컴포넌트
 *
 * @see {@link /docs/ui/design-system.md} - UI/UX 디자인 토큰
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface SectionCardProps {
  children: React.ReactNode;
  title?: string;
}

export function SectionCard({ children, title }: SectionCardProps) {
  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  );
}

