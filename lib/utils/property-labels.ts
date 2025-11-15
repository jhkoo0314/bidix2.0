/**
 * @file property-labels.ts
 * @description PropertyType enum을 한글 라벨로 변환하는 유틸리티
 *
 * 주요 기능:
 * 1. PropertyType enum 값을 한글 라벨로 변환
 * 2. 모든 PropertyType enum을 커버하는 타입 안전한 매핑
 * 3. SSOT 원칙: 모든 한글 라벨은 이 파일에서만 관리
 *
 * 사용 예시:
 * ```ts
 * import { getPropertyTypeLabel } from "@/lib/utils/property-labels";
 * const label = getPropertyTypeLabel(PropertyType.Apartment); // "아파트"
 * ```
 *
 * @dependencies
 * - @/lib/types: PropertyType enum
 *
 * @see {@link /docs/domain/property-types.md} - PropertyType 명세
 */

import { PropertyType } from "@/lib/types";

/**
 * PropertyType enum을 한글 라벨로 매핑하는 객체
 * 모든 PropertyType enum을 커버해야 함 (타입 안전성 보장)
 */
export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  // 주거용 (MVP)
  [PropertyType.Apartment]: "아파트",
  [PropertyType.Villa]: "빌라/다세대",
  [PropertyType.Officetel]: "오피스텔",
  [PropertyType.MultiHouse]: "다가구주택",
  [PropertyType.Detached]: "단독주택",
  [PropertyType.ResidentialLand]: "대지(주거)",

  // 상업용 (v2.1+)
  [PropertyType.Store]: "상가",
  [PropertyType.Office]: "사무실",
  [PropertyType.Factory]: "공장",
  [PropertyType.Warehouse]: "창고",
  [PropertyType.CommercialLand]: "상업용 토지",
};

/**
 * PropertyType enum 값을 한글 라벨로 변환하는 함수
 *
 * @param type - PropertyType enum 값
 * @returns 한글 라벨 (매핑이 없으면 enum 값 그대로 반환)
 *
 * @example
 * ```ts
 * getPropertyTypeLabel(PropertyType.Apartment) // "아파트"
 * getPropertyTypeLabel(PropertyType.Villa) // "빌라/다세대"
 * ```
 */
export function getPropertyTypeLabel(type: PropertyType): string {
  return PROPERTY_TYPE_LABELS[type] || type;
}

