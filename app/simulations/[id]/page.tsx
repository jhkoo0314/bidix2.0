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
 * - PropertySeed → Property 변환 (PropertyEngine.normalize)
 * - JSON 데이터 파싱 (CourtDocsNormalized, Rights)
 * - 브랜드 통합 디자인 시스템 v2.2 적용
 *
 * 브랜드 통합:
 * - 브랜드 메시지: "사실을 먼저 이해한 다음, 분석이 시작됩니다."
 * - Design System v2.2: SectionCard, 브랜드 Accent Colors 사용
 * - Layout Rules: 좌측 메인 정보 → 우측 인사이트 구조 (Desktop)
 * - 반응형: Desktop 2열, Mobile 1열
 *
 * @dependencies
 * - @clerk/nextjs/server: auth() 인증 확인
 * - @/lib/supabase/server: createClerkSupabaseClient
 * - @/lib/engines/propertyengine: PropertyEngine.normalize
 * - @/lib/types: PropertySeed, Property, CourtDocsNormalized, Rights
 * - @/components/simulations/SaleStatementSummary: 매각물건명세서 요약
 * - @/components/simulations/RightsSummary: 권리 분석 요약
 * - @/components/common/Badge: 난이도 배지
 * - next/navigation: redirect, notFound
 *
 * @see {@link /docs/ui/component-spec.md} - SaleStatementSummary, RightsSummary Props
 * @see {@link /docs/engine/json-schema.md} - Property, CourtDocsNormalized, Rights 타입
 * @see {@link /docs/engine/auction-flow.md} - 입찰 전 초기 시뮬레이션 구조
 * @see {@link /docs/product/prdv2.md} - 브랜드 메시지 및 무료 제공 정책
 * @see {@link /docs/ui/design-system.md} - 브랜드 통합 디자인 시스템 v2.2
 */

import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { PropertyEngine } from "@/lib/engines/propertyengine";
import {
  PropertySeed,
  Property,
  CourtDocsNormalized,
  Rights,
} from "@/lib/types";
import { SaleStatementSummary } from "@/components/simulations/SaleStatementSummary";
import { RightsSummary } from "@/components/simulations/RightsSummary";
import { Badge } from "@/components/common/Badge";
import { BackButton } from "@/components/common/BackButton";

interface SimulationDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: SimulationDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) {
    return {
      title: "시뮬레이션 상세 - BIDIX",
      description: "시뮬레이션 상세 정보를 확인할 수 있습니다",
    };
  }

  try {
    const supabase = createClerkSupabaseClient();
    const { data: simulationRecord } = await supabase
      .from("simulations")
      .select("property_json, difficulty")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (simulationRecord) {
      const propertySeed = simulationRecord.property_json as PropertySeed;
      const property = PropertyEngine.normalize(propertySeed);
      const difficulty = simulationRecord.difficulty || property.difficulty;

      const propertyTypeLabels: Record<string, string> = {
        apartment: "아파트",
        villa: "빌라/다세대",
        officetel: "오피스텔",
        multi_house: "다가구주택",
        detached: "단독주택",
        res_land: "대지(주거)",
      };

      const propertyTypeLabel = propertyTypeLabels[property.type] || property.type;
      const difficultyLabels: Record<string, string> = {
        easy: "Easy",
        normal: "Normal",
        hard: "Hard",
      };
      const difficultyLabel = difficultyLabels[difficulty] || difficulty;

      return {
        title: `${propertyTypeLabel} 시뮬레이션 (${difficultyLabel}) - BIDIX`,
        description: `${property.address || "부동산"} ${propertyTypeLabel} 경매 시뮬레이션 - ${difficultyLabel} 난이도`,
        keywords: [propertyTypeLabel, difficultyLabel, "경매 시뮬레이션", "BIDIX"],
        openGraph: {
          title: `${propertyTypeLabel} 시뮬레이션 - BIDIX`,
          description: `${property.address || "부동산"} ${propertyTypeLabel} 경매 시뮬레이션`,
          images: ["/og-image.png"],
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title: `${propertyTypeLabel} 시뮬레이션 - BIDIX`,
          description: `${property.address || "부동산"} ${propertyTypeLabel} 경매 시뮬레이션`,
          images: ["/og-image.png"],
        },
      };
    }
  } catch (err) {
    console.error("메타데이터 생성 에러:", err);
  }

  return {
    title: "시뮬레이션 상세 - BIDIX",
    description: "시뮬레이션 상세 정보를 확인할 수 있습니다",
    openGraph: {
      title: "시뮬레이션 상세 - BIDIX",
      description: "당신의 경험을, 데이터로 증명하다.",
      images: ["/og-image.png"],
      type: "website",
    },
  };
}

