/**
 * @file dashboard/page.tsx
 * @description 사용자 대시보드 페이지
 *
 * 주요 기능:
 * 1. 사용자 통계 표시 (레벨, 점수, 총 시뮬레이션 수)
 * 2. 최근 시뮬레이션 3개 표시
 * 3. 일일 사용량 표시 (5회 제한)
 * 4. 브랜드 Value Chain 통계 표시 (Experience/Insight/Index)
 * 5. 새로운 시뮬레이션 생성 버튼
 *
 * 핵심 구현 로직:
 * - Server Component로 구현
 * - API 호출: GET /api/scores, GET /api/usage
 * - Supabase에서 최근 시뮬레이션 조회 (최근 3개)
 * - 브랜드 Value Chain 통계: 이번 주 시뮬레이션 횟수 집계
 * - Point & Level System 공식 사용
 * - 브랜드 보이스 메시지 적용
 *
 * 브랜드 통합:
 * - 브랜드 보이스: "안녕하세요. 당신은 이미 경매를 공부했습니다. 이제 BIDIX에서 안전하게 경험할 차례입니다."
 * - Design System v2.2: Typography, Layout Rules, 브랜드 Accent Colors 준수
 * - 브랜드 Value Chain: Experience/Insight/Index 3모듈 구조
 *
 * @dependencies
 * - @clerk/nextjs/server: auth() 인증 확인
 * - @/lib/supabase/server: createClerkSupabaseClient
 * - @/components/dashboard/QuickStats: 빠른 통계 컴포넌트
 * - @/components/dashboard/UsageIndicator: 사용량 표시 컴포넌트
 * - @/components/dashboard/DashboardStats: 브랜드 Value Chain 통계 컴포넌트
 * - @/components/dashboard/RecentSimulations: 최근 시뮬레이션 컴포넌트
 * - @/components/dashboard/CreateSimulationButton: 시뮬레이션 생성 버튼 (Client Component)
 *
 * @see {@link /docs/product/user-flow.md} - Usage 조회 및 시뮬레이션 생성 플로우
 * @see {@link /docs/product/point-level-system.md} - 점수/레벨/티어 계산 로직
 * @see {@link /docs/engine/api-contracts.md} - /api/scores, /api/usage 명세
 * @see {@link /docs/product/brand-story.md} - 브랜드 보이스 가이드
 * @see {@link /docs/ui/design-system.md} - 디자인 시스템 v2.2
 */

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { UsageIndicator } from "@/components/dashboard/UsageIndicator";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentSimulations } from "@/components/dashboard/RecentSimulations";
import { CreateSimulationButton } from "@/components/dashboard/CreateSimulationButton";
import { Property } from "@/lib/types";
import type { SimulationListItem } from "@/components/dashboard/RecentSimulations";

