/**
 * @file simulations/[id]/result/page.tsx
 * @description 결과 페이지 (핵심 페이지)
 *
 * 주요 기능:
 * 1. BidOutcomeBlock (입찰 성공/실패/근접)
 * 2. MetricsStrip (초기 안전마진, ROI, 점수)
 * 3. ExitScenarioTable (3/6/12개월 비교 테이블)
 * 4. Premium Report CTAs (잠금 UI)
 * 5. ResultActions (히스토리 저장, 다음 연습)
 *
 * 핵심 구현 로직:
 * - Server Component
 * - Supabase에서 시뮬레이션 결과 조회
 * - AuctionAnalysisResult 전체 데이터 사용
 * - Point & Level System 공식 적용
 *
 * @dependencies
 * - @clerk/nextjs: 인증 확인
 * - @/lib/supabase/server: Supabase 서버 클라이언트
 *
 * @see {@link /docs/product/report-result.md} - 4종 리포트 상세 명세
 * @see {@link /docs/product/point-level-system.md} - 점수 계산 공식
 * @see {@link /docs/engine/json-schema.md} - AuctionAnalysisResult 전체 구조
 * @see {@link /docs/ui/component-spec.md} - 모든 Result 컴포넌트 Props
 */

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ResultPageProps {
  params: Promise<{ id: string }>;
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { id } = await params;

  // TODO: Supabase에서 시뮬레이션 결과 조회
  // const result = await fetchSimulationResult(id, userId);
  // const score = await fetchScore(id, userId);

  return (
    <main className="min-h-[calc(100vh-80px)] px-8 py-16">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        {/* 헤더 */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">입찰 결과</h1>
          <p className="text-gray-600 dark:text-gray-400">시뮬레이션 ID: {id}</p>
        </div>

        {/* BidOutcomeBlock */}
        <section className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">입찰 결과</h2>
          <p className="text-gray-500">TODO: BidOutcomeBlock 컴포넌트 구현</p>
          <p className="text-sm text-gray-400 mt-2">
            - 입찰 성공/실패/근접 표시
            <br />- 등급 (S/A/B/C/D) 표시
            <br />- isProfitable3m/6m/12m 표시
          </p>
        </section>

        {/* MetricsStrip */}
        <section className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">핵심 지표</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                초기 안전마진
              </p>
              <p className="text-2xl font-bold">TODO</p>
            </div>
            <div className="p-4 border rounded">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                최적 ROI
              </p>
              <p className="text-2xl font-bold">TODO</p>
            </div>
            <div className="p-4 border rounded">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                최종 점수
              </p>
              <p className="text-2xl font-bold">TODO</p>
            </div>
          </div>
        </section>

        {/* ExitScenarioTable */}
        <section className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">보유기간별 수익 시나리오</h2>
          <p className="text-gray-500">TODO: ExitScenarioTable 컴포넌트 구현</p>
          <p className="text-sm text-gray-400 mt-2">
            - 3개월/6개월/12개월 비교 테이블
            <br />- exitPrice, totalCost, netProfit, ROI 표시
          </p>
        </section>

        {/* Premium Report CTAs */}
        <section className="space-y-6">
          <div className="p-6 border rounded-lg border-dashed">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🔒</span>
              <h3 className="text-xl font-semibold">권리 분석 상세 리포트</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              임대 권리 관계, 우선순위 분석, 명도비용 상세
            </p>
            <p className="text-sm text-gray-500 italic mb-4">
              &quot;당신은 이미 물건의 &apos;사실&apos;을 파악했습니다. 이제 &apos;분석&apos;을 시작할
              준비가 되셨나요?&quot;
            </p>
            <Button variant="outline" disabled>
              프리미엄 해설판 보기
            </Button>
          </div>

          <div className="p-6 border rounded-lg border-dashed">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🔒</span>
              <h3 className="text-xl font-semibold">수익 분석 상세 리포트</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              비용 구조, 수익 시나리오, 수익분기점 분석
            </p>
            <Button variant="outline" disabled>
              프리미엄 해설판 보기
            </Button>
          </div>

          <div className="p-6 border rounded-lg border-dashed">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🔒</span>
              <h3 className="text-xl font-semibold">경매 분석 상세 리포트</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              입찰 전략의 점수 상세, 개선 포인트
            </p>
            <Button variant="outline" disabled>
              프리미엄 해설판 보기
            </Button>
          </div>
        </section>

        {/* ResultActions */}
        <section className="pt-8 flex gap-4">
          <Button variant="outline" disabled>
            히스토리 저장
          </Button>
          <Link href="/dashboard">
            <Button>다음 연습</Button>
          </Link>
        </section>
      </div>
    </main>
  );
}

