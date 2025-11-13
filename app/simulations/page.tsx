/**
 * @file simulations/page.tsx
 * @description 시뮬레이션 목록 페이지
 *
 * 주요 기능:
 * 1. 모든 시뮬레이션 목록 표시
 * 2. 난이도별 필터링 (Easy/Normal/Hard)
 * 3. 매물 타입별 필터링
 * 4. PropertyCard 그리드 레이아웃
 *
 * 핵심 구현 로직:
 * - Hybrid: Server Component (데이터 fetch) + Client Component (필터)
 * - Supabase에서 시뮬레이션 조회
 * - Property 및 Valuation 데이터 포함
 *
 * @dependencies
 * - @clerk/nextjs: 인증 확인
 * - @/lib/supabase/server: Supabase 서버 클라이언트
 *
 * @see {@link /docs/system/difficulty-modes.md} - Easy/Normal/Hard 모드 설명
 * @see {@link /docs/ui/component-spec.md} - PropertyCard Props
 */

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SimulationsListPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // TODO: Supabase에서 시뮬레이션 목록 조회
  // const simulations = await fetchSimulations(userId);

  return (
    <main className="min-h-[calc(100vh-80px)] px-8 py-16">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        {/* 헤더 */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">시뮬레이션 목록</h1>
          <p className="text-gray-600 dark:text-gray-400">
            전체 시뮬레이션: 0개
          </p>
        </div>

        {/* 필터 바 (TODO: Client Component로 구현) */}
        <section className="p-4 border rounded-lg">
          <p className="text-sm text-gray-500">
            필터 기능은 곧 추가될 예정입니다.
          </p>
        </section>

        {/* 시뮬레이션 목록 */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* TODO: PropertyCard 컴포넌트로 교체 */}
            <div className="p-6 border rounded-lg text-center text-gray-500">
              시뮬레이션이 없습니다
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

