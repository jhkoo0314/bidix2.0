/**
 * @file simulations/[id]/bid/page.tsx
 * @description 입찰 페이지
 *
 * 주요 기능:
 * 1. QuickFacts 표시 (FMV, minBid, exitPrice 3/6/12)
 * 2. BidGuidanceBox 표시 (안전마진, 권장 입찰가 범위)
 * 3. BidAmountInput (입찰가 입력)
 * 4. 입찰 제출 (submitBidAction)
 *
 * 핵심 구현 로직:
 * - Hybrid: Server Component (데이터) + Client Component (입력)
 * - Supabase에서 Valuation 데이터 조회
 * - PropertySeed → Property 변환 (선택적)
 * - Valuation 데이터 파싱 및 타입 검증
 * - Server Action: submitBidAction 호출
 *
 * 브랜드 통합:
 * - 브랜드 메시지는 각 컴포넌트 내부에 이미 구현됨
 * - Design System v2.2: SectionCard, 브랜드 Accent Colors 사용
 * - Layout Rules: 간격 넓게, 경계 옅게
 *
 * @dependencies
 * - @clerk/nextjs/server: auth() 인증 확인
 * - @/lib/supabase/server: createClerkSupabaseClient
 * - @/lib/types: Valuation 타입 (SSOT)
 * - @/components/bid/QuickFacts: 핵심 정보 표시
 * - @/components/bid/BidGuidanceBox: 입찰 가이드
 * - @/components/bid/BidAmountInput: 입찰가 입력 (Client Component)
 * - @/app/action/submitbid: submitBidAction
 * - next/navigation: redirect, notFound, useRouter
 *
 * @see {@link /docs/ui/component-spec.md} - QuickFacts, BidAmountInput, BidGuidanceBox Props
 * @see {@link /docs/engine/json-schema.md} - Valuation 타입 구조 (exitPrice 객체 형태)
 * @see {@link /docs/engine/api-contracts.md} - submitBidAction 명세 (FormData 기반)
 * @see {@link /docs/engine/auction-flow.md} - 입찰 제출 시뮬레이션 흐름
 * @see {@link /docs/product/prdv2.md} - 브랜드 메시지 및 사용자 경험 가이드
 */

import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { Valuation } from "@/lib/types";
import { QuickFacts } from "@/components/bid/QuickFacts";
import { BidGuidanceBox } from "@/components/bid/BidGuidanceBox";
import { BidForm } from "@/components/bid/BidForm";

interface BidPageProps {
  params: Promise<{ id: string }>;
}

export default async function BidPage({ params }: BidPageProps) {
  console.group("Bid Page Render");
  console.log("입찰 페이지 렌더링 시작");

  const { userId } = await auth();

  if (!userId) {
    console.log("인증 실패: 리다이렉트");
    console.groupEnd();
    redirect("/sign-in");
  }

  console.log("인증 성공:", userId);

  const { id } = await params;
  console.log("시뮬레이션 ID:", id);

  // 1. Supabase에서 시뮬레이션 데이터 조회
  let valuation: Valuation | null = null;
  let minBid: number = 0;

  try {
    console.group("Bid Page Fetch");
    const supabase = createClerkSupabaseClient();
    const { data: simulationRecord, error } = await supabase
      .from("simulations")
      .select("id, property_json, valuation_json")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("시뮬레이션 조회 에러:", error);
      console.groupEnd();
      console.groupEnd();
      notFound();
    }

    if (!simulationRecord) {
      console.log("시뮬레이션을 찾을 수 없음");
      console.groupEnd();
      console.groupEnd();
      notFound();
    }

    console.log("시뮬레이션 조회 성공:", simulationRecord.id);
    console.groupEnd();

    // 2. Valuation 데이터 파싱 및 타입 검증
    console.group("Valuation Parsing");
    try {
      valuation = simulationRecord.valuation_json as Valuation;

      // 타입 검증
      if (
        !valuation ||
        typeof valuation.adjustedFMV !== "number" ||
        typeof valuation.minBid !== "number" ||
        !valuation.exitPrice ||
        typeof valuation.exitPrice["3m"] !== "number" ||
        typeof valuation.exitPrice["6m"] !== "number" ||
        typeof valuation.exitPrice["12m"] !== "number"
      ) {
        throw new Error("Valuation 데이터 형식 오류");
      }

      minBid = valuation.minBid;
      console.log("Valuation 파싱 성공:");
      console.log("- adjustedFMV:", valuation.adjustedFMV);
      console.log("- minBid:", minBid);
      console.log("- exitPrice 3m:", valuation.exitPrice["3m"]);
      console.log("- exitPrice 6m:", valuation.exitPrice["6m"]);
      console.log("- exitPrice 12m:", valuation.exitPrice["12m"]);
    } catch (err) {
      console.error("Valuation 파싱 에러:", err);
      console.groupEnd();
      console.groupEnd();
      throw new Error("Valuation 데이터 파싱 실패");
    }
    console.groupEnd();

    console.log("모든 데이터 준비 완료");
    console.groupEnd();
  } catch (err) {
    console.error("예상치 못한 에러:", err);
    console.groupEnd();
    notFound();
  }

  // 데이터가 없으면 404
  if (!valuation) {
    notFound();
  }

  return (
    <main className="min-h-[calc(100vh-80px)] px-8 py-16">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        {/* 헤더 */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">입찰하기</h1>
          <p className="text-gray-600 dark:text-gray-400">
            시뮬레이션 ID: {id}
          </p>
        </div>

        {/* QuickFacts */}
        <QuickFacts valuation={valuation} />

        {/* BidGuidanceBox */}
        <BidGuidanceBox valuation={valuation} />

        {/* BidForm (Client Component) */}
        <BidForm simulationId={id} minBid={minBid} />
      </div>
    </main>
  );
}

