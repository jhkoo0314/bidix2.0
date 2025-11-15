/**
 * @file simulations/page.tsx
 * @description 시뮬레이션 목록 페이지
 *
 * 주요 기능:
 * 1. 모든 시뮬레이션 목록 표시
 * 2. 난이도별 필터링 (Easy/Normal/Hard)
 * 3. 매물 타입별 필터링
 * 4. 지역별 필터링 (주소 포함 검색)
 * 5. PropertyCard 그리드 레이아웃
 * 6. 새로운 시뮬레이션 생성 버튼
 *
 * 핵심 구현 로직:
 * - Hybrid: Server Component (데이터 fetch) + Client Component (필터)
 * - Supabase에서 시뮬레이션 조회 (user_id로 필터링)
 * - PropertySeed → Property 변환 (PropertyEngine.normalize 사용)
 * - Valuation에서 minBid 추출
 * - SimulationListItem 형식으로 변환
 * - SimulationList Client Component에 데이터 전달
 *
 * 브랜드 통합:
 * - 브랜드 보이스: 빈 상태 메시지, 필터 결과 없음 메시지
 * - Design System v2.2: Typography, Layout Rules, 브랜드 Accent Colors 준수
 * - 반응형: Desktop 2-3열, Mobile 1열
 *
 * @dependencies
 * - @clerk/nextjs/server: auth() 인증 확인
 * - @/lib/supabase/server: createClerkSupabaseClient
 * - @/lib/engines/propertyengine: PropertyEngine.normalize
 * - @/components/simulations/SimulationList: Client Component (필터링)
 * - @/components/dashboard/CreateSimulationButton: 시뮬레이션 생성 버튼
 *
 * @see {@link /docs/system/difficulty-modes.md} - Easy/Normal/Hard 모드 설명
 * @see {@link /docs/ui/component-spec.md} - PropertyCard Props 명세
 * @see {@link /docs/engine/json-schema.md} - Property, Valuation 타입 구조
 * @see {@link /docs/product/brand-story.md} - 브랜드 보이스 가이드
 */

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { PropertyEngine } from "@/lib/engines/propertyengine";
import { SimulationList } from "@/components/simulations/SimulationList";
import { CreateSimulationButton } from "@/components/dashboard/CreateSimulationButton";
import { PropertySeed, Valuation } from "@/lib/types";
import type { SimulationListItem } from "@/components/simulations/SimulationList";

export default async function SimulationsListPage() {
  console.group("Simulation List Page Render");
  console.log("시뮬레이션 목록 페이지 렌더링 시작");

  const { userId } = await auth();

  if (!userId) {
    console.log("인증 실패: 리다이렉트");
    console.groupEnd();
    redirect("/sign-in");
  }

  console.log("인증 성공:", userId);

  // 1. 모든 시뮬레이션 조회
  let simulations: SimulationListItem[] = [];

  try {
    console.group("Simulation List Fetch");
    const supabase = createClerkSupabaseClient();
    const { data: simulationRecords, error } = await supabase
      .from("simulations")
      .select(
        "id, property_json, valuation_json, difficulty, property_type, created_at",
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("시뮬레이션 조회 에러:", error);
      console.groupEnd();
    } else if (simulationRecords) {
      console.log("시뮬레이션 조회 성공:", simulationRecords.length, "개");

      // 2. 데이터 변환: PropertySeed → Property, Valuation에서 minBid 추출
      simulations = simulationRecords
        .map((record) => {
          try {
            const propertySeed = record.property_json as PropertySeed;
            const valuation = record.valuation_json as Valuation;

            // PropertySeed를 Property로 변환
            const property = PropertyEngine.normalize(propertySeed);

            // id를 시뮬레이션 ID로 설정 (PropertyCard가 property.id를 사용)
            property.id = record.id;

            // Valuation에서 minBid 추출
            const minBid = valuation.minBid || 0;

            return {
              id: record.id,
              property,
              valuation: {
                minBid,
              },
            };
          } catch (err) {
            console.error("시뮬레이션 데이터 변환 에러:", err, record.id);
            return null;
          }
        })
        .filter((item): item is SimulationListItem => item !== null);

      console.log("데이터 변환 완료:", simulations.length, "개");
    }
    console.groupEnd();
  } catch (err) {
    console.error("시뮬레이션 조회 예외:", err);
    console.groupEnd();
  }

  // 3. 사용량 정보 조회 (CreateSimulationButton용)
  let usageData = {
    bids: { used: 0, limit: 5 },
  };

  try {
    console.group("Simulation List Usage Fetch");
    const usageResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/usage`,
      {
        cache: "no-store",
      },
    );
    if (usageResponse.ok) {
      const usage = await usageResponse.json();
      usageData = {
        bids: {
          used: usage.bids.used || 0,
          limit: usage.bids.limit || 5,
        },
      };
      console.log("사용량 조회 성공:", usageData);
    } else {
      console.log("사용량 조회 실패:", usageResponse.status);
    }
    console.groupEnd();
  } catch (err) {
    console.error("사용량 조회 에러:", err);
    console.groupEnd();
  }

  console.log("시뮬레이션 목록 데이터 준비 완료:", simulations.length, "개");
  console.groupEnd();

  return (
    <main className="min-h-[calc(100vh-80px)] px-4 md:px-8 py-8 md:py-16">
      <div className="w-full max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* 헤더 */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-[var(--font-inter)]">
            시뮬레이션 목록
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground font-[var(--font-noto-sans-kr)]">
            전체 시뮬레이션: {simulations.length}개
          </p>
        </div>

        {/* 시뮬레이션 목록 (필터 포함) */}
        <SimulationList simulations={simulations} />

        {/* 새로운 시뮬레이션 생성 버튼 */}
        <section className="pt-8">
          <CreateSimulationButton
            usageLimit={usageData.bids.limit}
            usageUsed={usageData.bids.used}
          />
        </section>
      </div>
    </main>
  );
}
