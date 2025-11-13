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
 * - Property, Valuation 데이터 조회
 * - Server Action: submitBidAction 호출
 *
 * @dependencies
 * - @clerk/nextjs: 인증 확인
 * - @/lib/supabase/server: Supabase 서버 클라이언트
 * - @/app/action/submitbid: submitBidAction
 *
 * @see {@link /docs/ui/component-spec.md} - QuickFacts, BidAmountInput, BidGuidanceBox Props
 * @see {@link /docs/engine/json-schema.md} - Valuation 타입 (exitPrice3m/6m/12m)
 * @see {@link /docs/engine/api-contracts.md} - submitBidAction 명세
 */

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

interface BidPageProps {
  params: Promise<{ id: string }>;
}

export default async function BidPage({ params }: BidPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { id } = await params;

  // TODO: Property, Valuation 데이터 조회
  // const simulation = await fetchSimulation(id, userId);

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
        <section className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">핵심 정보</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                조정된 시세 (adjustedFMV)
              </p>
              <p className="text-2xl font-bold">TODO: 데이터 표시</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                최저 입찰가 (minBid)
              </p>
              <p className="text-2xl font-bold">TODO: 데이터 표시</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                예상 매각가 (3/6/12개월)
              </p>
              <p className="text-lg">TODO: exitPrice3m/6m/12m 표시</p>
            </div>
          </div>
        </section>

        {/* BidGuidanceBox */}
        <section className="p-6 border rounded-lg bg-blue-50 dark:bg-blue-950">
          <h2 className="text-xl font-semibold mb-4">입찰 가이드</h2>
          <p className="text-gray-600 dark:text-gray-400">
            TODO: 안전마진 설명 및 권장 입찰가 범위 표시
          </p>
        </section>

        {/* BidAmountInput */}
        <section className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">입찰가 입력</h2>
          <p className="text-gray-500 mb-4">
            TODO: BidAmountInput 컴포넌트 구현 (Client Component)
          </p>
          <div className="space-y-4">
            <input
              type="number"
              placeholder="입찰가를 입력하세요"
              className="w-full p-3 border rounded-lg"
              disabled
            />
            <Button size="lg" className="w-full" disabled>
              입찰 제출
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}

