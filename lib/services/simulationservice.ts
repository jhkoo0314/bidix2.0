// src/lib/services/simulationservice.ts
// BIDIX AI - Simulation Service (v2.2 Full Rewrite)
// Version: 2.2
// Last Updated: 2025-11-14

import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

// Engine Layer
import { AuctionEngine } from "@/lib/engines/auctionengine";
import { ScoreEngine } from "@/lib/engines/scoreengine";

// Generators
import { generateSimulationScenario } from "@/lib/generators/simulationgenerator";

// Types
import {
  AuctionAnalysisResult,
  DifficultyMode,
  PropertySeed,
  CourtDocsNormalized,
} from "@/lib/types";

// Supabase Init
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Server-side only
);

type SimulationTable = Database["public"]["Tables"]["simulations"];
type SimulationInsert = SimulationTable["Insert"];
type SimulationUpdate = SimulationTable["Update"];

/* ============================================================
    [1] CREATE Simulation (입찰 전 단계)
   ============================================================ */

async function create(userId: string, difficulty: DifficultyMode) {
  /* 1) Seed + CourtDocs 생성 */
  const scenario = generateSimulationScenario({ difficulty });

  const propertySeed: PropertySeed = scenario.propertySeed;
  const courtDocs: CourtDocsNormalized = scenario.courtDocs;

  /* 2) AuctionEngine 초기 실행 (입찰가 0) */
  const initialResult = AuctionEngine.run({
    seed: propertySeed,
    courtDocs,
    userBid: 0,
  });

  /* 3) DB 저장 스키마 구성 — v2.2 */
  const record: SimulationInsert = {
    user_id: userId,

    // JSON 저장 (v2.2 구조)
    property_json: initialResult.property,
    valuation_json: initialResult.valuation,
    rights_json: initialResult.rights,
    court_docs_json: courtDocs,

    // Denormalized fields
    property_type: initialResult.property.type,
    difficulty: initialResult.property.difficulty,

    // 입찰 전 상태
    my_bid: 0,
    outcome: "pending",
  };

  /* 4) DB Insert */
  const { data, error } = await supabase
    .from("simulations")
    .insert(record)
    .select("id")
    .single();

  if (error || !data) {
    console.error("[SimulationService.create] ERROR:", error);
    throw new Error("Failed to create simulation.");
  }

  return {
    simulationId: data.id,
    initialResult,
  };
}

/* ============================================================
    [2] SUBMIT BID (입찰 제출)
   ============================================================ */

async function submitBid(
  simulationId: string,
  userId: string,
  userBid: number
) {
  /* 1) 기존 데이터 가져오기 */
  const { data: original, error } = await supabase
    .from("simulations")
    .select("property_json, court_docs_json")
    .eq("id", simulationId)
    .eq("user_id", userId)
    .single();

  if (error || !original) throw new Error("Simulation not found.");

  const propertySeed = original.property_json as PropertySeed;
  const courtDocs = original.court_docs_json as CourtDocsNormalized;

  /* 2) 엔진 재실행: 최종 결과 생성 */
  const finalResult: AuctionAnalysisResult = AuctionEngine.run({
    seed: propertySeed,
    courtDocs,
    userBid,
  });

  /* 3) 점수 계산 */
  const scoreResult = ScoreEngine.calculate({
    result: finalResult,
    userBid,
  });

  /* 4) OUTCOME 판단 (v2.2 기반 재작성) */
  const outcome = determineOutcome(finalResult, userBid);

  /* 5) DB 업데이트 Payload 구성 */
  const updateData: SimulationUpdate = {
    my_bid: userBid,
    outcome,

    // JSON 저장 (v2.2)
    costs_json: finalResult.costs,
    profit_json: finalResult.profit,
    result_json: finalResult.summary,

    // 시험용 점수
    score_awarded: scoreResult.finalScore,
  };

  /* 6) DB 업데이트 실행 */
  const { error: updateError } = await supabase
    .from("simulations")
    .update(updateData)
    .eq("id", simulationId);

  if (updateError) {
    console.error("[SimulationService.submitBid] ERROR:", updateError);
    throw new Error("Failed to submit bid.");
  }

  /* 7) 결과 반환 */
  return {
    ...finalResult,
    score: scoreResult,
  };
}

/* ============================================================
    [3] OUTCOME 판단 (v2.2에 맞게 재작성)
   ============================================================ */

function determineOutcome(
  result: AuctionAnalysisResult,
  userBid: number
): "win" | "lose" | "overpay" {
  // 최저가: minBid
  const minBid = result.valuation.minBid;

  // 권장가 범위
  const maxRecommended = result.valuation.recommendedBidRange.max;

  if (userBid === 0) return "lose"; // 미입찰
  if (userBid < minBid) return "lose"; // 최저가 미달
  if (userBid > maxRecommended * 1.1) return "overpay"; // 과입찰

  return "win"; // 정상 낙찰 (학습 기준)
}

/* ============================================================
    EXPORT
   ============================================================ */

export const simulationService = {
  create,
  submitBid,
};
