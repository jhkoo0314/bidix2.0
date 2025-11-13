// lib/utils/number.ts
// BIDIX AI - Number Utilities
// Version: 2.2
// Last Updated: 2025-11-14

/**
 * 숫자를 천 단위로 반올림
 * @param value 반올림할 숫자
 * @returns 천 단위로 반올림된 숫자
 * @example
 * roundToK(1234567) // 1235000
 * roundToK(1234) // 1000
 */
export function roundToK(value: number): number {
  return Math.round(value / 1000) * 1000;
}

