/**
 * @file score.ts
 * @description 점수 관련 유틸리티 함수
 *
 * 주요 기능:
 * 1. 점수를 등급으로 변환 (S/A/B/C/D)
 *
 * 핵심 구현 로직:
 * - point-level-system.md 기준 엄격 준수
 * - 900+ S, 750+ A, 600+ B, 450+ C, 그 외 D
 *
 * @see {@link /docs/product/point-level-system.md} - 등급 체계 SSOT
 */

/**
 * 점수를 등급으로 변환
 * @param score - 최종 점수 (0-1000)
 * @returns 등급 (S/A/B/C/D)
 */
export function mapScoreToGrade(score: number): "S" | "A" | "B" | "C" | "D" {
  if (score >= 900) return "S";
  if (score >= 750) return "A";
  if (score >= 600) return "B";
  if (score >= 450) return "C";
  return "D";
}