export default async function DashboardPage() {
  console.group("Dashboard Page Render");
  console.log("대시보드 페이지 렌더링 시작");

  const { userId } = await auth();

  if (!userId) {
    console.log("인증 실패: 리다이렉트");
    console.groupEnd();
    redirect("/sign-in");
  }

  console.log("인증 성공:", userId);

  // 1. API 호출: 점수/레벨 정보
  let scoresData = {
    level: 1,
    score: 0,
    tier: "Bronze" as const,
    totalSimulations: 0,
  };

  try {
    console.group("Dashboard Scores Fetch");
    const scoresResponse = await fetch(
      `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/api/scores`,
      {
        cache: "no-store",
      },
    );
    if (scoresResponse.ok) {
      scoresData = await scoresResponse.json();
      console.log("점수 조회 성공:", scoresData);
    } else {
      console.log("점수 조회 실패:", scoresResponse.status);
    }
    console.groupEnd();
  } catch (err) {
    console.error("점수 조회 에러:", err);
    console.groupEnd();
  }

  // 2. API 호출: 사용량 정보
  let usageData = {
    date: new Date().toISOString().split("T")[0],
    bids: { used: 0, limit: 5, remaining: 5 },
    freeReport: { viewed: false, limit: 1, remaining: 1 },
  };

  try {
    console.group("Dashboard Usage Fetch");
    const usageResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/usage`,
      {
        cache: "no-store",
      },
    );
    if (usageResponse.ok) {
      usageData = await usageResponse.json();
      console.log("사용량 조회 성공:", usageData);
    } else {
      console.log("사용량 조회 실패:", usageResponse.status);
    }
    console.groupEnd();
  } catch (err) {
    console.error("사용량 조회 에러:", err);
    console.groupEnd();
  }

  // 3. 최근 시뮬레이션 3개 조회
  let recentSimulations: SimulationListItem[] = [];

  try {
    console.group("Dashboard Recent Simulations Fetch");
    const supabase = createClerkSupabaseClient();
    const { data: simulations, error } = await supabase
      .from("simulations")
      .select("id, property_json, valuation_json")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(3);

    if (error) {
      console.error("시뮬레이션 조회 에러:", error);
    } else if (simulations) {
      recentSimulations = simulations
        .map((sim) => {
          try {
            const property = sim.property_json as Property;
            const valuation = sim.valuation_json as { minBid: number };
            // Property에 id를 시뮬레이션 ID로 설정 (PropertyCard가 property.id를 사용)
            return {
              id: sim.id,
              property: { ...property, id: sim.id },
              valuation,
            };
          } catch (err) {
            console.error("시뮬레이션 데이터 변환 에러:", err);
            return null;
          }
        })
        .filter((item): item is SimulationListItem => item !== null);
      console.log("최근 시뮬레이션 조회 성공:", recentSimulations.length, "개");
    }
    console.groupEnd();
  } catch (err) {
    console.error("최근 시뮬레이션 조회 예외:", err);
    console.groupEnd();
  }

  // 4. 브랜드 Value Chain 통계: 이번 주 시뮬레이션 횟수
  let weeklySimulationCount = 0;

  try {
    console.group("Dashboard Weekly Stats Fetch");
    const supabase = createClerkSupabaseClient();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { count, error } = await supabase
      .from("simulations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", weekAgo.toISOString());

    if (error) {
      console.error("주간 통계 조회 에러:", error);
    } else {
      weeklySimulationCount = count || 0;
      console.log("이번 주 시뮬레이션 횟수:", weeklySimulationCount);
    }
    console.groupEnd();
  } catch (err) {
    console.error("주간 통계 조회 예외:", err);
    console.groupEnd();
  }

  console.log("대시보드 데이터 준비 완료");
  console.groupEnd();

  return (
    <main className="min-h-[calc(100vh-80px)] px-8 py-16">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        {/* 환영 메시지 헤더 */}
        <div className="space-y-2">
          <h1 className="text-4xl lg:text-5xl font-bold font-[var(--font-inter)]">
            대시보드
          </h1>
          <p className="text-lg lg:text-xl text-foreground leading-relaxed font-[var(--font-noto-sans-kr)]">
            안녕하세요. 당신은 이미 경매를 공부했습니다. 이제 BIDIX에서 안전하게
            경험할 차례입니다.
          </p>
        </div>

        {/* 사용량 표시 */}
        <UsageIndicator
          used={usageData.bids.used}
          limit={usageData.bids.limit}
        />

        {/* 브랜드 Value Chain 통계 */}
        <DashboardStats
          experience={{ count: weeklySimulationCount }}
          insight={{ count: 0 }} // 무료 리포트 조회 수 (현재는 0)
          index={{ score: scoresData.score, level: scoresData.level }}
        />

        {/* Quick Stats */}
        <QuickStats
          level={scoresData.level}
          totalScore={scoresData.score}
          simulationCount={scoresData.totalSimulations}
        />

        {/* 최근 시뮬레이션 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold font-[var(--font-inter)]">
            최근 시뮬레이션
          </h2>
          <RecentSimulations simulations={recentSimulations} />
        </section>

        {/* 새로운 시뮬레이션 생성 버튼 */}
        <section className="pt-8">
          <CreateSimulationButton
            usageLimit={usageData.bids.limit}
            usageUsed={usageData.bids.used}
          />
        </section>
      </div>
    </main>
  );
}
