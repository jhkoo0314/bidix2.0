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
 * - 브랜드 통합 디자인 시스템 v2.2 적용
 *
 * 브랜드 통합:
 * - Design System v2.2: 브랜드 Accent Colors 사용
 * - 난이도 필터: Badge 컴포넌트 사용 고려, difficulty-modes.md 설명 반영
 * - Layout Rules: 간격은 넓게, 경계는 옅게
 *
 * @dependencies
 * - react: useState, useEffect
 * - next/navigation: useRouter, useSearchParams
 * - @/components/ui/button: 버튼 컴포넌트
 * - @/components/ui/input: 입력 컴포넌트
 * - @/components/ui/label: 라벨 컴포넌트
 * - @/lib/types: PropertyType enum
 *
 * @see {@link /docs/system/difficulty-modes.md} - 난이도 설명
 * @see {@link /docs/domain/property-types.md} - 매물 타입 설명
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PropertyType } from "@/lib/types";
import { Badge } from "@/components/common/Badge";

export interface FilterState {
  difficulty?: "easy" | "normal" | "hard";
  type?: string;
  region?: string;
}

export interface FilterBarProps {
  onFilterChange: (filters: FilterState) => void;
}

// 매물 타입 한글명 매핑
const PROPERTY_TYPE_LABELS: Record<string, string> = {
  apartment: "아파트",
  villa: "빌라/다세대",
  officetel: "오피스텔",
  multi_house: "다가구주택",
  detached: "단독주택",
  res_land: "대지(주거)",
};

// 주거용 매물 타입만 필터에 표시 (MVP)
const RESIDENTIAL_TYPES: PropertyType[] = [
  PropertyType.Apartment,
  PropertyType.Villa,
  PropertyType.Officetel,
  PropertyType.MultiHouse,
  PropertyType.Detached,
  PropertyType.ResidentialLand,
];

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

  const handleTypeChange = (type: string | undefined) => {
    const newFilters = { ...filters, type };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const handleRegionChange = (region: string) => {
    const newFilters = { ...filters, region: region || undefined };
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
    <div className="p-6 border rounded-lg space-y-6">
      {/* 난이도 필터 */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">난이도</Label>
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
            <span className="text-xs text-muted-foreground ml-1">
              (튜토리얼)
            </span>
          </Button>
          <Button
            variant={filters.difficulty === "normal" ? "default" : "outline"}
            size="sm"
            onClick={() => handleDifficultyChange("normal")}
            className="gap-2"
          >
            <Badge type="difficulty" value="normal" />
            Normal
            <span className="text-xs text-muted-foreground ml-1">
              (일반 연습)
            </span>
          </Button>
          <Button
            variant={filters.difficulty === "hard" ? "default" : "outline"}
            size="sm"
            onClick={() => handleDifficultyChange("hard")}
            className="gap-2"
          >
            <Badge type="difficulty" value="hard" />
            Hard
            <span className="text-xs text-muted-foreground ml-1">
              (고화 챌린지)
            </span>
          </Button>
        </div>
      </div>

      {/* 매물 타입 필터 */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">매물 타입</Label>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filters.type === undefined ? "default" : "outline"}
            size="sm"
            onClick={() => handleTypeChange(undefined)}
          >
            전체
          </Button>
          {RESIDENTIAL_TYPES.map((type) => (
            <Button
              key={type}
              variant={filters.type === type ? "default" : "outline"}
              size="sm"
              onClick={() => handleTypeChange(type)}
            >
              {PROPERTY_TYPE_LABELS[type] || type}
            </Button>
          ))}
        </div>
      </div>

      {/* 지역 필터 */}
      <div>
        <Label htmlFor="region-filter" className="text-sm font-semibold mb-2 block">
          지역 검색
        </Label>
        <Input
          id="region-filter"
          type="text"
          placeholder="지역명을 입력하세요 (예: 서울, 경기, 부천)"
          value={filters.region || ""}
          onChange={(e) => handleRegionChange(e.target.value)}
          className="max-w-md"
        />
      </div>
    </div>
  );
}


