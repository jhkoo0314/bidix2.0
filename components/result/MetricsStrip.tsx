/**
 * @file MetricsStrip.tsx
 * @description 핵심 지표 스트립 컴포넌트
 *
 * 주요 기능:
 * 1. 초기 안전마진 표시 - profit.initialSafetyMargin (백분율)
 * 2. 최적 ROI 표시 - profit.scenarios 중 최고값 (3/6/12개월)
 * 3. 최종 점수 표시 - score.finalScore (1000점 만점)
 * 4. 점수 구성 상세 (접기/펼치기) - Accuracy/Profitability/Risk Control
 *
 * 핵심 구현 로직:
 * - Profit의 initialSafetyMargin 사용 (백분율 변환)
 * - Profit의 scenarios 객체에서 최고 ROI 추출
 * - ScoreBreakdown의 finalScore 및 세부 점수 사용
 * - DataRow 컴포넌트를 통한 Numeric Highlight 스타일 적용
 * - 브랜드 보이스 가이드 준수
 *
 * 브랜드 통합:
 * - 브랜드 메시지: "당신의 경험은 숫자로 증명됩니다."
 * - 브랜드 메시지: "당신의 안전마진은 X%였습니다." (Data Mapping 규칙)
 * - Design System v2.2: Numeric Highlight 스타일 (Score / ROI / MoS)
 * - 점수/금액/ROI는 두껍고 선명하게 표시
 *
 * @dependencies
 * - @/lib/types: Profit 타입 (SSOT)
 * - @/lib/engines/scoreengine: ScoreBreakdown 타입
 * - @/components/common/SectionCard: 섹션 카드
 * - @/components/common/DataRow: 데이터 행 (Numeric Highlight 적용)
 * - @/components/common/Badge: 등급 배지
 *
 * @see {@link /docs/ui/component-spec.md} - MetricsStrip Props 명세 (v2.2)
 * @see {@link /docs/engine/json-schema.md} - Profit, ScoreBreakdown 타입 구조
 * @see {@link /docs/ui/design-system.md} - Numeric Highlight 규칙
 * @see {@link /docs/product/point-level-system.md} - 점수 계산 공식
 * @see {@link /docs/product/prdv2.md} - 브랜드 보이스 가이드
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

  console.group("MetricsStrip Component");
  console.log("Profit metrics:", {
    initialSafetyMargin: profit.initialSafetyMargin,
    scenarios: profit.scenarios,
  });
  console.log("Score breakdown:", {
    finalScore: score.finalScore,
    grade: score.grade,
    accuracyScore: score.accuracyScore,
    profitabilityScore: score.profitabilityScore,
    riskControlScore: score.riskControlScore,
  });

  // scenarios 객체에서 최고 ROI 찾기
  const scenariosArray = [
    profit.scenarios["3m"],
    profit.scenarios["6m"],
    profit.scenarios["12m"],
  ];
  const bestScenario = scenariosArray.reduce((best, current) =>
    current.roi > best.roi ? current : best
  );

  console.log("Best scenario:", {
    months: bestScenario.months,
    roi: bestScenario.roi,
    annualizedRoi: bestScenario.annualizedRoi,
  });
  console.groupEnd();

  // 초기 안전마진 백분율
  const safetyMarginPercent = profit.initialSafetyMargin * 100;

  return (
    <SectionCard title="핵심 지표">
      <div className="space-y-6">
        {/* 브랜드 메시지 */}
        <div className="pb-4 border-b">
          <p className="text-sm text-gray-600 dark:text-gray-400 italic font-[var(--font-noto-sans-kr)] brand-message">
            당신의 경험은 숫자로 증명됩니다.
          </p>
        </div>

        {/* 3개 주요 지표 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 초기 안전마진 */}
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-[var(--font-noto-sans-kr)]">
              초기 안전마진
            </p>
            <p className="text-2xl font-bold numeric-highlight">
              {safetyMarginPercent.toFixed(2)}%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-[var(--font-noto-sans-kr)]">
              FMV 대비 초기 마진
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 italic font-[var(--font-noto-sans-kr)]">
              당신의 안전마진은 {safetyMarginPercent.toFixed(2)}%였습니다.
            </p>
          </div>

          {/* 최적 ROI */}
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-[var(--font-noto-sans-kr)]">
              최적 ROI
            </p>
            <p className="text-2xl font-bold numeric-highlight">
              {(bestScenario.roi * 100).toFixed(2)}%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-[var(--font-noto-sans-kr)]">
              {bestScenario.months}개월 기준
            </p>
          </div>

          {/* 최종 점수 */}
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-[var(--font-noto-sans-kr)]">
              최종 점수
            </p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold numeric-highlight">
                {score.finalScore}
              </p>
              <Badge type="grade" value={score.grade} />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-[var(--font-noto-sans-kr)]">
              1000점 만점
            </p>
          </div>
        </div>

        {/* 점수 구성 상세 (접기/펼치기) */}
        <div className="pt-4 border-t">
          <div className="mb-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-[var(--font-noto-sans-kr)]">
              당신의 성장은 느낌이 아니라, 숫자로 증명됩니다.
            </p>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-[var(--font-noto-sans-kr)]"
            >
              {isExpanded ? "접기" : "점수 구성 상세 보기"}
            </button>
          </div>
          {isExpanded && (
            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 font-[var(--font-noto-sans-kr)]">
                    정확성
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-[var(--font-noto-sans-kr)]">
                    Accuracy Score
                  </p>
                </div>
                <span className="text-sm font-semibold numeric-highlight font-[var(--font-noto-sans-kr)]">
                  {score.accuracyScore} / 400
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 font-[var(--font-noto-sans-kr)]">
                    수익성
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-[var(--font-noto-sans-kr)]">
                    Profitability Score
                  </p>
                </div>
                <span className="text-sm font-semibold numeric-highlight font-[var(--font-noto-sans-kr)]">
                  {score.profitabilityScore} / 400
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 font-[var(--font-noto-sans-kr)]">
                    안정성
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-[var(--font-noto-sans-kr)]">
                    Risk Control Score
                  </p>
                </div>
                <span className="text-sm font-semibold numeric-highlight font-[var(--font-noto-sans-kr)]">
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

