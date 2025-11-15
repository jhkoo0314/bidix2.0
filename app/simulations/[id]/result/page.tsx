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
 * - @/lib/engines/propertyengine: PropertySeed → Property 변환
 * - @/lib/engines/scoreengine: ScoreBreakdown 계산
 * - @/lib/types: AuctionAnalysisResult 타입
 * - @/components/result/BidOutcomeBlock: 입찰 결과 컴포넌트
 * - @/components/result/MetricsStrip: 핵심 지표 컴포넌트
 * - @/components/result/ExitScenarioTable: 보유기간별 수익 시나리오 테이블 컴포넌트
 * - @/components/result/PremiumReportCTA: 프리미엄 리포트 CTA 컴포넌트
 * - @/components/reports/SaleStatementReport: 매각물건명세서 해설판 리포트 컴포넌트
 * - @/components/result/ResultActions: 결과 페이지 액션 컴포넌트
 * - @/components/ui/separator: 섹션 구분선 컴포넌트
 *
 * @see {@link /docs/product/report-result.md} - 4종 리포트 상세 명세
 * @see {@link /docs/product/point-level-system.md} - 점수 계산 공식
 * @see {@link /docs/engine/json-schema.md} - AuctionAnalysisResult 전체 구조
 * @see {@link /docs/ui/component-spec.md} - 모든 Result 컴포넌트 Props
 */

import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { PropertyEngine } from "@/lib/engines/propertyengine";
import { ScoreEngine, type ScoreBreakdown } from "@/lib/engines/scoreengine";
import {
  AuctionAnalysisResult,
  Property,
  PropertySeed,
  Valuation,
  Rights,
  Costs,
  Profit,
  CourtDocsNormalized,
  AuctionSummary,
} from "@/lib/types";
import {
  generateCompetitorBids,
  mergePolicyWithDifficulty,
} from "@/lib/services/simulationservice";
import { BidOutcomeBlock } from "@/components/result/BidOutcomeBlock";
import { MetricsStrip } from "@/components/result/MetricsStrip";
import { ExitScenarioTable } from "@/components/result/ExitScenarioTable";
import { PremiumReportCTA } from "@/components/result/PremiumReportCTA";
import { SaleStatementReport } from "@/components/reports/SaleStatementReport";
import { ResultActions } from "@/components/result/ResultActions";
import { CompetitorAnalysis } from "@/components/result/CompetitorAnalysis";
import { Separator } from "@/components/ui/separator";

interface ResultPageProps {
  params: Promise<{ id: string }>;
}

