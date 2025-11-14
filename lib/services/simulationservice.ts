// lib/services/simulationservice.ts
// BIDIX AI - Simulation Service (v2.2 Full Rewrite)
// Version: 2.2
// Last Updated: 2025-01-28

import { createClient } from "@supabase/supabase-js";
// import { Database } from "@/types/supabase"; // 타입 파일이 없으므로 주석 처리

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
  Valuation,
} from "@/lib/types";

// Policy
import { Policy, PolicyOverrides } from "@/lib/policy/policy";
import defaultPolicy from "@/lib/policy/defaultpolicy";
import { easyModePolicy, hardModePolicy } from "@/lib/policy/difficultypolicy";

// Utils
import {
  seedBasedRandom,
  generateSeedFromPropertySeed,
} from "@/lib/utils/number";

// Supabase Init
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Server-side only
);

// 타입 정의 (Database 타입이 없으므로 any 사용)
type SimulationInsert = {
  user_id: string;
  property_json: any;
  valuation_json: any;
  rights_json: any;
  court_docs_json: any;
  property_type: string;
  difficulty: string;
  my_bid: number;
  outcome: string;
};

type SimulationUpdate = {
  my_bid?: number;
  outcome?: string;
  costs_json?: any;
  profit_json?: any;
  result_json?: any;
  score_awarded?: number;
  pinned?: boolean;
};

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
    // PropertySeed를 저장 (Property가 아닌) - AuctionEngine.run()이 PropertySeed를 받음
    property_json: propertySeed,
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
  userBid: number,
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

  /* 4) 난이도별 정책 병합 */
  const mergedPolicy = mergePolicyWithDifficulty(propertySeed.difficulty);

  /* 5) OUTCOME 판단 (경쟁자 로직 포함) */
  const outcome = determineOutcome(
    finalResult,
    userBid,
    propertySeed, // 시드 추가
    mergedPolicy, // 병합된 정책 전달
  );

  /* 6) DB 업데이트 Payload 구성 */
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

  /* 7) DB 업데이트 실행 */
  const { error: updateError } = await supabase
    .from("simulations")
    .update(updateData)
    .eq("id", simulationId);

  if (updateError) {
    console.error("[SimulationService.submitBid] ERROR:", updateError);
    throw new Error("Failed to submit bid.");
  }

  /* 8) 결과 반환 */
  return {
    ...finalResult,
    score: scoreResult,
  };
}

/* ============================================================
    [3] 정책 병합 유틸리티 함수
   ============================================================ */

/**
 * 난이도별 정책 병합 함수
 * defaultPolicy를 기본으로 하고, 난이도에 따라 오버라이드 적용
 *
 * @param difficulty - 난이도 모드 (Easy/Normal/Hard)
 * @returns 병합된 Policy 객체
 */
