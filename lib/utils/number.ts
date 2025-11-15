// lib/utils/number.ts
// BIDIX AI - Number Utilities
// Version: 2.2
// Last Updated: 2025-01-28

import { PropertySeed } from "@/lib/types";

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

/**
 * 문자열 시드를 해시하여 0~1 사이의 의사 랜덤 값 생성
 * 같은 시드에서 항상 같은 값을 반환 (시드 기반 일관성 보장)
 * @param seed 시드 문자열
 * @returns 0~1 사이의 의사 랜덤 값
 */
export function seedBasedRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // 32bit 정수로 변환
  }
  // 음수 방지 및 0~1 범위로 정규화
  return Math.abs(hash) / 2147483647;
}

/**
 * 시드 기반 정수 난수 생성
 * @param seed 시드 문자열
 * @param min 최소값 (포함)
 * @param max 최대값 (포함)
 * @returns min~max 사이의 정수
 */
export function seedBasedRandomInt(
  seed: string,
  min: number,
  max: number,
): number {
  const random = seedBasedRandom(seed);
  const range = max - min + 1;
  return Math.floor(random * range) + min;
}

/**
 * PropertySeed의 고유 값들을 조합하여 시드 문자열 생성
 * 각 경쟁자별로 고유한 시드를 생성하기 위해 index 파라미터 사용
 * @param seed PropertySeed 객체
 * @param index 경쟁자 인덱스 (0부터 시작)
 * @returns 시드 문자열
 */
export function generateSeedFromPropertySeed(
  seed: PropertySeed,
  index: number,
): string {
  // PropertySeed의 고유 값들을 조합하여 시드 생성
  const parts = [
    seed.address || "",
    seed.type,
    seed.sizeM2.toString(),
    seed.yearBuilt?.toString() || "0",
    seed.difficulty,
    index.toString(),
  ];
  return parts.join("|");
}

/**
 * 백분율 포맷팅 함수
 * @param value 백분율 값 (예: 0.15는 15%로 표시)
 * @param decimals 소수점 자릿수 (기본값: 2)
 * @returns 포맷된 백분율 문자열 (예: "15.00%")
 * @example
 * formatPercentage(0.1523) // "15.23%"
 * formatPercentage(0.1523, 1) // "15.2%"
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * 금액 포맷팅 함수
 * @param value 금액 값
 * @returns 포맷된 금액 문자열 (예: "1,234,567원")
 * @example
 * formatCurrency(1234567) // "1,234,567원"
 */
export function formatCurrency(value: number): string {
  return `${value.toLocaleString()}원`;
}