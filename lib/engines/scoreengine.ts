// lib/engines/scoreengine.ts
// BIDIX AI - ScoreEngine (v2.0)
// Based on: /docs/system/point-level-system.md
// Last Updated: 2025-11-09

import {
  AuctionAnalysisResult,
  Valuation,
  Rights,
  Profit,
} from "@/lib/types"; // barrel: /src/lib/types/index.ts

/* ============================================================
 * Public Types
 * ============================================================ */

export interface ScoreBreakdown {
  accuracyScore: number; // 0..400
  profitabilityScore: number; // 0..400
  riskControlScore: number; // 0..200
  finalScore: number; // 0..1000
  grade: "S" | "A" | "B" | "C" | "D";
  expGain: number; // round(finalScore * 0.6)
}

export interface LevelInfo {
  tier: "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond";
  level: number; // 1..n (per tier range)
  totalExp: number; // 누적 EXP
  leveledUp: boolean; // 이전 EXP 대비 레벨업 발생 여부
}

export interface ScoreEngineResult extends ScoreBreakdown {
  levelInfo?: LevelInfo; // prevTotalExp 전달 시 산출
}

export interface ScoreEngineInput {
  result: AuctionAnalysisResult; // 엔진 최종 결과
  userBid: number; // 사용자가 입력한 입찰가
  prevTotalExp?: number; // 선택: 기존 누적 EXP
}

/* ============================================================
 * Public API
 * ============================================================ */

export const ScoreEngine = {
  /**
   * Calculate per-round score using v2.0 spec.
   * Pure & deterministic (no side effects).
   */
  calculate(input: ScoreEngineInput): ScoreEngineResult {
    const { result, userBid, prevTotalExp } = input;
    const { valuation, rights, profit } = result;

    const accuracyScore = calcAccuracyScore(valuation, userBid); // 0..400
    const profitabilityScore = calcProfitabilityScore(valuation, profit); // 0..400
    const riskControlScore = calcRiskControlScore(valuation, rights); // 0..200

    const finalScore = clamp(
      Math.round(accuracyScore + profitabilityScore + riskControlScore),
      0,
      1000
    );

    const grade = mapScoreToGrade(finalScore);
    const expGain = Math.round(finalScore * 0.6);

    if (typeof prevTotalExp === "number") {
      const nextTotal = prevTotalExp + expGain;
      const levelInfo = expToTierLevel(nextTotal, prevTotalExp);
      return {
        accuracyScore,
        profitabilityScore,
        riskControlScore,
        finalScore,
        grade,
        expGain,
        levelInfo,
      };
    }

    return {
      accuracyScore,
      profitabilityScore,
      riskControlScore,
      finalScore,
      grade,
      expGain,
    };
  },
};

/* ============================================================
 * Scoring: Accuracy (0..400)
 * Spec: accuracyScore = 400 - (|userBid - idealBid| / idealBid) * 400
 * idealBid = midpoint of recommendedBidRange
 * ============================================================ */
function calcAccuracyScore(valuation: Valuation, userBid: number): number {
  const mid =
    (valuation.recommendedBidRange.min + valuation.recommendedBidRange.max) / 2;

  if (mid <= 0 || userBid <= 0) return 0;

  const deviation = Math.abs(userBid - mid) / mid;
  const raw = 400 - deviation * 400;
  return clamp(Math.round(raw), 0, 400);
}

/* ============================================================
 * Scoring: Profitability (0..400)
 * Base by ROI buckets + bonuses
 * ============================================================ */
function calcProfitabilityScore(val: Valuation, pf: Profit): number {
  // 12개월 시나리오의 ROI 사용
  const roi = safeNumber(pf.scenarios["12m"].annualizedRoi); // decimal (e.g., 0.12)
  let base = 0;

  if (roi >= 0.2) {
    base = lerp(0.2, 0.35, 350, 400, Math.min(roi, 0.35));
  } else if (roi >= 0.1) {
    base = lerp(0.1, 0.19, 280, 340, roi);
  } else if (roi >= 0) {
    base = lerp(0, 0.09, 150, 260, roi);
  } else {
    // negative ROI: linear 0..120 for -0.3..0
    base = lerp(-0.3, 0, 0, 120, Math.max(roi, -0.3));
  }

  // Bonuses
  const annualizedBonus = mapRange(
    clamp(safeNumber(pf.scenarios["12m"].annualizedRoi), 0, 0.3),
    0,
    0.3,
    0,
    50
  );

  // [수정] pf.safetyMargin -> pf.initialSafetyMargin
  // '현재 시점에서 얼마나 싸게 잘 샀는가'를 기준으로 보너스를 계산합니다.
  const mosBonus = mapRange(
    clamp(safeNumber(pf.initialSafetyMargin), 0, 0.2),
    0,
    0.2,
    0,
    30
  );

  let beBonus = 0;
  const fmv = safeNumber(val.adjustedFMV);
  const be = safeNumber(pf.breakevenExit_12m);
  if (fmv > 0 && be > 0) {
    // lower BE relative to FMV => better bonus
    const ratio = clamp(be / fmv, 0.6, 1.0);
    beBonus = mapRange(ratio, 1.0, 0.6, 0, 20);
  }

  const total = base + annualizedBonus + mosBonus + beBonus;
  return clamp(Math.round(total), 0, 400);
}

