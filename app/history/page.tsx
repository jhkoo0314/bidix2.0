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
 * - URL searchParams로 필터/정렬 상태 관리
 * - 페이지네이션 처리
 *
 * 브랜드 통합:
 * - Design System v2.2: 브랜드 Accent Colors, Numeric Highlight
 * - 브랜드 보이스: 따뜻하고 격려하는 톤
 *
 * @dependencies
 * - @clerk/nextjs/server: auth() 인증 확인
 * - next/navigation: redirect
 * - @/components/history/HistoryFilterBar: 필터/정렬 바
 * - @/components/common/EmptyState: 빈 상태 컴포넌트
 * - @/components/common/ErrorState: 에러 상태 컴포넌트
 * - @/components/common/Badge: 등급 배지
 * - @/components/ui/table: 테이블 컴포넌트
 * - @/lib/utils/outcome: formatOutcome
 *
 * @see {@link /docs/engine/api-contracts.md} - GET /api/history 명세
 * @see {@link /docs/product/point-level-system.md} - 등급별 색상 체계
 * @see {@link /docs/ui/design-system.md} - 디자인 시스템
 */

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { HistoryFilterBar } from "@/components/history/HistoryFilterBar";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Badge } from "@/components/common/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatOutcome } from "@/lib/utils/outcome";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface HistoryPageProps {
  searchParams: Promise<{
    limit?: string;
    cursor?: string;
    sort?: string;
    difficulty?: string;
    outcome?: string;
    dateRange?: string;
  }>;
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  console.group("History Page Render");
  console.log("히스토리 페이지 렌더링 시작");

  const { userId } = await auth();

  if (!userId) {
    console.log("인증 실패: 리다이렉트");
    console.groupEnd();
    redirect("/sign-in");
  }

  console.log("인증 성공:", userId);

  try {
    // 1. searchParams 파싱
    const params = await searchParams;
    const limit = params.limit || "20";
    const cursor = params.cursor || "";
    const sort = params.sort || "newest";
    const difficulty = params.difficulty || "";
    const outcome = params.outcome || "";
    const dateRange = params.dateRange || "all";

    console.log("쿼리 파라미터:", {
      limit,
      cursor,
      sort,
      difficulty,
      outcome,
      dateRange,
    });

    // 2. 날짜 범위 계산
    let dateFrom: string | undefined;
    let dateTo: string | undefined;
    if (dateRange === "7days") {
      const date = new Date();
      date.setDate(date.getDate() - 7);
      dateFrom = date.toISOString();
    } else if (dateRange === "30days") {
      const date = new Date();
      date.setDate(date.getDate() - 30);
      dateFrom = date.toISOString();
    }

    // 3. API 호출
    const queryParams = new URLSearchParams({
      limit,
      ...(cursor && { cursor }),
      ...(sort && { sort }),
      ...(difficulty && { difficulty }),
      ...(outcome && { outcome }),
      ...(dateFrom && { dateFrom }),
      ...(dateTo && { dateTo }),
    });

    // Server Component에서 내부 API 호출 시 절대 URL 필요
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");
    const apiUrl = `${baseUrl}/api/history?${queryParams.toString()}`;
    console.log("API 호출 URL:", apiUrl);

    // Server Component에서 내부 API 호출 시 쿠키 전달
    const headersList = await headers();
    const cookie = headersList.get("cookie") || "";

    const response = await fetch(apiUrl, {
      cache: "no-store",
      headers: {
        Cookie: cookie,
      },
    });

    if (!response.ok) {
      let errorMessage = "히스토리를 불러오는 중 오류가 발생했습니다.";
      console.error("API 호출 실패:", response.status, response.statusText);

      // 에러 응답 본문 읽기 시도 (안전하게)
      try {
        const errorData = await response.json().catch(() => null);
        if (errorData) {
          console.error("에러 상세:", errorData);
          if (errorData.details) {
            errorMessage += ` (${errorData.details})`;
          } else if (errorData.error) {
            errorMessage += ` (${errorData.error})`;
          }
        }
      } catch (e) {
        // JSON 파싱 실패는 무시 (기본 메시지 사용)
        console.error("에러 응답 파싱 실패:", e);
      }

      console.groupEnd();
      return (
        <main className="min-h-[calc(100vh-80px)] px-4 md:px-8 py-8 md:py-16">
          <div className="w-full max-w-7xl mx-auto">
            <ErrorState message={errorMessage} />
          </div>
        </main>
      );
    }

    const data = await response.json();
    console.log("API 응답:", data.items?.length || 0, "개 항목");
    console.log("다음 커서:", data.nextCursor || "없음");

    const { items, nextCursor } = data;

    // 4. UI 렌더링
    return (
      <main className="min-h-[calc(100vh-80px)] px-4 md:px-8 py-8 md:py-16">
        <div className="w-full max-w-7xl mx-auto space-y-6 md:space-y-8">
          {/* 헤더 */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold font-[var(--font-inter)]">입찰 히스토리</h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-[var(--font-noto-sans-kr)]">
              전체 개수: {items?.length || 0}개
            </p>
          </div>

          {/* 필터 및 정렬 */}
          <section>
            <HistoryFilterBar />
          </section>

          {/* 히스토리 목록 */}
          <section>
            {!items || items.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <p className="text-lg text-muted-foreground mb-4">
                  아직 저장된 히스토리가 없습니다.
                </p>
                <Link href="/dashboard">
                  <Button>새로운 시뮬레이션 시작하기</Button>
                </Link>
              </div>
            ) : (
              <>
                {/* Desktop: 테이블 */}
                <div className="hidden lg:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>날짜</TableHead>
                        <TableHead>매물 정보</TableHead>
                        <TableHead>입찰가</TableHead>
                        <TableHead>결과</TableHead>
                        <TableHead>점수</TableHead>
                        <TableHead>등급</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item: any) => {
                        const outcomeDisplay = formatOutcome(item.outcome);
                        const date = new Date(item.savedAt);
                        const formattedDate = `${date.getFullYear()}-${String(
                          date.getMonth() + 1,
                        ).padStart(2, "0")}-${String(date.getDate()).padStart(
                          2,
                          "0",
                        )} ${String(date.getHours()).padStart(2, "0")}:${String(
                          date.getMinutes(),
                        ).padStart(2, "0")}`;

                        return (
                          <TableRow
                            key={item.historyId}
                            className="cursor-pointer hover:bg-muted/50"
                          >
                            <TableCell>
                              <Link
                                href={`/simulations/${item.simulationId}/result`}
                                className="block"
                              >
                                {formattedDate}
                              </Link>
                            </TableCell>
                            <TableCell>
                              <Link
                                href={`/simulations/${item.simulationId}/result`}
                                className="block"
                              >
                                <div className="font-medium">
                                  {item.propertyType}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {item.address}
                                </div>
                              </Link>
                            </TableCell>
                            <TableCell>
                              <Link
                                href={`/simulations/${item.simulationId}/result`}
                                className="block font-bold tabular-nums"
                              >
                                {item.myBid.toLocaleString()}원
                              </Link>
                            </TableCell>
                            <TableCell>
                              <Link
                                href={`/simulations/${item.simulationId}/result`}
                                className="block"
                              >
                                <span className="flex items-center gap-2">
                                  <span>{outcomeDisplay.icon}</span>
                                  <span>{outcomeDisplay.label}</span>
                                </span>
                              </Link>
                            </TableCell>
                            <TableCell>
                              <Link
                                href={`/simulations/${item.simulationId}/result`}
                                className="block font-bold tabular-nums"
                              >
                                {item.score}점
                              </Link>
                            </TableCell>
                            <TableCell>
                              <Link
                                href={`/simulations/${item.simulationId}/result`}
                                className="block"
                              >
                                <Badge type="grade" value={item.grade} />
                              </Link>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile/Tablet: 카드 */}
                <div className="lg:hidden space-y-4">
                  {items.map((item: any) => {
                    const outcomeDisplay = formatOutcome(item.outcome);
                    const date = new Date(item.savedAt);
                    const formattedDate = `${date.getFullYear()}-${String(
                      date.getMonth() + 1,
                    ).padStart(2, "0")}-${String(date.getDate()).padStart(
                      2,
                      "0",
                    )} ${String(date.getHours()).padStart(2, "0")}:${String(
                      date.getMinutes(),
                    ).padStart(2, "0")}`;

                    return (
                      <Link
                        key={item.historyId}
                        href={`/simulations/${item.simulationId}/result`}
                      >
                        <Card className="p-4 hover:bg-muted/50 transition-colors">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">
                                {formattedDate}
                              </span>
                              <Badge type="grade" value={item.grade} />
                            </div>
                            <div>
                              <div className="font-medium">
                                {item.propertyType}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {item.address}
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm text-muted-foreground">
                                  입찰가
                                </div>
                                <div className="font-bold tabular-nums">
                                  {item.myBid.toLocaleString()}원
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">
                                  점수
                                </div>
                                <div className="font-bold tabular-nums">
                                  {item.score}점
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">
                                  결과
                                </div>
                                <div className="flex items-center gap-1">
                                  <span>{outcomeDisplay.icon}</span>
                                  <span>{outcomeDisplay.label}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
          </section>

          {/* 페이지네이션 */}
          {nextCursor && items && items.length > 0 && (
            <section className="pt-8">
              <div className="flex justify-center">
                <a
                  href={`/history?${new URLSearchParams({
                    ...params,
                    cursor: nextCursor,
                  }).toString()}`}
                  className="px-4 py-2 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  더보기
                </a>
              </div>
            </section>
          )}
        </div>
      </main>
    );
  } catch (err) {
    console.error("예상치 못한 에러:", err);
    console.groupEnd();
    return (
      <main className="min-h-[calc(100vh-80px)] px-4 md:px-8 py-8 md:py-16">
        <div className="w-full max-w-7xl mx-auto">
          <ErrorState message="문제가 발생했습니다. 괜찮습니다. 다시 시도해 주세요." />
        </div>
      </main>
    );
  } finally {
    console.groupEnd();
  }
}
