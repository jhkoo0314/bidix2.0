/**
 * @file HistoryPagination.tsx
 * @description 히스토리 페이지네이션 컴포넌트 (Client Component)
 *
 * 주요 기능:
 * 1. "더보기" 버튼 표시
 * 2. nextCursor 기반 페이지네이션
 *
 * 핵심 구현 로직:
 * - Client Component로 구현
 * - nextCursor가 있으면 "더보기" 버튼 표시
 * - 클릭 시 다음 페이지 로드
 *
 * 브랜드 통합:
 * - Design System v2.2: 브랜드 Accent Colors 사용
 *
 * @dependencies
 * - react: useState
 * - @/components/ui/button: 버튼 컴포넌트
 *
 * @see {@link /docs/ui/design-system.md} - 디자인 시스템
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export interface HistoryPaginationProps {
  nextCursor: string | null;
  onLoadMore: (cursor: string) => Promise<void>;
  isLoading?: boolean;
}

export function HistoryPagination({
  nextCursor,
  onLoadMore,
  isLoading = false,
}: HistoryPaginationProps) {
  const [loading, setLoading] = useState(false);

  const handleLoadMore = async () => {
    if (!nextCursor || loading) return;

    setLoading(true);
    try {
      await onLoadMore(nextCursor);
    } finally {
      setLoading(false);
    }
  };

  if (!nextCursor) {
    return null;
  }

  return (
    <div className="flex justify-center pt-8">
      <Button
        onClick={handleLoadMore}
        disabled={loading || isLoading}
        variant="outline"
      >
        {loading || isLoading ? "로딩 중..." : "더보기"}
      </Button>
    </div>
  );
}