export default async function ResultPage({ params }: ResultPageProps) {
  console.group("Result Page Render");
  console.log("결과 페이지 렌더링 시작");

  const { userId } = await auth();

  if (!userId) {
    console.log("인증 실패: 리다이렉트");
    console.groupEnd();
    redirect("/sign-in");
  }

  console.log("인증 성공:", userId);

  const { id } = await params;
  console.log("시뮬레이션 ID:", id);

  // 1. Supabase에서 시뮬레이션 결과 조회
  let result: AuctionAnalysisResult | null = null;
  let userBid: number = 0;
  let scoreBreakdown: ScoreBreakdown | null = null;
  let freeReportAvailable = false;
  const isHistorySaved = false; // 히스토리 저장 여부 (현재는 false, 추후 DB 조회 필요)
  let competitorBids: number[] = []; // 경쟁자 입찰가 배열

  try {
    console.group("Result Page Data Fetch");
    const supabase = createClerkSupabaseClient();
    const { data: simulationRecord, error } = await supabase
      .from("simulations")
      .select(
        "id, user_id, my_bid, outcome, score_awarded, property_json, valuation_json, rights_json, costs_json, profit_json, result_json, court_docs_json"
      )
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
    console.log("입찰가:", simulationRecord.my_bid);
    console.log("결과:", simulationRecord.outcome);
    console.log("점수:", simulationRecord.score_awarded);

    userBid = simulationRecord.my_bid || 0;

    // 2. 데이터 구조 재구성 및 검증
    console.group("Data Structure Reconstruction");
    try {
      // PropertySeed → Property 변환
      const propertySeed = simulationRecord.property_json as PropertySeed;
      if (!propertySeed) {
        throw new Error("PropertySeed 데이터 없음");
      }

      const property: Property = PropertyEngine.normalize(propertySeed);
      property.id = simulationRecord.id; // 시뮬레이션 ID로 설정

      // JSON 필드 파싱 및 타입 검증
      const valuation = simulationRecord.valuation_json as Valuation;
      const rights = simulationRecord.rights_json as Rights;
      const costs = simulationRecord.costs_json as Costs;
      const profit = simulationRecord.profit_json as Profit;
      const summary = simulationRecord.result_json as AuctionSummary;
      const courtDocs = simulationRecord.court_docs_json as
        | CourtDocsNormalized
        | undefined;

      // 필수 필드 검증
      if (!valuation || typeof valuation.minBid !== "number") {
        throw new Error("Valuation 데이터 형식 오류");
      }
      if (!rights || typeof rights.assumableRightsTotal !== "number") {
        throw new Error("Rights 데이터 형식 오류");
      }
      if (!costs || !costs.acquisition || typeof costs.acquisition.totalAcquisition !== "number") {
        console.error("Costs 데이터 구조:", JSON.stringify(costs, null, 2));
        throw new Error("Costs 데이터 형식 오류");
      }
      if (!profit || !profit.scenarios) {
        throw new Error("Profit 데이터 형식 오류");
      }
      if (!summary || !summary.grade) {
        throw new Error("Summary 데이터 형식 오류");
      }

      // profit.scenarios 구조 확인 (3m/6m/12m)
      if (
        !profit.scenarios["3m"] ||
        !profit.scenarios["6m"] ||
        !profit.scenarios["12m"]
      ) {
        throw new Error("Profit scenarios 구조 오류 (3m/6m/12m 필수)");
      }

      // summary.grade 값 확인 (S/A/B/C/D)
      if (!["S", "A", "B", "C", "D"].includes(summary.grade)) {
        throw new Error(`Invalid grade: ${summary.grade}`);
      }

      console.log("데이터 검증 성공:");
      console.log("- Property:", property.type, property.address);
      console.log("- Valuation minBid:", valuation.minBid);
      console.log("- Summary grade:", summary.grade);
      console.log("- Profit scenarios:", Object.keys(profit.scenarios));

      // 전체 데이터 구조 로그 출력
      console.group("Result Page Data");
      console.log("Property:", {
        type: property.type,
        address: property.address,
        difficulty: property.difficulty,
      });
      console.log("Valuation:", {
        minBid: valuation.minBid,
        adjustedFMV: valuation.adjustedFMV,
        recommendedBidRange: valuation.recommendedBidRange,
      });
      console.log("Rights:", {
        assumableRightsTotal: rights.assumableRightsTotal,
        evictionRisk: rights.evictionRisk,
      });
      console.log("Costs:", {
        totalAcquisition: costs.acquisition.totalAcquisition,
        ownCash: costs.acquisition.ownCash,
      });
      console.log("Profit:", {
        initialSafetyMargin: profit.initialSafetyMargin,
        scenarios: Object.keys(profit.scenarios),
      });
      console.log("Summary:", {
        grade: summary.grade,
        isProfitable: summary.isProfitable,
        bestHoldingPeriod: summary.bestHoldingPeriod,
        riskLabel: summary.riskLabel,
      });
      console.groupEnd();

      // AuctionAnalysisResult 구성
      result = {
        property,
        valuation,
        rights,
        costs,
        profit,
        courtDocs,
        summary,
      };

      console.log("AuctionAnalysisResult 구성 완료");

      // 3. ScoreBreakdown 계산
      console.group("Score Calculation");
      try {
        const scoreResult = ScoreEngine.calculate({
          result,
          userBid,
        });

        scoreBreakdown = {
          accuracyScore: scoreResult.accuracyScore,
          profitabilityScore: scoreResult.profitabilityScore,
          riskControlScore: scoreResult.riskControlScore,
          finalScore: scoreResult.finalScore,
          grade: scoreResult.grade,
          expGain: scoreResult.expGain,
        };

        console.log("ScoreBreakdown 계산 성공:");
        console.log("- Accuracy Score:", scoreBreakdown.accuracyScore, "/ 400");
        console.log("- Profitability Score:", scoreBreakdown.profitabilityScore, "/ 400");
        console.log("- Risk Control Score:", scoreBreakdown.riskControlScore, "/ 200");
        console.log("- Final Score:", scoreBreakdown.finalScore, "/ 1000");
        console.log("- Grade:", scoreBreakdown.grade);
        console.log("- EXP Gain:", scoreBreakdown.expGain);
      } catch (err) {
        console.error("ScoreBreakdown 계산 에러:", err);
        // 에러 발생 시에도 계속 진행 (점수 없이 표시)
        console.log("점수 계산 실패, 점수 없이 진행");
      }
      console.groupEnd();

      // 4. Usage API 호출 (무료 리포트 사용량 체크)
      console.group("Usage Check");
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const usageResponse = await fetch(`${baseUrl}/api/usage`, {
          cache: "no-store",
        });

        if (usageResponse.ok) {
          const usageData = await usageResponse.json();
          freeReportAvailable = (usageData.freeReport?.remaining || 0) > 0;
          console.log("사용량 조회 성공:", {
            freeReportRemaining: usageData.freeReport?.remaining || 0,
            freeReportAvailable,
          });
        } else {
          console.log("사용량 조회 실패:", usageResponse.status);
          // 실패 시 기본값 사용 (무료 리포트 사용 불가)
          freeReportAvailable = false;
        }
      } catch (err) {
        console.error("사용량 조회 에러:", err);
        // 에러 발생 시 기본값 사용 (무료 리포트 사용 불가)
        freeReportAvailable = false;
      }
      // 5. 경쟁자 입찰가 생성 (입찰 완료된 경우에만)
      console.group("Competitor Bids Generation");
      if (userBid > 0) {
        try {
          const propertySeed = simulationRecord.property_json as PropertySeed;
          const mergedPolicy = mergePolicyWithDifficulty(propertySeed.difficulty);
          competitorBids = generateCompetitorBids(
            propertySeed,
            valuation,
            mergedPolicy,
          );
          console.log("경쟁자 입찰가 생성 성공:", competitorBids.length, "명");
        } catch (err) {
          console.error("경쟁자 입찰가 생성 에러:", err);
          // 에러 발생 시 빈 배열 유지
        }
      } else {
        console.log("입찰 전 상태, 경쟁자 입찰가 생성 생략");
      }
      console.groupEnd();

      console.groupEnd();
    } catch (err) {
      console.error("데이터 구조 재구성 에러:", err);
      console.groupEnd();
      console.groupEnd();
      throw new Error(`데이터 변환 실패: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
    console.groupEnd();
    console.groupEnd();
  } catch (err) {
    console.error("예상치 못한 에러:", err);
    console.groupEnd();
    notFound();
  }

  // 데이터가 없으면 404
  if (!result) {
    notFound();
  }

  // 입찰 실패 여부 확인 (브랜드 메시지 표시용)
  const isBidFailed = userBid < result.valuation.minBid;

  console.log("렌더링 준비 완료");
  console.log("입찰 실패 여부:", isBidFailed);
  if (scoreBreakdown) {
    console.log("ScoreBreakdown 준비 완료:", scoreBreakdown.finalScore);
    console.group("ScoreBreakdown Details");
    console.log("Accuracy Score:", scoreBreakdown.accuracyScore, "/ 400");
    console.log("Profitability Score:", scoreBreakdown.profitabilityScore, "/ 400");
    console.log("Risk Control Score:", scoreBreakdown.riskControlScore, "/ 200");
    console.log("Final Score:", scoreBreakdown.finalScore, "/ 1000");
    console.log("Grade:", scoreBreakdown.grade);
    console.log("EXP Gain:", scoreBreakdown.expGain);
    console.groupEnd();
  } else {
    console.log("ScoreBreakdown 없음 (점수 계산 실패 또는 입찰 전)");
  }

  console.log("무료 리포트 사용 가능:", freeReportAvailable);
  console.log("히스토리 저장 여부:", isHistorySaved);
  console.log("경쟁자 수:", competitorBids.length);
  console.groupEnd();

  return (
    <main className="min-h-[calc(100vh-80px)] px-4 md:px-8 py-8 md:py-16">
      <div className="w-full max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* 헤더 */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold font-[var(--font-inter)]">입찰 결과</h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-[var(--font-noto-sans-kr)]">시뮬레이션 ID: {id}</p>
        </div>

        {/* 브랜드 메시지 layer (페이지 최상단) */}
        {isBidFailed && (
          <section className="py-6 border-b">
            <p className="text-lg text-gray-700 dark:text-gray-300 italic text-center font-[var(--font-noto-sans-kr)] brand-message">
              실패는 비용이 아니라, 자산입니다.
            </p>
          </section>
        )}

        {/* BidOutcomeBlock */}
        {(() => {
          console.log("Rendering BidOutcomeBlock");
          return (
            <BidOutcomeBlock
              summary={result.summary}
              userBid={userBid}
              minBid={result.valuation.minBid}
              profit={result.profit}
              competitorBids={competitorBids}
              difficulty={result.property.difficulty}
            />
          );
        })()}

        <Separator />

        {/* MetricsStrip */}
        {scoreBreakdown && (
          <>
            {(() => {
              console.log("Rendering MetricsStrip");
              return (
                <MetricsStrip profit={result.profit} score={scoreBreakdown} />
              );
            })()}
            <Separator />
          </>
        )}

        {/* ExitScenarioTable */}
        {(() => {
          console.log("Rendering ExitScenarioTable");
          return <ExitScenarioTable profit={result.profit} />;
        })()}

        <Separator />

        {/* CompetitorAnalysis */}
        {competitorBids.length > 0 && (
          <>
            {(() => {
              console.log("Rendering CompetitorAnalysis");
              return (
                <CompetitorAnalysis
                  competitorBids={competitorBids}
                  userBid={userBid}
                  minBid={result.valuation.minBid}
                  difficulty={result.property.difficulty}
                />
              );
            })()}
            <Separator />
          </>
        )}

        {/* Premium Report CTAs */}
        <section className="space-y-4 md:space-y-6">
          {(() => {
            console.log("Rendering Premium Report CTAs");
            return (
              <>
                {/* 매각물건명세서 해설판 (무료 리포트) */}
                {result.courtDocs && (
                  <div className="space-y-4">
                    <SaleStatementReport
                      courtDocs={result.courtDocs}
                      isFreeAvailable={freeReportAvailable}
                    />
                  </div>
                )}

                {/* Premium Report CTAs - 반응형 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  <PremiumReportCTA type="rights" />
                  <PremiumReportCTA type="profit" />
                  <PremiumReportCTA type="auction" />
                </div>
              </>
            );
          })()}
        </section>

        {/* ResultActions */}
        {(() => {
          console.log("Rendering ResultActions");
          return (
            <ResultActions
              simulationId={id}
              isSaved={isHistorySaved}
            />
          );
        })()}
      </div>
    </main>
  );
}

