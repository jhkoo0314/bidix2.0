/**
 * @file history/page.tsx
 * @description 히스토리 페이지
 *
 * 주요 기능:
 * 1. 입찰 히스토리 목록 표시
 * 2. 페이지네이션
 * 3. 정렬 기능 (최신순, 점수 높은 순, 점수 낮은 순)
 * 4. 필터링 (난이도별, 결과별, 날짜 범위)
 *
 * 핵심 구현 로직:
 * - Server Component
 * - API 호출: GET /api/history
 * - 페이지네이션 처리
 *
 * @dependencies
 * - @clerk/nextjs: 인증 확인
 * - next/navigation: 페이지네이션
 *
 * @see {@link /docs/engine/api-contracts.md} - GET /api/history 명세
 * @see {@link /docs/product/point-level-system.md} - 등급별 색상 체계
 */

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HistoryPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // TODO: API 호출 구현
  // const history = await fetch('/api/history?limit=20');

  return (
    <main className="min-h-[calc(100vh-80px)] px-8 py-16">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        {/* 헤더 */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">입찰 히스토리</h1>
          <p className="text-gray-600 dark:text-gray-400">전체 개수: 0개</p>
        </div>

        {/* 필터 및 정렬 (TODO: 구현) */}
        <section className="p-4 border rounded-lg">
          <p className="text-sm text-gray-500">
            필터 및 정렬 기능은 곧 추가될 예정입니다.
          </p>
        </section>

        {/* 히스토리 목록 */}
        <section>
          <div className="space-y-4">
            {/* TODO: 테이블 또는 카드 형식으로 히스토리 표시 */}
            <div className="p-6 border rounded-lg text-center text-gray-500">
              아직 저장된 히스토리가 없습니다.
            </div>
          </div>
        </section>

        {/* 페이지네이션 (TODO: 구현) */}
        <section className="pt-8">
          <p className="text-sm text-gray-500 text-center">
            페이지네이션 기능은 곧 추가될 예정입니다.
          </p>
        </section>
      </div>
    </main>
  );
}

