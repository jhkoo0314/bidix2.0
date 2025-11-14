/**
 * @file MetricsStrip.tsx
 * @description 핵심 지표 스트립 컴포넌트
 *
 * 주요 기능:
 * 1. 초기 안전마진 표시
 * 2. 최적 ROI 표시 (3/6/12개월 중 최고값)
 * 3. 최종 점수 표시
 * 4. 점수 구성 상세 (접기/펼치기)
 *
 * 핵심 구현 로직:
 * - Profit의 initialSafetyMargin 사용
 * - Profit의 scenarios[]에서 최고 ROI 추출
 * - ScoreBreakdown의 finalScore 사용
 *
 * @dependencies
 * - @/lib/types: Profit, ScoreBreakdown 타입
 * - @/components/common/SectionCard: 섹션 카드
 *
 * @see {@link /docs/ui/component-spec.md} - MetricsStrip Props 명세
 * @see {@link /docs/product/point-level-system.md} - 점수 계산 공식
 * @see {@link /docs/product/brand-story.md} - 브랜드 메시지 (정확성/수익성/안정성)
 */

"use client";

import { useState } from "react";
import { Profit } from "@/lib/types";
import { ScoreBreakdown } from "@/lib/engines/scoreengine";
import { SectionCard } from "@/components/common/SectionCard";
import { Badge } from "@/components/common/Badge";

export interface MetricsStripProps {
  profit: Profit;
  score: ScoreBreakdown;
}

export function MetricsStrip({ profit, score }: MetricsStripProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // scenarios 객체에서 최고 ROI 찾기
  const scenariosArray = [
    profit.scenarios["3m"],
    profit.scenarios["6m"],
    profit.scenarios["12m"],
  ];
  const bestScenario = scenariosArray.reduce((best, current) =>
    current.roi > best.roi ? current : best
  );

  return (
    <SectionCard title="핵심 지표">
      <div className="space-y-6">
        {/* 3개 주요 지표 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              초기 안전마진
            </p>
            <p className="text-2xl font-bold">
              {(profit.initialSafetyMargin * 100).toFixed(2)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">FMV 대비 초기 마진</p>
          </div>

          <div className="p-4 border rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              최적 ROI
            </p>
            <p className="text-2xl font-bold">
              {(bestScenario.roi * 100).toFixed(2)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {bestScenario.months}개월 기준
            </p>
          </div>

          <div className="p-4 border rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              최종 점수
            </p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{score.finalScore}</p>
              <Badge type="grade" value={score.grade} />
            </div>
            <p className="text-xs text-gray-500 mt-1">1000점 만점</p>
          </div>
        </div>

        {/* 점수 구성 상세 (접기/펼치기) */}
        <div className="pt-4 border-t">
          <div className="mb-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              당신의 성장은 느낌이 아니라, 숫자로 증명됩니다.
            </p>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              {isExpanded ? "접기" : "점수 구성 상세 보기"}
            </button>
          </div>
          {isExpanded && (
            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    정확성
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Accuracy Score
                  </p>
                </div>
                <span className="text-sm font-semibold">
                  {score.accuracyScore} / 400
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    수익성
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Profitability Score
                  </p>
                </div>
                <span className="text-sm font-semibold">
                  {score.profitabilityScore} / 400
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    안정성
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Risk Control Score
                  </p>
                </div>
                <span className="text-sm font-semibold">
                  {score.riskControlScore} / 200
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </SectionCard>
  );
}

