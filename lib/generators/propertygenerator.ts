// src/lib/generators/propertygenerator.ts
// BIDIX AI - PropertySeed Generator
// Version: 2.2 (Ultra Realistic A안 적용)
// Last Updated: 2025-11-13

import {
  PropertySeed,
  PropertyCategory,
  PropertyType,
  DifficultyMode,
} from "@/lib/types";

import { sampleWeighted, randomInt, uuid } from "./generatorhelpers";
import { DATASET_PRESETS } from "./datasetpresets";

/* ============================================================================
 * PropertySeed 생성기
 * 매물 생성에서 모든 "현실 기반 데이터"의 출발점 (SSOT)
 * ============================================================================
 */
export function generatePropertySeed(options?: {
  region?: string;
  fixedType?: PropertyType;
  difficulty?: DifficultyMode;
}): PropertySeed {
  /* ------------------------------------------------------------------------
   * 1. region 결정 (가중치 기반)
   * ---------------------------------------------------------------------- */
  const region =
    (options?.region as keyof typeof DATASET_PRESETS.regionWeights) ??
    sampleWeighted(DATASET_PRESETS.regionWeights);

  /* ------------------------------------------------------------------------
   * 2. 주거/상업 유형 결정
   *    - region에 따라 등장비율이 크게 달라지는 구조를 반영
   * ---------------------------------------------------------------------- */
  const availableTypes = Object.keys(
    DATASET_PRESETS.basePricePerM2Matrix[region]
  ) as PropertyType[];

  const type: PropertyType =
    options?.fixedType ?? availableTypes[Math.floor(Math.random() * availableTypes.length)];

  /* ------------------------------------------------------------------------
   * 3. 난이도 결정 (Easy/Normal/Hard)
   * ---------------------------------------------------------------------- */
  const difficulty: DifficultyMode =
    options?.difficulty ??
    sampleWeighted(DATASET_PRESETS.difficultyWeights);

  /* ------------------------------------------------------------------------
   * 4. 전용면적 결정 (유형별 현실 범위)
   * ---------------------------------------------------------------------- */
  const sizeRange = DATASET_PRESETS.sizeByType[type];
  const sizeM2 = randomInt(sizeRange[0], sizeRange[1]);

  /* ------------------------------------------------------------------------
   * 5. 토지면적 계산 (유형별 multiplier)
   * ---------------------------------------------------------------------- */
  const landSizeM2 = calculateLandSize(type, sizeM2);

  /* ------------------------------------------------------------------------
   * 6. 층 정보 생성 (유형별 realistic floor range)
   * ---------------------------------------------------------------------- */
  const [minF, maxF] = DATASET_PRESETS.floorRangeByType[type];
  const totalFloors = randomInt(minF, maxF);
  const currentFloor = Math.min(randomInt(1, totalFloors), totalFloors);

  /* ------------------------------------------------------------------------
   * 7. 준공연도 (YearBuilt) - 현실 기반 분포
   * ---------------------------------------------------------------------- */
  const year = randomInt(
    DATASET_PRESETS.yearBuiltRange[0],
    DATASET_PRESETS.yearBuiltRange[1]
  );

  /* ------------------------------------------------------------------------
   * 8. 감정가(appraisalValue) 1차 계산
   *    (유형 × 지역 평단가 매트릭스 기반)
   * ---------------------------------------------------------------------- */
  const basePrice =
    DATASET_PRESETS.basePricePerM2Matrix[region][type];

  const appraisalValue = Math.round(sizeM2 * basePrice);

  /* ------------------------------------------------------------------------
   * 9. 최종 Seed 반환 (SSOT)
   * ---------------------------------------------------------------------- */
  return {
    id: uuid("seed"),
    category: DATASET_PRESETS.categoryByType[type] as PropertyCategory,
    type,
    sizeM2,
    landSizeM2,
    yearBuilt: year,
    floorInfo: { total: totalFloors, current: currentFloor },
    buildingUse: DATASET_PRESETS.buildingUseByType[type],
    address: generateAddress(region),
    auctionStep: randomInt(1, 5),
    difficulty,
    appraisalValue,
    region,
  };
}

/* ============================================================================
 * 유형별 토지면적 계산 함수
 * ============================================================================
 */
function calculateLandSize(type: PropertyType, sizeM2: number): number {
  switch (type) {
    case PropertyType.Apartment:
    case PropertyType.Officetel:
      return Math.round(sizeM2 * 0.25);

    case PropertyType.Villa:
    case PropertyType.MultiHouse:
      return Math.round(sizeM2 * 0.5);

    case PropertyType.Detached:
      return Math.round(sizeM2 * 1.2);

    case PropertyType.ResidentialLand:
    case PropertyType.CommercialLand:
      return Math.max(sizeM2, 100);

    case PropertyType.Store:
    case PropertyType.Office:
      return Math.round(sizeM2 * 0.4);

    case PropertyType.Factory:
    case PropertyType.Warehouse:
      return Math.round(sizeM2 * 1.5);

    default:
      return Math.round(sizeM2 * 0.7);
  }
}

/* ============================================================================
 * 주소 생성기 (간단하지만 현실 기반)
 * ============================================================================
 */
function generateAddress(region: string): string {
  const streets = ["중앙로", "테헤란로", "강남대로", "광화문로", "종로", "송도대로", "해운대로"];
  const street = streets[Math.floor(Math.random() * streets.length)];
  const number = Math.floor(Math.random() * 250) + 1;
  return `${region} ${street} ${number}`;
}
