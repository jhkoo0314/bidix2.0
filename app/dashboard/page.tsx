/**
 * @file dashboard/page.tsx
 * @description 사용자 대시보드 페이지
 *
 * 주요 기능:
 * 1. 사용자 통계 표시 (레벨, 점수, 총 시뮬레이션 수)
 * 2. 최근 시뮬레이션 3개 표시
 * 3. 일일 사용량 표시 (5회 제한)
 * 4. 새로운 시뮬레이션 생성 버튼
 *
 * 핵심 구현 로직:
 * - Server Component로 구현
 * - API 호출: GET /api/scores, GET /api/usage
 * - Supabase에서 최근 시뮬레이션 조회
 * - Point & Level System 공식 사용
 *
 * @dependencies
 * - @clerk/nextjs: 인증 확인
 * - @/lib/supabase/server: Supabase 서버 클라이언트
 *
 * @see {@link /docs/product/user-flow.md} - Usage 조회 및 시뮬레이션 생성 플로우
 * @see {@link /docs/product/point-level-system.md} - 점수/레벨/티어 계산 로직
 * @see {@link /docs/engine/api-contracts.md} - /api/scores, /api/usage 명세
 */

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // TODO: API 호출 구현
  // const scores = await fetch('/api/scores');
  // const usage = await fetch('/api/usage');
  // const recentSimulations = await fetchRecentSimulations(userId);

  return (
    <main className="min-h-[calc(100vh-80px)] px-8 py-16">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        {/* 헤더 */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">대시보드</h1>
          <p className="text-gray-600 dark:text-gray-400">
            안녕하세요! 오늘도 안전하게 실전 경험을 쌓아보세요.
          </p>
        </div>

        {/* 사용량 표시 */}
        <section className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">일일 사용량</h2>
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-400">
              오늘 사용: 0 / 5회
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: "0%" }}
              />
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-lg">
            <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              레벨
            </h3>
            <p className="text-3xl font-bold">1</p>
            <p className="text-sm text-gray-500 mt-1">Bronze</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              총 점수
            </h3>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              총 시뮬레이션
            </h3>
            <p className="text-3xl font-bold">0</p>
          </div>
        </section>

        {/* 최근 시뮬레이션 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">최근 시뮬레이션</h2>
          <div className="space-y-4">
            <div className="p-6 border rounded-lg text-center text-gray-500">
              아직 시뮬레이션이 없습니다. 첫 시뮬레이션을 시작해보세요!
            </div>
          </div>
        </section>

        {/* 새로운 시뮬레이션 생성 버튼 */}
        <section className="pt-8">
          <Link href="/simulations">
            <Button size="lg" className="w-full md:w-auto">
              새로운 시뮬레이션 생성
            </Button>
          </Link>
        </section>
      </div>
    </main>
  );
}

