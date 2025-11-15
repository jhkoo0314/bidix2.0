/**
 * @file BackButton.tsx
 * @description 뒤로가기 버튼 컴포넌트
 *
 * 주요 기능:
 * 1. 브라우저 히스토리 뒤로가기
 * 2. 또는 특정 경로로 이동
 *
 * 핵심 구현 로직:
 * - Client Component (useRouter 사용)
 * - 기본적으로 router.back() 사용
 * - href prop이 제공되면 해당 경로로 이동
 *
 * @dependencies
 * - next/navigation: useRouter
 * - lucide-react: ArrowLeft 아이콘
 * - @/components/ui/button: shadcn 버튼 컴포넌트
 */

"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export function BackButton({ href, label = "뒤로", className }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  if (href) {
    return (
      <Link href={href}>
        <Button
          variant="ghost"
          size="sm"
          className={cn("gap-2 font-[var(--font-noto-sans-kr)]", className)}
        >
          <ArrowLeft className="h-4 w-4" />
          {label}
        </Button>
      </Link>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBack}
      className={cn("gap-2 font-[var(--font-noto-sans-kr)]", className)}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  );
}

