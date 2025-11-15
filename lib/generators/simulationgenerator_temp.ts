// lib/generators/simulationgenerator.ts
// BIDIX AI – Master Simulation Scenario Generator (v2.2)
// Version: 2.2
// Last Updated: 2025-11-14

import {
  PropertySeed,
  CourtDocsNormalized,
  DifficultyMode,
} from "@/lib/types";

import { generatePropertySeed } from "./propertygenerator";
import { generateCourtDocs, ScenarioType } from "./courtdocsmocker";
import { normalizeCourtDocs } from "@/lib/engines/courtdocslayer";

/**
 * SimulationScenario
 * - PropertySeed
 * - CourtDocsNormalized
 * → AuctionEngine이 직접 처리할 수 있는 일관된 입력 구조
 */
export interface SimulationScenario {
  propertySeed: PropertySeed;
  courtDocs: CourtDocsNormalized;
  scenarioType: ScenarioType;
}

/**
 * v2.2 시나리오 생성 규칙
 * ----------------------------------------
 * 1) 난이도는 PropertySeed에서 자동으로 결정됨
 * 2) CourtDocs 시나리오 타입은 난이도 기반 확률로 결정
 * 3) CourtDocsLayer.normalize() 적용 후 최종 데이터 반환
 * 4) AuctionEngine.run() → 시뮬레이션 초기값 생성에서 사용됨
 */
export function generateSimulationScenario(options?: {
  difficulty?: DifficultyMode;
}): SimulationScenario {
  
  /*───────────────────────────────────────────
    1. PropertySeed 생성 (난이도 포함)
  ───────────────────────────────────────────*/
  const propertySeed = generatePropertySeed({
    difficulty: options?.difficulty,
  });

  const difficulty = propertySeed.difficulty;

  /*───────────────────────────────────────────
    2. 시나리오 타입 결정 (v2.2 난이도 기반 확률)
  ───────────────────────────────────────────*/
  const scenarioType = pickScenarioByDifficulty(difficulty);

  /*───────────────────────────────────────────
    3. CourtDocs 생성 (시나리오 타입 기반)
  ───────────────────────────────────────────*/
  const rawDocs = generateCourtDocs(propertySeed, scenarioType);

  /*───────────────────────────────────────────
    4. CourtDocs 정규화 (normalizeCourtDocs)
    - 대항력 판단
    - occupancy 변환
    - tenants enriched
    - registry 구조 정규화
  ───────────────────────────────────────────*/
  const courtDocs = normalizeCourtDocs(rawDocs);

  /*───────────────────────────────────────────
    5. 최종 패키지 반환
  ───────────────────────────────────────────*/
  return {
    propertySeed,
    courtDocs,
    scenarioType,
  };
}

/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  난이도 기반 시나리오 타입 선택 로직 (v2.2)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
function pickScenarioByDifficulty(
  difficulty: DifficultyMode,
): ScenarioType {
  if (difficulty === "easy") {
    // Easy → 안전 80% / 위험 임차인 15% / 복잡권리 5%
    const r = Math.random();
    if (r < 0.8) return "SAFE_PROPERTY";
    if (r < 0.95) return "PROTECTED_TENANT";
    return "COMPLEX_RIGHTS";
  }

  if (difficulty === "normal") {
    // Normal → 안전 45% / 위험 임차인 35% / 복잡권리 20%
    const r = Math.random();
    if (r < 0.45) return "SAFE_PROPERTY";
    if (r < 0.8) return "PROTECTED_TENANT";
    return "COMPLEX_RIGHTS";
  }

  // Hard → 위험 임차인 55% / 복잡권리 40% / 안전 5%
  const r = Math.random();
  if (r < 0.55) return "PROTECTED_TENANT";
  if (r < 0.95) return "COMPLEX_RIGHTS";
  return "SAFE_PROPERTY";
}