export function mergePolicyWithDifficulty(difficulty: DifficultyMode): Policy {
  // 기본 정책 복사
  const merged: Policy = JSON.parse(JSON.stringify(defaultPolicy));

  // 난이도별 오버라이드 선택
  let override: PolicyOverrides;
  switch (difficulty) {
    case DifficultyMode.Easy:
      override = easyModePolicy;
      break;
    case DifficultyMode.Hard:
      override = hardModePolicy;
      break;
    default:
      // Normal 모드는 오버라이드 없음
      return merged;
  }

  // Deep merge 구현
  function deepMerge(target: any, source: any): any {
    if (source === null || source === undefined) {
      return target;
    }

    if (typeof source !== "object" || Array.isArray(source)) {
      return source;
    }

    const result = { ...target };
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (
          typeof source[key] === "object" &&
          !Array.isArray(source[key]) &&
          source[key] !== null &&
          target[key] &&
          typeof target[key] === "object" &&
          !Array.isArray(target[key])
        ) {
          result[key] = deepMerge(target[key], source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }
    return result;
  }

  return deepMerge(merged, override) as Policy;
}

/* ============================================================
    [4] 경쟁자 입찰가 생성 함수
   ============================================================ */

/**
 * 경쟁자 입찰가 생성 함수
 *
 * @param seed - PropertySeed (시드 기반 일관성 보장)
 * @param valuation - Valuation (minBid, recommendedBidRange 포함)
 * @param policy - Policy (경쟁자 정책 포함)
 * @returns 경쟁자 입찰가 배열 (내림차순 정렬)
 *
 * 핵심 로직:
 * 1. 시드 기반 일관성: 같은 seed에서 항상 동일한 경쟁자 입찰가 생성
 * 2. 난이도별 경쟁 강도: difficultyMultiplier 적용
 * 3. 정규 분포 기반: minBid ~ maxRecommended 범위 내 분포
 */
export function generateCompetitorBids(
  seed: PropertySeed,
  valuation: Valuation,
  policy: Policy,
): number[] {
  console.group("[generateCompetitorBids] 경쟁자 입찰가 생성 시작");
  console.log("입력 파라미터:", {
    difficulty: seed.difficulty,
    minBid: valuation.minBid,
    maxRecommended: valuation.recommendedBidRange.max,
  });

  // 1. 정책에서 경쟁자 수 확인 (기본값: 4)
  const competitorPolicy = policy.competitor ?? defaultPolicy.competitor!;
  const competitorCount = competitorPolicy.count;
  console.log("경쟁자 정책:", {
    count: competitorCount,
    bidRange: competitorPolicy.bidRange,
    distributionType: competitorPolicy.distributionType,
  });

  // 2. 난이도별 경쟁 강도 배수 적용
  const difficultyMultiplier =
    competitorPolicy.difficultyMultiplier[seed.difficulty] ?? 1.0;
  console.log("난이도별 경쟁 강도:", {
    difficulty: seed.difficulty,
    multiplier: difficultyMultiplier,
    description:
      difficultyMultiplier === 0.6
        ? "Easy: 경쟁 강도 60% (범위 축소)"
        : difficultyMultiplier === 1.0
          ? "Normal: 경쟁 강도 100% (기본 범위)"
          : "Hard: 경쟁 강도 150% (범위 확대)",
  });

  // 3. 입찰가 범위 계산
  const minBid = valuation.minBid;
  const maxRecommended = valuation.recommendedBidRange.max;
  const bidRange = competitorPolicy.bidRange;

  // minBid 대비 범위 계산
  const rangeMin = minBid * bidRange.min;
  const rangeMax = Math.min(
    minBid * bidRange.max,
    maxRecommended * 1.2, // maxRecommended * 1.2 이하로 제한
  );

  console.log("입찰가 범위 계산:", {
    minBid,
    bidRangeMin: bidRange.min,
    bidRangeMax: bidRange.max,
    rangeMin,
    rangeMax,
    rangeWidth: rangeMax - rangeMin,
  });

  // 난이도별 경쟁 강도 배수 적용 (범위 조정)
  const adjustedRangeMin = rangeMin;
  const adjustedRangeMax =
    rangeMin + (rangeMax - rangeMin) * difficultyMultiplier;

  console.log("난이도별 범위 조정:", {
    originalRange: { min: rangeMin, max: rangeMax },
    adjustedRange: { min: adjustedRangeMin, max: adjustedRangeMax },
    adjustedWidth: adjustedRangeMax - adjustedRangeMin,
    multiplierEffect:
      difficultyMultiplier === 1.0
        ? "기본 범위 유지"
        : difficultyMultiplier < 1.0
          ? `범위 축소 (${((1 - difficultyMultiplier) * 100).toFixed(0)}% 감소)`
          : `범위 확대 (${((difficultyMultiplier - 1) * 100).toFixed(0)}% 증가)`,
  });

  // 4. 분포 타입에 따라 입찰가 생성
  const bids: number[] = [];
  const distributionType = competitorPolicy.distributionType ?? "normal";

  for (let i = 0; i < competitorCount; i++) {
    // 각 경쟁자별 고유 시드 생성
    const competitorSeed = generateSeedFromPropertySeed(seed, i);
    let bid: number;

    if (distributionType === "normal") {
      // 정규 분포 근사 (Box-Muller 변환 사용)
      // 두 개의 균등 분포를 사용하여 정규 분포 근사
      const u1 = seedBasedRandom(competitorSeed + "_u1");
      const u2 = seedBasedRandom(competitorSeed + "_u2");

      // Box-Muller 변환
      const z0 =
        Math.sqrt(-2 * Math.log(u1 + 0.0001)) * Math.cos(2 * Math.PI * u2);

      // 평균과 표준편차 설정 (범위의 중앙값을 평균으로)
      const mean = (adjustedRangeMin + adjustedRangeMax) / 2;
      const stdDev = (adjustedRangeMax - adjustedRangeMin) / 6; // 99.7% 범위

      // 정규 분포 값 생성
      const normalValue = mean + z0 * stdDev;

      // 범위 내로 클램핑
      bid = Math.max(adjustedRangeMin, Math.min(adjustedRangeMax, normalValue));
    } else if (distributionType === "uniform") {
      // 균등 분포
      const random = seedBasedRandom(competitorSeed);
      bid = adjustedRangeMin + random * (adjustedRangeMax - adjustedRangeMin);
    } else {
      // "skewed" 분포 (향후 확장, 현재는 균등 분포로 처리)
      const random = seedBasedRandom(competitorSeed);
      bid = adjustedRangeMin + random * (adjustedRangeMax - adjustedRangeMin);
    }

    // minBid 이상으로 보장
    bid = Math.max(minBid, bid);

    bids.push(Math.round(bid));
  }

  // 5. 내림차순 정렬 후 반환
  const sortedBids = bids.sort((a, b) => b - a);

  console.log("경쟁자 입찰가 생성 완료:", {
    competitorCount: sortedBids.length,
    bids: sortedBids,
    minBid: Math.min(...sortedBids),
    maxBid: Math.max(...sortedBids),
    averageBid:
      sortedBids.reduce((sum, bid) => sum + bid, 0) / sortedBids.length,
  });
  console.groupEnd();

  return sortedBids;
}

/* ============================================================
    [5] OUTCOME 판단 (v2.2에 맞게 재작성)
   ============================================================ */

function determineOutcome(
  result: AuctionAnalysisResult,
  userBid: number,
  propertySeed: PropertySeed, // 시드 추가 (경쟁자 생성용)
  policy?: Policy, // 정책 추가
): "win" | "lose" | "overpay" {
  // 최저가: minBid
  const minBid = result.valuation.minBid;

  // 권장가 범위
  const maxRecommended = result.valuation.recommendedBidRange.max;

  // 정책 확인 (기본값: defaultPolicy)
  const currentPolicy = policy ?? defaultPolicy;

  // 기존 검증
  if (userBid === 0) return "lose"; // 미입찰
  if (userBid < minBid) return "lose"; // 최저가 미달
  if (userBid > maxRecommended * 1.1) return "overpay"; // 과입찰

  // 경쟁자 로직 추가
  if (currentPolicy.competitor) {
    const competitorBids = generateCompetitorBids(
      propertySeed,
      result.valuation,
      currentPolicy,
    );

    // 사용자 입찰가가 최고가인지 확인
    const maxCompetitorBid = Math.max(...competitorBids);
    if (userBid <= maxCompetitorBid) {
      return "lose"; // 경쟁자에게 패배
    }
  }

  return "win"; // 정상 낙찰
}

/* ============================================================
    [6] SAVE HISTORY (히스토리 저장)
   ============================================================ */

async function saveHistory(simulationId: string, userId: string) {
  /* 1) 시뮬레이션 존재 및 소유권 확인 */
  const { data: simulation, error: fetchError } = await supabase
    .from("simulations")
    .select("id, user_id, outcome")
    .eq("id", simulationId)
    .eq("user_id", userId)
    .single();

  if (fetchError || !simulation) {
    console.error("[SimulationService.saveHistory] Simulation not found:", fetchError);
    throw new Error("시뮬레이션을 찾을 수 없습니다.");
  }

  /* 2) 입찰 완료 여부 확인 (pending 상태는 저장 불가) */
  if (simulation.outcome === "pending") {
    throw new Error("입찰이 완료되지 않은 시뮬레이션은 저장할 수 없습니다.");
  }

  /* 3) pinned 필드 업데이트 */
  const { error: updateError } = await supabase
    .from("simulations")
    .update({ pinned: true })
    .eq("id", simulationId)
    .eq("user_id", userId);

  if (updateError) {
    console.error("[SimulationService.saveHistory] Update error:", updateError);
    throw new Error("히스토리 저장에 실패했습니다.");
  }

  return { success: true };
}

/* ============================================================
    EXPORT
   ============================================================ */

export const simulationService = {
  create,
  submitBid,
  saveHistory,
};