/* ============================================================
 * Scoring: Risk Control (0..200)
 * ============================================================ */
function calcRiskControlScore(val: Valuation, rights: Rights): number {
  const fmv = Math.max(1, safeNumber(val.adjustedFMV));
  const rightsTotal = clamp(safeNumber(rights.assumableRightsTotal), 0, Infinity);
  const risk = clamp(safeNumber(rights.evictionRisk), 0, 5);
  const evictCost = clamp(safeNumber(rights.evictionCostEstimated), 0, Infinity);

  // Rights burden: ratio 0 -> 120, 1.0 -> 0
  const ratio = clamp(rightsTotal / fmv, 0, 1.0);
  const rightsScore = mapRange(ratio, 1.0, 0, 0, 120);

  // Eviction risk: 0 -> 50, 5 -> 0
  const evictionRiskScore = mapRange(risk, 5, 0, 0, 50);

  // Eviction cost: normalize by FMV, cap at 2% FMV -> 0
  const evictRatio = clamp(evictCost / fmv, 0, 0.02);
  const evictionCostScore = mapRange(evictRatio, 0.02, 0, 0, 30);

  const total = rightsScore + evictionRiskScore + evictionCostScore;
  return clamp(Math.round(total), 0, 200);
}

/* ============================================================
 * Grade mapping
 * ============================================================ */
function mapScoreToGrade(score: number): ScoreBreakdown["grade"] {
  if (score >= 900) return "S";
  if (score >= 750) return "A";
  if (score >= 600) return "B";
  if (score >= 450) return "C";
  return "D";
}

/* ============================================================
 * EXP → Tier/Level
 * ============================================================ */
function expToTierLevel(totalExp: number, prevTotalExp: number): LevelInfo {
  const tier = expToTier(totalExp);
  const level = expToLevel(totalExp);
  const prevLevel = expToLevel(prevTotalExp);
  return {
    tier,
    level,
    totalExp,
    leveledUp: level > prevLevel,
  };
}

function expToTier(exp: number): LevelInfo["tier"] {
  if (exp >= 30000) return "Diamond";
  if (exp >= 18001) return "Platinum";
  if (exp >= 9001) return "Gold";
  if (exp >= 3001) return "Silver";
  return "Bronze";
}

function expToLevel(exp: number): number {
  // Simple mapping: 300 EXP per level up to 10, then wider steps.
  if (exp <= 0) return 1;
  if (exp <= 3000) return Math.min(10, Math.max(1, Math.floor(exp / 300) + 1));
  if (exp <= 9000) return Math.min(20, 11 + Math.floor((exp - 3001) / 600));
  if (exp <= 18000) return Math.min(30, 21 + Math.floor((exp - 9001) / 900));
  if (exp <= 30000) return Math.min(40, 31 + Math.floor((exp - 18001) / 1200));
  return Math.min(99, 41 + Math.floor((exp - 30001) / 2000));
}

/* ============================================================
 * Utils
 * ============================================================ */
function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function lerp(x0: number, x1: number, y0: number, y1: number, x: number): number {
  if (x1 === x0) return (y0 + y1) / 2;
  const t = (x - x0) / (x1 - x0);
  return y0 + t * (y1 - y0);
}

function mapRange(x: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  const t = clamp((x - inMin) / (inMax - inMin || 1), 0, 1);
  return outMin + t * (outMax - outMin);
}

function safeNumber(n: unknown, fallback = 0): number {
  const v = typeof n === "number" && isFinite(n) ? n : fallback;
  return v;
}

/* ============================================================
 * Example convenience helper (optional)
 * ============================================================ */
export function scoreFromResult(
  result: AuctionAnalysisResult,
  userBid: number,
  prevTotalExp?: number
): ScoreEngineResult {
  return ScoreEngine.calculate({ result, userBid, prevTotalExp });
}

/* ============================================================
 * TODO hooks (future)
 * - Policy-driven weights (allow overriding 400/400/200 caps)
 * - Non-linear curves for ROI / risk
 * - Difficulty scaling (easy/normal/hard multipliers)
 * - Score band modifiers (e.g., streak bonus)
 * ============================================================ */