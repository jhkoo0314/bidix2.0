// src/lib/fixtures/loadScenario.ts
import aptEasy from "./scenarios/apt-easy.json";
import officetelNormal from "./scenarios/officetel-normal.json";
import landHard from "./scenarios/land-hard.json";
import type { AuctionAnalysisResult } from "@/lib/types";

const SCENARIOS: Record<string, AuctionAnalysisResult> = {
  "apt-easy": aptEasy,
  "officetel-normal": officetelNormal,
  "land-hard": landHard,
};

export function loadScenario(id: string): AuctionAnalysisResult | null {
  return SCENARIOS[id] ?? null;
}

export function listScenarioIds(): string[] {
  return Object.keys(SCENARIOS);
}
