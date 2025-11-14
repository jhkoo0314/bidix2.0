/**
 * @file route.ts
 * @description 사용자 입찰 히스토리 목록 조회 API Route
 *
 * 주요 기능:
 * 1. 사용자의 입찰 히스토리 목록 조회
 * 2. 페이지네이션 처리 (cursor 기반)
 * 3. 정렬 지원 (최신순, 점수 높은 순, 점수 낮은 순)
 * 4. 필터링 지원 (난이도별, 결과별, 날짜 범위)
 *
 * 핵심 구현 로직:
 * - Clerk 인증 확인
 * - Supabase simulations 테이블에서 조회
 * - outcome !== "pending" 조건으로 입찰 완료된 것만 조회
 * - property_json에서 address 추출
 * - profit_json에서 initialSafetyMargin 추출
 * - 점수에서 등급 계산
 *
 * 브랜드 통합:
 * - Design System v2.2 준수
 * - 브랜드 보이스: 따뜻하고 격려하는 톤
 *
 * @dependencies
 * - @clerk/nextjs/server: auth() 인증 확인
 * - @/lib/supabase/server: createClerkSupabaseClient
 * - @/lib/utils/score: mapScoreToGrade
 *
 * @see {@link /docs/engine/api-contracts.md} - API 명세
 * @see {@link /docs/product/point-level-system.md} - 등급 체계
 */

import { auth } from "@clerk/nextjs/server";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { mapScoreToGrade } from "@/lib/utils/score";
import type { PropertySeed } from "@/lib/types/property";
import type { Profit } from "@/lib/types/profit";

interface HistoryItem {
  historyId: string;
  simulationId: string;
  pinned: boolean;
  savedAt: string;
  propertyType: string;
  address: string;
  myBid: number;
  outcome: "win" | "lose" | "overpay" | "pending";
  score: number;
  grade: "S" | "A" | "B" | "C" | "D";
  initialSafetyMargin: number;
}

interface HistoryResponse {
  items: HistoryItem[];
  nextCursor: string | null;
}

export async function GET(request: NextRequest) {
  console.group("History API");
  console.log("사용자 입찰 히스토리 조회 시작");

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

    // 2. 쿼리 파라미터 파싱
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const cursor = searchParams.get("cursor") || null;
    const sort = searchParams.get("sort") || "newest"; // "newest" | "score_high" | "score_low"
    const difficulty = searchParams.get("difficulty"); // "easy" | "normal" | "hard" | null
    const outcome = searchParams.get("outcome"); // "win" | "lose" | "overpay" | null
    const dateFrom = searchParams.get("dateFrom"); // ISO 8601
    const dateTo = searchParams.get("dateTo"); // ISO 8601

    console.log("쿼리 파라미터:", {
      limit,
      cursor,
      sort,
      difficulty,
      outcome,
      dateFrom,
      dateTo,
    });

    // 3. Supabase 클라이언트 생성
    const supabase = createClerkSupabaseClient();

    // 4. 쿼리 빌더 시작
    let query = supabase
      .from("simulations")
      .select(
        "id, my_bid, outcome, score_awarded, property_json, property_type, difficulty, created_at, profit_json",
      )
      .eq("user_id", userId)
      .neq("outcome", "pending"); // 입찰 완료된 것만

    // 5. 필터 적용
    if (difficulty) {
      query = query.eq("difficulty", difficulty);
    }

    if (outcome) {
      query = query.eq("outcome", outcome);
    }

    if (dateFrom) {
      query = query.gte("created_at", dateFrom);
    }

    if (dateTo) {
      query = query.lte("created_at", dateTo);
    }

    // 6. 정렬 적용
    if (sort === "score_high") {
      query = query.order("score_awarded", { ascending: false });
    } else if (sort === "score_low") {
      query = query.order("score_awarded", { ascending: true });
    } else {
      // 기본값: 최신순
      query = query.order("created_at", { ascending: false });
    }

    // 7. 페이지네이션 적용
    if (cursor) {
      query = query.lt("created_at", cursor);
    }

    query = query.limit(limit + 1); // 다음 페이지 존재 여부 확인을 위해 +1

    // 8. 데이터 조회
    const { data: simulations, error } = await query;

    if (error) {
      console.error("Supabase 조회 에러:", error);
      console.groupEnd();
      return NextResponse.json(
        { error: "데이터 조회 중 오류가 발생했습니다." },
        { status: 500 },
      );
    }

    console.log("조회 결과:", simulations?.length || 0, "개");

    // 9. 다음 커서 확인
    const hasNextPage = simulations && simulations.length > limit;
    const items = simulations?.slice(0, limit) || [];
    const nextCursor =
      hasNextPage && items.length > 0
        ? items[items.length - 1].created_at
        : null;

    // 10. 데이터 변환
    const historyItems: HistoryItem[] = items.map((sim) => {
      const propertyJson = sim.property_json as PropertySeed;
      const profitJson = sim.profit_json as Profit | null;
      const score = sim.score_awarded || 0;
      const grade = mapScoreToGrade(score);

      return {
        historyId: sim.id,
        simulationId: sim.id,
        pinned: false, // 현재는 항상 false (추후 구현)
        savedAt: sim.created_at,
        propertyType: sim.property_type || "unknown",
        address: propertyJson?.address || "주소 없음",
        myBid: sim.my_bid || 0,
        outcome: (sim.outcome as "win" | "lose" | "overpay" | "pending") || "pending",
        score,
        grade,
        initialSafetyMargin: profitJson?.initialSafetyMargin || 0,
      };
    });

    const result: HistoryResponse = {
      items: historyItems,
      nextCursor,
    };

    console.log("변환 완료:", historyItems.length, "개 항목");
    console.log("다음 커서:", nextCursor || "없음");
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

