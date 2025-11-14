/**
 * @file route.ts
 * @description 사용자 점수, 레벨, 티어, 총 시뮬레이션 수 조회 API Route
 *
 * 주요 기능:
 * 1. 현재 사용자의 점수 및 레벨 정보 조회
 * 2. 티어 계산 (Bronze/Silver/Gold/Platinum/Diamond)
 * 3. 총 시뮬레이션 수 집계
 *
 * 핵심 구현 로직:
 * - Clerk 인증 확인
 * - Supabase simulations 테이블에서 사용자별 집계
 * - score_awarded 필드 합계로 총 점수 계산
 * - ScoreEngine의 expToLevel, expToTier 함수 사용하여 레벨/티어 계산
 * - 총 시뮬레이션 수는 COUNT(*) 집계
 *
 * 브랜드 통합:
 * - Point & Level System 공식 준수 (point-level-system.md)
 * - 티어 계산: 레벨 범위 기준 (Bronze: 1-10, Silver: 11-20, Gold: 21-30, Platinum: 31-40, Diamond: 41+)
 *
 * @dependencies
 * - @clerk/nextjs/server: auth() 인증 확인
 * - @/lib/supabase/server: createClerkSupabaseClient
 * - @/lib/engines/scoreengine: expToLevel, expToTier 함수
 *
 * @see {@link /docs/product/point-level-system.md} - 점수/레벨/티어 계산 로직 (SSOT)
 * @see {@link /docs/engine/api-contracts.md} - API 명세
 */

import { auth } from "@clerk/nextjs/server";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// ScoreEngine의 expToLevel, expToTier 함수를 직접 구현 (import 경로 문제 방지)
function expToLevel(exp: number): number {
  if (exp <= 0) return 1;
  if (exp <= 3000) return Math.min(10, Math.max(1, Math.floor(exp / 300) + 1));
  if (exp <= 9000) return Math.min(20, 11 + Math.floor((exp - 3001) / 600));
  if (exp <= 18000) return Math.min(30, 21 + Math.floor((exp - 9001) / 900));
  if (exp <= 30000) return Math.min(40, 31 + Math.floor((exp - 18001) / 1200));
  return Math.min(99, 41 + Math.floor((exp - 30001) / 2000));
}

function expToTier(exp: number): "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond" {
  if (exp >= 30000) return "Diamond";
  if (exp >= 18001) return "Platinum";
  if (exp >= 9001) return "Gold";
  if (exp >= 3001) return "Silver";
  return "Bronze";
}

export async function GET() {
  console.group("Dashboard Scores API");
  console.log("사용자 점수/레벨 조회 시작");

  try {
    // 1. 인증 확인
    const { userId } = await auth();
    if (!userId) {
      console.log("인증 실패: userId 없음");
      console.groupEnd();
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    console.log("인증 성공:", userId);

    // 2. Supabase 클라이언트 생성
    const supabase = createClerkSupabaseClient();

    // 3. simulations 테이블에서 사용자별 집계
    const { data: simulations, error } = await supabase
      .from("simulations")
      .select("score_awarded")
      .eq("user_id", userId);

    if (error) {
      console.error("Supabase 조회 에러:", error);
      console.groupEnd();
      return NextResponse.json(
        { error: "데이터 조회 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    console.log("시뮬레이션 조회 성공:", simulations?.length || 0, "개");

    // 4. 총 점수 계산 (score_awarded 합계)
    const totalScore = simulations
      ?.filter((s) => s.score_awarded !== null && s.score_awarded !== undefined)
      .reduce((sum, s) => sum + (s.score_awarded || 0), 0) || 0;

    // 5. 총 시뮬레이션 수
    const totalSimulations = simulations?.length || 0;

    // 6. 총 경험치 계산 (각 점수 * 0.6)
    const totalExp = Math.round(totalScore * 0.6);

    // 7. 레벨 및 티어 계산
    const level = expToLevel(totalExp);
    const tier = expToTier(totalExp);

    const result = {
      level,
      score: totalScore,
      tier,
      totalSimulations,
    };

    console.log("계산 결과:", result);
    console.groupEnd();

    return NextResponse.json(result);
  } catch (err) {
    console.error("예상치 못한 에러:", err);
    console.groupEnd();
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

