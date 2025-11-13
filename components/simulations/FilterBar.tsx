/**
 * @file FilterBar.tsx
 * @description 필터 바 컴포넌트 (Client Component)
 *
 * 주요 기능:
 * 1. 난이도별 필터링 (All / Easy / Normal / Hard)
 * 2. 매물 타입별 필터링
 * 3. 지역별 필터링 (선택적)
 * 4. 필터 상태를 URL query에 반영
 *
 * 핵심 구현 로직:
 * - Client Component로 구현
 * - 필터 변경 시 즉시 반영
 * - URL query 파라미터 사용
 *
 * @dependencies
 * - react: useState, useEffect
 * - next/navigation: useRouter, useSearchParams
 *
 * @see {@link /docs/system/difficulty-modes.md} - 난이도 설명
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export interface FilterState {
  difficulty?: "easy" | "normal" | "hard";
  type?: string;
  region?: string;
}

export interface FilterBarProps {
  onFilterChange: (filters: FilterState) => void;
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>({
    difficulty: searchParams.get("difficulty") as FilterState["difficulty"],
    type: searchParams.get("type") || undefined,
    region: searchParams.get("region") || undefined,
  });

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleDifficultyChange = (difficulty: FilterState["difficulty"]) => {
    const newFilters = { ...filters, difficulty };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const updateURL = (newFilters: FilterState) => {
    const params = new URLSearchParams();
    if (newFilters.difficulty) {
      params.set("difficulty", newFilters.difficulty);
    }
    if (newFilters.type) {
      params.set("type", newFilters.type);
    }
    if (newFilters.region) {
      params.set("region", newFilters.region);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <div>
        <p className="text-sm font-semibold mb-2">난이도</p>
        <div className="flex gap-2">
          <Button
            variant={filters.difficulty === undefined ? "default" : "outline"}
            size="sm"
            onClick={() => handleDifficultyChange(undefined)}
          >
            전체
          </Button>
          <Button
            variant={filters.difficulty === "easy" ? "default" : "outline"}
            size="sm"
            onClick={() => handleDifficultyChange("easy")}
          >
            🟢 Easy
          </Button>
          <Button
            variant={filters.difficulty === "normal" ? "default" : "outline"}
            size="sm"
            onClick={() => handleDifficultyChange("normal")}
          >
            🟡 Normal
          </Button>
          <Button
            variant={filters.difficulty === "hard" ? "default" : "outline"}
            size="sm"
            onClick={() => handleDifficultyChange("hard")}
          >
            🔴 Hard
          </Button>
        </div>
      </div>
      {/* TODO: 매물 타입 필터, 지역 필터 추가 */}
    </div>
  );
}

