/**
 * @file simulations/[id]/page.tsx
 * @description 시뮬레이션 상세 페이지
 *
 * 주요 기능:
 * 1. 시뮬레이션 상세 정보 표시
 * 2. 매각물건명세서 요약 (SaleStatementSummary)
 * 3. 권리 분석 요약 (RightsSummary)
 * 4. 입찰하기 CTA 버튼
 *
 * 핵심 구현 로직:
 * - Server Component
 * - Supabase에서 시뮬레이션 데이터 조회
 * - Property, CourtDocs, Rights 데이터 포함
 *
 * @dependencies
 * - @clerk/nextjs: 인증 확인
 * - @/lib/supabase/server: Supabase 서버 클라이언트
 * - next/navigation: 동적 라우트 파라미터
 *
 * @see {@link /docs/ui/component-spec.md} - SaleStatementSummary, RightsSummary Props
 * @see {@link /docs/engine/json-schema.md} - Property, CourtDocsNormalized, Rights 타입
 */

import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SimulationDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function SimulationDetailPage({
  params,
}: SimulationDetailPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { id } = await params;

  // TODO: Supabase에서 시뮬레이션 데이터 조회
  // const simulation = await fetchSimulation(id, userId);

  return (
    <main className="min-h-[calc(100vh-80px)] px-8 py-16">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        {/* 헤더 */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">시뮬레이션 상세</h1>
          <p className="text-gray-600 dark:text-gray-400">사건번호: {id}</p>
        </div>

        {/* 매각물건명세서 요약 */}
        <section className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">매각물건명세서 요약</h2>
          <p className="text-gray-500">
            TODO: SaleStatementSummary 컴포넌트 구현
          </p>
        </section>

        {/* 권리 분석 요약 */}
        <section className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">권리 분석 요약</h2>
          <p className="text-gray-500">TODO: RightsSummary 컴포넌트 구현</p>
        </section>

        {/* 입찰하기 CTA */}
        <section className="pt-8">
          <Link href={`/simulations/${id}/bid`}>
            <Button size="lg" className="w-full md:w-auto">
              입찰하기
            </Button>
          </Link>
        </section>
      </div>
    </main>
  );
}