export default async function SimulationDetailPage({
  params,
}: SimulationDetailPageProps) {
  console.group("Simulation Detail Page Render");
  console.log("시뮬레이션 상세 페이지 렌더링 시작");

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
  let property: Property | null = null;
  let courtDocs: CourtDocsNormalized | null = null;
  let rights: Rights | null = null;
  let caseNumber: string = "";
  let difficulty: string = "";

  try {
    console.group("Simulation Detail Fetch");
    const supabase = createClerkSupabaseClient();
    const { data: simulationRecord, error } = await supabase
      .from("simulations")
      .select("id, property_json, court_docs_json, rights_json, difficulty")
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

    // 2. PropertySeed → Property 변환
    console.group("Property Conversion");
    try {
      const propertySeed = simulationRecord.property_json as PropertySeed;
      property = PropertyEngine.normalize(propertySeed);
      property.id = simulationRecord.id; // 시뮬레이션 ID로 설정
      difficulty = simulationRecord.difficulty || property.difficulty;
      console.log("Property 변환 성공:", property.type, property.address);
    } catch (err) {
      console.error("Property 변환 에러:", err);
      console.groupEnd();
      console.groupEnd();
      throw new Error("Property 데이터 변환 실패");
    }
    console.groupEnd();

    // 3. JSON 파싱 및 타입 검증
    console.group("JSON Parsing");
    try {
      courtDocs = simulationRecord.court_docs_json as CourtDocsNormalized;
      rights = simulationRecord.rights_json as Rights;

      // 타입 검증
      if (!courtDocs || !courtDocs.caseNumber) {
        throw new Error("CourtDocs 데이터 형식 오류");
      }
      if (!rights || typeof rights.assumableRightsTotal !== "number") {
        throw new Error("Rights 데이터 형식 오류");
      }

      caseNumber = courtDocs.caseNumber;
      console.log("JSON 파싱 성공:");
      console.log("- 사건번호:", caseNumber);
      console.log("- 등기 권리 수:", courtDocs.registeredRights?.length || 0);
      console.log("- 임차인 수:", courtDocs.occupants?.length || 0);
      console.log("- 총 인수금액:", rights.assumableRightsTotal);
    } catch (err) {
      console.error("JSON 파싱 에러:", err);
      console.groupEnd();
      console.groupEnd();
      throw new Error("데이터 파싱 실패");
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
  if (!property || !courtDocs || !rights) {
    notFound();
  }

  return (
    <main className="min-h-[calc(100vh-80px)] px-4 md:px-8 py-8 md:py-16">
      <div className="w-full max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* 뒤로가기 버튼 */}
        <BackButton href="/simulations" />

        {/* 헤더 */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold font-[var(--font-inter)]">시뮬레이션 상세</h1>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-[var(--font-noto-sans-kr)]">
                사건번호: {caseNumber}
              </p>
            </div>
            <Badge type="difficulty" value={difficulty} />
          </div>

          {/* 브랜드 문구 */}
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground italic border-l-2 border-[hsl(var(--accent-blue))] pl-3 py-2 font-[var(--font-noto-sans-kr)] brand-message">
              사실을 먼저 이해한 다음, 분석이 시작됩니다.
            </p>
          </div>
        </div>

        {/* 반응형 레이아웃: Desktop 2열, Mobile 1열 */}
        <article className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* 좌측: 매각물건명세서 요약 */}
          <section>
            <SaleStatementSummary property={property} courtDocs={courtDocs} />
          </section>

          {/* 우측: 권리 분석 요약 */}
          <section>
            <RightsSummary rights={rights} />
          </section>
        </article>

        {/* 입찰하기 CTA */}
        <section className="pt-6 md:pt-8 flex justify-center md:justify-start">
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
