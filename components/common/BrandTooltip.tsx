/**
 * @file BrandTooltip.tsx
 * @description 브랜드 스타일이 적용된 Tooltip 래퍼 컴포넌트
 *
 * 주요 기능:
 * 1. shadcn/ui Tooltip을 브랜드 스타일로 래핑
 * 2. 브랜드 메시지를 표시하는 미세툴팁 제공
 * 3. 소극적 강조, 낮은 채도, 부드러운 애니메이션 적용
 *
 * 핵심 구현 로직:
 * - shadcn/ui Tooltip 컴포넌트를 래핑하여 브랜드 스타일 적용
 * - 브랜드 Accent Color (blue) 사용
 * - 부드러운 애니메이션 및 낮은 채도 적용
 * - 접근성 고려 (키보드 네비게이션, ARIA 라벨)
 *
 * 브랜드 통합:
 * - Design System v2.2: 인터랙션 규칙 준수
 * - 브랜드 보이스: "이 값은 시세 대비 정확도를 의미합니다." 스타일 메시지
 * - 소극적 강조: 낮은 채도, 부드러운 transition
 *
 * @dependencies
 * - @/components/ui/tooltip: shadcn/ui Tooltip 컴포넌트
 *
 * @see {@link /docs/ui/design-system.md} - 인터랙션 규칙 (Section 7)
 * @see {@link /docs/product/prdv2.md} - 브랜드 보이스 가이드
 */

"use client";

import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface BrandTooltipProps {
  /** 브랜드 메시지 내용 */
  content: string;
  /** Tooltip이 적용될 자식 요소 */
  children: React.ReactNode;
  /** Tooltip 위치 */
  side?: "top" | "bottom" | "left" | "right";
  /** 추가 클래스명 */
  className?: string;
  /** 지연 시간 (ms) */
  delayDuration?: number;
}

/**
 * 브랜드 스타일이 적용된 Tooltip 컴포넌트
 *
 * 브랜드 원칙:
 * - 소극적 강조: 낮은 채도, 부드러운 애니메이션
 * - 브랜드 메시지: "이 값은 시세 대비 정확도를 의미합니다." 스타일
 * - 브랜드 Accent Color (blue) 사용
 */
export function BrandTooltip({
  content,
  children,
  side = "top",
  className,
  delayDuration = 300,
}: BrandTooltipProps) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          className={cn(
            "bg-[hsl(var(--accent-blue))] text-white text-sm px-3 py-2 rounded-md shadow-lg",
            "border-0",
            "max-w-xs text-balance",
            "font-[var(--font-noto-sans-kr)]",
            className
          )}
          sideOffset={8}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

