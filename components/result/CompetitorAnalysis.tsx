/**
 * @file CompetitorAnalysis.tsx
 * @description 경쟁자 분석 컴포넌트
 *
 * 주요 기능:
 * 1. 경쟁자 입찰가 리스트 표시 (각 경쟁자별)
 * 2. 사용자 입찰가 순위 표시 (1위: "최고 입찰가", 마지막: "가장 낮았습니다", 중간: "X번째로 높았습니다")
 * 3. 입찰가 분포 시각화 (간단한 바 차트)
 * 4. 최고 경쟁자 입찰가와의 차이 표시
 *
 * 핵심 구현 로직:
 * - competitorBids 배열을 내림차순으로 정렬 (이미 정렬되어 있음)
 * - userBid를 포함한 전체 입찰가 배열 생성
 * - 사용자 입찰가의 순위 계산
 * - 입찰가 분포를 시각적으로 표현
 *
 * 브랜드 통합:
 * - 브랜드 메시지: 순위에 따라 동적 메시지 표시 (1위/중간/마지막)
 * - Design System v2.2: 브랜드 Accent Colors 사용
 * - Layout Rules: 모바일 친화적 리스트 레이아웃
 *
 * @dependencies
 * - @/components/common/SectionCard: 섹션 카드
 *
 * @see {@link /docs/ui/component-spec.md} - CompetitorAnalysis Props 명세
 * @see {@link /docs/ui/component-architecture.md} - 컴포넌트 구조
 * @see {@link /docs/ui/design-system.md} - Accent Colors 규칙
 */

import { SectionCard } from "@/components/common/SectionCard";
import { DifficultyMode } from "@/lib/types";

export interface CompetitorAnalysisProps {
  competitorBids: number[]; // 경쟁자 입찰가 배열 (내림차순 정렬)
  userBid: number; // 사용자 입찰가
  minBid: number; // 최저 입찰가
  difficulty?: DifficultyMode; // 난이도 모드 (Optional)
}

export function CompetitorAnalysis({
  competitorBids,
  userBid,
  minBid,
  difficulty,
}: CompetitorAnalysisProps) {
  // 전체 입찰가 배열 생성 (사용자 포함)
  const allBids = [...competitorBids, userBid].sort((a, b) => b - a);

  // 사용자 입찰가 순위 계산 (1부터 시작)
  const userRank = allBids.indexOf(userBid) + 1;
  const totalParticipants = allBids.length;

  // 최고 입찰가와 최저 입찰가
  const maxBid = allBids[0];
  const minBidInList = allBids[allBids.length - 1];
  const range = maxBid - minBidInList;

  // 사용자 입찰가와 최고 입찰가의 차이
  const differenceFromMax = maxBid - userBid;
  const differencePercent = range > 0 ? (differenceFromMax / range) * 100 : 0;

  // 입찰가 분포 시각화를 위한 함수
  const getBidBarWidth = (bid: number) => {
    if (range === 0) return 100;
    return ((bid - minBidInList) / range) * 100;
  };

  // 난이도별 경쟁 강도 설명
  const getDifficultyInfo = () => {
    if (!difficulty) return null;

    const difficultyInfo = {
      [DifficultyMode.Easy]: {
        label: "Easy 모드",
        description: "튜토리얼 모드, 보수적 입찰",
        bgClass: "bg-green-50 dark:bg-green-950",
        borderClass: "border-green-200 dark:border-green-800",
      },
      [DifficultyMode.Normal]: {
        label: "Normal 모드",
        description: "현실적인 경쟁 환경",
        bgClass: "bg-blue-50 dark:bg-blue-950",
        borderClass: "border-blue-200 dark:border-blue-800",
      },
      [DifficultyMode.Hard]: {
        label: "Hard 모드",
        description: "고화 챌린지, 공격적 입찰",
        bgClass: "bg-amber-50 dark:bg-amber-950",
        borderClass: "border-amber-200 dark:border-amber-800",
      },
    };

    return difficultyInfo[difficulty];
  };

  const difficultyInfo = getDifficultyInfo();

  return (
    <SectionCard title="경쟁자 분석">
      <div className="space-y-6">
        {/* 난이도 정보 표시 */}
        {difficultyInfo && (
          <div className={`p-3 ${difficultyInfo.bgClass} rounded-lg border ${difficultyInfo.borderClass}`}>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {difficultyInfo.label}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {difficultyInfo.description}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              경쟁자 {competitorBids.length}명 참여
            </p>
          </div>
        )}

        {/* 순위 표시 */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-center">
            {userRank === 1 ? (
              <>
                당신의 입찰가는{" "}
                <span className="text-[hsl(var(--accent-blue))] dark:text-[hsl(var(--accent-blue))]">
                  최고
                </span>
                입찰가였습니다.
              </>
            ) : userRank === totalParticipants ? (
              <>
                당신의 입찰가는{" "}
                <span className="text-[hsl(var(--accent-blue))] dark:text-[hsl(var(--accent-blue))]">
                  {userRank}위
                </span>
                로 가장 낮았습니다.
              </>
            ) : (
              <>
                당신의 입찰가는{" "}
                <span className="text-[hsl(var(--accent-blue))] dark:text-[hsl(var(--accent-blue))]">
                  {userRank}번째
                </span>
                로 높았습니다.
              </>
            )}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
            총 {totalParticipants}명 참여
          </p>
        </div>

        {/* 입찰가 리스트 */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            입찰가 순위
          </h3>
          <div className="space-y-2">
            {allBids.map((bid, index) => {
              const isUserBid = bid === userBid;
              const rank = index + 1;
              const barWidth = getBidBarWidth(bid);

              return (
                <div
                  key={`bid-${index}-${bid}`}
                  className={`p-3 rounded-lg border ${
                    isUserBid
                      ? "bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-700"
                      : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-semibold ${
                          isUserBid
                            ? "text-[hsl(var(--accent-blue))] dark:text-[hsl(var(--accent-blue))]"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {rank}위
                      </span>
                      {isUserBid && (
                        <span className="text-xs px-2 py-0.5 bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded">
                          당신
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {bid.toLocaleString()}원
                    </span>
                  </div>
                  {/* 입찰가 분포 바 */}
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        isUserBid
                          ? "bg-[hsl(var(--accent-blue))] dark:bg-[hsl(var(--accent-blue))]"
                          : "bg-gray-400 dark:bg-gray-600"
                      }`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 통계 정보 */}
        {differenceFromMax > 0 && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              최고 입찰가와의 차이:{" "}
              <span className="font-semibold text-amber-700 dark:text-amber-300">
                {differenceFromMax.toLocaleString()}원
              </span>{" "}
              ({differencePercent.toFixed(1)}%)
            </p>
          </div>
        )}

        {/* 최저 입찰가 정보 */}
        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            최저 입찰가: {minBid.toLocaleString()}원
          </p>
        </div>
      </div>
    </SectionCard>
  );
}
