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
 * 브랜드 통합:
 * - Design System v2.2: Layout Rules 준수
 * - 간격은 넓게, 경계는 옅게 (눈이 시리지 않게)
 * - shadcn/ui Card는 이미 브랜드 Color Tokens를 사용하도록 설정됨
 *
 * @dependencies
 * - @/components/ui/card: shadcn 카드 컴포넌트 (브랜드 Color Tokens 적용됨)
 *
 * @see {@link /docs/ui/design-system.md} - UI/UX 디자인 토큰 및 Layout Rules
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

