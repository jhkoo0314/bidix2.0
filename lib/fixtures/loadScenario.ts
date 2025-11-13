// src/lib/fixtures/loadScenario.ts
import aptEasy from "./scenarios/apt-easy.json";
import officetelNormal from "./scenarios/officetel-normal.json";
import landHard from "./scenarios/land-hard.json";
import type { AuctionAnalysisResult } from "@/lib/types";

// JSON 파일은 타입이 완전히 일치하지 않을 수 있으므로 타입 단언 사용
const SCENARIOS: Record<string, AuctionAnalysisResult> = {
  "apt-easy": aptEasy as unknown as AuctionAnalysisResult,
  "officetel-normal": officetelNormal as unknown as AuctionAnalysisResult,
  "land-hard": landHard as unknown as AuctionAnalysisResult,
};

export function loadScenario(id: string): AuctionAnalysisResult | null {
  return SCENARIOS[id] ?? null;
}

export function listScenarioIds(): string[] {
  return Object.keys(SCENARIOS);
}
