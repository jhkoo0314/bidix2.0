/**
 * @file route.ts
 * @description 사용자 일일 사용량 및 한도 정보 조회 API Route
 *
 * 주요 기능:
 * 1. 오늘 사용한 입찰 횟수 조회 (일 5회 제한)
 * 2. 무료 리포트 사용 여부 조회 (일 1회 제한)
 * 3. 남은 횟수 계산
 *
 * 핵심 구현 로직:
 * - Clerk 인증 확인
 * - Supabase simulations 테이블에서 오늘 날짜 기준 집계
 * - 입찰 횟수: outcome이 "pending"이 아닌 시뮬레이션 수 (입찰 완료된 것만)
 * - 무료 리포트: 별도 추적 필요 (현재는 0으로 설정)
 * - 일일 리셋 로직: 자정 기준 (현재 날짜로 필터링)
 *
 * 브랜드 통합:
 * - Freemium 전략 반영 (prdv2.md): 일 5회 입찰, 일 1회 무료 리포트
 * - 브랜드 보이스: 따뜻하고 격려하는 톤
 *
 * @dependencies
 * - @clerk/nextjs/server: auth() 인증 확인
 * - @/lib/supabase/server: createClerkSupabaseClient
 *
 * @see {@link /docs/product/prdv2.md} - Freemium 전략 (일 5회 제한)
 * @see {@link /docs/engine/api-contracts.md} - API 명세
 */

import { auth } from "@clerk/nextjs/server";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  console.group("Dashboard Usage API");
  console.log("사용자 일일 사용량 조회 시작");

  try {
    // 1. 인증 확인
    const { userId } = await auth();
    if (!userId) {
      console.log("인증 실패: userId 없음");
      console.groupEnd();
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 },
      );
    }

    console.log("인증 성공:", userId);

    // 2. 오늘 날짜 계산 (YYYY-MM-DD 형식)
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0]; // YYYY-MM-DD
    const todayStart = new Date(todayStr + "T00:00:00.000Z");
    const todayEnd = new Date(todayStr + "T23:59:59.999Z");

    console.log(
      "오늘 날짜 범위:",
      todayStart.toISOString(),
      "~",
      todayEnd.toISOString(),
    );

    // 3. Supabase 클라이언트 생성
    const supabase = createClerkSupabaseClient();

    // 4. 오늘 생성된 시뮬레이션 중 입찰 완료된 것만 조회
    const { data: simulations, error } = await supabase
      .from("simulations")
      .select("id, outcome, created_at")
      .eq("user_id", userId)
      .gte("created_at", todayStart.toISOString())
      .lte("created_at", todayEnd.toISOString())
      .neq("outcome", "pending"); // 입찰 전 상태는 제외

    if (error) {
      console.error("Supabase 조회 에러:", error);
      console.groupEnd();
      return NextResponse.json(
        { error: "데이터 조회 중 오류가 발생했습니다." },
        { status: 500 },
      );
    }

    console.log("오늘 입찰 완료된 시뮬레이션:", simulations?.length || 0, "개");

    // 5. 입찰 횟수 계산
    const bidsUsed = simulations?.length || 0;
    const bidsLimit = 5;
    const bidsRemaining = Math.max(0, bidsLimit - bidsUsed);

    // 6. 무료 리포트 사용 여부 (현재는 0으로 설정, 추후 구현)
    const freeReportViewed = false;
    const freeReportLimit = 1;
    const freeReportRemaining = freeReportViewed ? 0 : freeReportLimit;

    const result = {
      date: todayStr,
      bids: {
        used: bidsUsed,
        limit: bidsLimit,
        remaining: bidsRemaining,
      },
      freeReport: {
        viewed: freeReportViewed,
        limit: freeReportLimit,
        remaining: freeReportRemaining,
      },
    };

    console.log("사용량 조회 결과:", result);
    console.groupEnd();

    return NextResponse.json(result);
  } catch (err) {
    console.error("예상치 못한 에러:", err);
    console.groupEnd();
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
