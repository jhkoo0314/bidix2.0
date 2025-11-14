/**
 * @file HistoryFilterBar.tsx
 * @description 히스토리 필터 및 정렬 바 컴포넌트 (Client Component)
 *
 * 주요 기능:
 * 1. 정렬 드롭다운: 최신순 / 점수 높은 순 / 점수 낮은 순
 * 2. 난이도 필터: All / Easy / Normal / Hard
 * 3. 결과 필터: All / 성공 / 실패 / 근소 차이
 * 4. 날짜 범위 필터 (선택적): 최근 7일 / 30일 / 전체
 *
 * 핵심 구현 로직:
 * - Client Component로 구현
 * - 필터/정렬 변경 시 URL query 파라미터 업데이트
 * - 브랜드 통합 디자인 시스템 v2.2 적용
 *
 * 브랜드 통합:
 * - Design System v2.2: 브랜드 Accent Colors 사용
 * - Layout Rules: 간격은 넓게, 경계는 옅게
 *
 * @dependencies
 * - react: useState, useEffect
 * - next/navigation: useRouter, useSearchParams
 * - @/components/ui/button: 버튼 컴포넌트
 * - @/components/common/Badge: 배지 컴포넌트
 *
 * @see {@link /docs/ui/design-system.md} - 디자인 시스템
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/common/Badge";

export interface HistoryFilterState {
  sort?: "newest" | "score_high" | "score_low";
  difficulty?: "easy" | "normal" | "hard";
  outcome?: "win" | "lose" | "overpay";
  dateRange?: "7days" | "30days" | "all";
}

export interface HistoryFilterBarProps {
  onFilterChange?: (filters: HistoryFilterState) => void;
}

export function HistoryFilterBar({ onFilterChange }: HistoryFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<HistoryFilterState>({
    sort: (searchParams.get("sort") as HistoryFilterState["sort"]) || "newest",
    difficulty: searchParams.get("difficulty") as HistoryFilterState["difficulty"] || undefined,
    outcome: searchParams.get("outcome") as HistoryFilterState["outcome"] || undefined,
    dateRange: (searchParams.get("dateRange") as HistoryFilterState["dateRange"]) || "all",
  });

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
    updateURL(filters);
  }, [filters, onFilterChange]);

  const updateURL = (newFilters: HistoryFilterState) => {
    const params = new URLSearchParams();
    if (newFilters.sort && newFilters.sort !== "newest") {
      params.set("sort", newFilters.sort);
    }
    if (newFilters.difficulty) {
      params.set("difficulty", newFilters.difficulty);
    }
    if (newFilters.outcome) {
      params.set("outcome", newFilters.outcome);
    }
    if (newFilters.dateRange && newFilters.dateRange !== "all") {
      params.set("dateRange", newFilters.dateRange);
    }
    router.push(`/history?${params.toString()}`);
  };

  const handleSortChange = (sort: HistoryFilterState["sort"]) => {
    setFilters((prev) => ({ ...prev, sort }));
  };

  const handleDifficultyChange = (difficulty: HistoryFilterState["difficulty"]) => {
    setFilters((prev) => ({ ...prev, difficulty }));
  };

  const handleOutcomeChange = (outcome: HistoryFilterState["outcome"]) => {
    setFilters((prev) => ({ ...prev, outcome }));
  };

  const handleDateRangeChange = (dateRange: HistoryFilterState["dateRange"]) => {
    setFilters((prev) => ({ ...prev, dateRange }));
  };

  return (
    <div className="p-6 border rounded-lg space-y-6">
      {/* 정렬 */}
      <div>
        <label className="text-sm font-semibold mb-3 block">정렬</label>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filters.sort === "newest" ? "default" : "outline"}
            size="sm"
            onClick={() => handleSortChange("newest")}
          >
            최신순
          </Button>
          <Button
            variant={filters.sort === "score_high" ? "default" : "outline"}
            size="sm"
            onClick={() => handleSortChange("score_high")}
          >
            점수 높은 순
          </Button>
          <Button
            variant={filters.sort === "score_low" ? "default" : "outline"}
            size="sm"
            onClick={() => handleSortChange("score_low")}
          >
            점수 낮은 순
          </Button>
        </div>
      </div>

      {/* 난이도 필터 */}
      <div>
        <label className="text-sm font-semibold mb-3 block">난이도</label>
        <div className="flex flex-wrap gap-2">
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
            className="gap-2"
          >
            <Badge type="difficulty" value="easy" />
            Easy
          </Button>
          <Button
            variant={filters.difficulty === "normal" ? "default" : "outline"}
            size="sm"
            onClick={() => handleDifficultyChange("normal")}
            className="gap-2"
          >
            <Badge type="difficulty" value="normal" />
            Normal
          </Button>
          <Button
            variant={filters.difficulty === "hard" ? "default" : "outline"}
            size="sm"
            onClick={() => handleDifficultyChange("hard")}
            className="gap-2"
          >
            <Badge type="difficulty" value="hard" />
            Hard
          </Button>
        </div>
      </div>

      {/* 결과 필터 */}
      <div>
        <label className="text-sm font-semibold mb-3 block">결과</label>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filters.outcome === undefined ? "default" : "outline"}
            size="sm"
            onClick={() => handleOutcomeChange(undefined)}
          >
            전체
          </Button>
          <Button
            variant={filters.outcome === "win" ? "default" : "outline"}
            size="sm"
            onClick={() => handleOutcomeChange("win")}
          >
            ✅ 성공
          </Button>
          <Button
            variant={filters.outcome === "lose" ? "default" : "outline"}
            size="sm"
            onClick={() => handleOutcomeChange("lose")}
          >
            ❌ 실패
          </Button>
          <Button
            variant={filters.outcome === "overpay" ? "default" : "outline"}
            size="sm"
            onClick={() => handleOutcomeChange("overpay")}
          >
            ⚠️ 근소 차이
          </Button>
        </div>
      </div>

      {/* 날짜 범위 필터 */}
      <div>
        <label className="text-sm font-semibold mb-3 block">날짜 범위</label>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filters.dateRange === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => handleDateRangeChange("all")}
          >
            전체
          </Button>
          <Button
            variant={filters.dateRange === "7days" ? "default" : "outline"}
            size="sm"
            onClick={() => handleDateRangeChange("7days")}
          >
            최근 7일
          </Button>
          <Button
            variant={filters.dateRange === "30days" ? "default" : "outline"}
            size="sm"
            onClick={() => handleDateRangeChange("30days")}
          >
            최근 30일
          </Button>
        </div>
      </div>
    </div>
  );
}

