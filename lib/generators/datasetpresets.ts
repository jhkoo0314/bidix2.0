// lib/generators/datasetpresets.ts
// BIDIX Auction Engine v2.2 - Ultra Realistic Dataset Presets
// Version: 2.2 (A안: 현실 기반 매트릭스 적용)
// Last Updated: 2025-11-13

import {
  PropertyCategory,
  PropertyType,
  DifficultyMode,
} from "@/lib/types";

type Region =
  | "서울"
  | "경기"
  | "인천"
  | "부산"
  | "대구"
  | "광주";

/* ============================================================
   1) 지역 출현 가중치 (Realistic Urban Density)
============================================================ */
export const DATASET_PRESETS = {
  regionWeights: {
    서울: 0.33,
    경기: 0.30,
    인천: 0.10,
    부산: 0.12,
    대구: 0.08,
    광주: 0.07,
  } as Record<Region, number>,

  /* ============================================================
     2) 지역 × 유형별 평단가 매트릭스 (Ultra Realistic)
     - 실거래 기반 범위의 '중위값'을 반영
     - 단위: 원/m²
  ============================================================ */
  basePricePerM2Matrix: {
    서울: {
      [PropertyType.Apartment]: 18_000_000,
      [PropertyType.Officetel]: 11_000_000,
      [PropertyType.Villa]: 9_000_000,
      [PropertyType.MultiHouse]: 8_500_000,
      [PropertyType.Detached]: 7_000_000,
      [PropertyType.Store]: 13_000_000,
      [PropertyType.Office]: 15_000_000,
      [PropertyType.Factory]: 5_500_000,
      [PropertyType.Warehouse]: 4_800_000,
      [PropertyType.ResidentialLand]: 2_500_000,
      [PropertyType.CommercialLand]: 3_300_000,
    },
    경기: {
      [PropertyType.Apartment]: 13_500_000,
      [PropertyType.Officetel]: 8_000_000,
      [PropertyType.Villa]: 6_200_000,
      [PropertyType.MultiHouse]: 6_000_000,
      [PropertyType.Detached]: 5_000_000,
      [PropertyType.Store]: 9_500_000,
      [PropertyType.Office]: 10_000_000,
      [PropertyType.Factory]: 5_000_000,
      [PropertyType.Warehouse]: 4_200_000,
      [PropertyType.ResidentialLand]: 1_900_000,
      [PropertyType.CommercialLand]: 2_500_000,
    },
    인천: {
      [PropertyType.Apartment]: 11_000_000,
      [PropertyType.Officetel]: 7_500_000,
      [PropertyType.Villa]: 5_200_000,
      [PropertyType.MultiHouse]: 5_000_000,
      [PropertyType.Detached]: 4_200_000,
      [PropertyType.Store]: 8_500_000,
      [PropertyType.Office]: 9_000_000,
      [PropertyType.Factory]: 4_500_000,
      [PropertyType.Warehouse]: 4_000_000,
      [PropertyType.ResidentialLand]: 1_600_000,
      [PropertyType.CommercialLand]: 2_200_000,
    },
    부산: {
      [PropertyType.Apartment]: 12_000_000,
      [PropertyType.Officetel]: 8_500_000,
      [PropertyType.Villa]: 6_000_000,
      [PropertyType.MultiHouse]: 5_800_000,
      [PropertyType.Detached]: 5_000_000,
      [PropertyType.Store]: 10_000_000,
      [PropertyType.Office]: 11_000_000,
      [PropertyType.Factory]: 4_700_000,
      [PropertyType.Warehouse]: 4_000_000,
      [PropertyType.ResidentialLand]: 1_700_000,
      [PropertyType.CommercialLand]: 2_300_000,
    },
    대구: {
      [PropertyType.Apartment]: 8_500_000,
      [PropertyType.Officetel]: 6_000_000,
      [PropertyType.Villa]: 4_500_000,
      [PropertyType.MultiHouse]: 4_300_000,
      [PropertyType.Detached]: 3_800_000,
      [PropertyType.Store]: 7_000_000,
      [PropertyType.Office]: 7_500_000,
      [PropertyType.Factory]: 3_800_000,
      [PropertyType.Warehouse]: 3_200_000,
      [PropertyType.ResidentialLand]: 1_200_000,
      [PropertyType.CommercialLand]: 1_800_000,
    },
    광주: {
      [PropertyType.Apartment]: 7_800_000,
      [PropertyType.Officetel]: 5_700_000,
      [PropertyType.Villa]: 4_200_000,
      [PropertyType.MultiHouse]: 4_100_000,
      [PropertyType.Detached]: 3_600_000,
      [PropertyType.Store]: 6_800_000,
      [PropertyType.Office]: 7_000_000,
      [PropertyType.Factory]: 3_500_000,
      [PropertyType.Warehouse]: 3_000_000,
      [PropertyType.ResidentialLand]: 1_100_000,
      [PropertyType.CommercialLand]: 1_700_000,
    },
  } as Record<Region, Record<PropertyType, number>>,

  /* ============================================================
     3) 난이도 가중치 (시나리오 생성용)
  ============================================================ */
  difficultyWeights: {
    [DifficultyMode.Easy]: 0.34,
    [DifficultyMode.Normal]: 0.50,
    [DifficultyMode.Hard]: 0.16,
  } as Record<DifficultyMode, number>,

  /* ============================================================
     4) 유형별 전용면적 범위 (Realistic m² Range)
  ============================================================ */
  sizeByType: {
    [PropertyType.Apartment]: [56, 135],
    [PropertyType.Villa]: [40, 85],
    [PropertyType.Officetel]: [18, 72],
    [PropertyType.MultiHouse]: [35, 110],
    [PropertyType.Detached]: [70, 220],
    [PropertyType.ResidentialLand]: [80, 900],
    [PropertyType.CommercialLand]: [100, 1200],
    [PropertyType.Store]: [20, 180],
    [PropertyType.Office]: [45, 350],
    [PropertyType.Factory]: [300, 5000],
    [PropertyType.Warehouse]: [200, 4500],
  } as Record<PropertyType, [number, number]>,

  /* ============================================================
     5) 유형별 카테고리 매핑
  ============================================================ */
  categoryByType: {
    [PropertyType.Apartment]: PropertyCategory.Residential,
    [PropertyType.Villa]: PropertyCategory.Residential,
    [PropertyType.Officetel]: PropertyCategory.Residential,
    [PropertyType.MultiHouse]: PropertyCategory.Residential,
    [PropertyType.Detached]: PropertyCategory.Residential,
    [PropertyType.ResidentialLand]: PropertyCategory.Residential,

    [PropertyType.Store]: PropertyCategory.Commercial,
    [PropertyType.Office]: PropertyCategory.Commercial,
    [PropertyType.Factory]: PropertyCategory.Commercial,
    [PropertyType.Warehouse]: PropertyCategory.Commercial,
    [PropertyType.CommercialLand]: PropertyCategory.Commercial,
  } as Record<PropertyType, PropertyCategory>,

  /* ============================================================
     6) buildingUse 라벨
  ============================================================ */
  buildingUseByType: {
    [PropertyType.Apartment]: "apt",
    [PropertyType.Villa]: "villa",
    [PropertyType.Officetel]: "officetel",
    [PropertyType.MultiHouse]: "multi_house",
    [PropertyType.Detached]: "detached",
    [PropertyType.ResidentialLand]: "res_land",
    [PropertyType.Store]: "store",
    [PropertyType.Office]: "office",
    [PropertyType.Factory]: "factory",
    [PropertyType.Warehouse]: "warehouse",
    [PropertyType.CommercialLand]: "com_land",
  } as Record<PropertyType, string>,

  /* ============================================================
     7) 유형별 층 범위
  ============================================================ */
  floorRangeByType: {
    [PropertyType.Apartment]: [5, 45],
    [PropertyType.Officetel]: [5, 35],
    [PropertyType.Villa]: [2, 5],
    [PropertyType.MultiHouse]: [3, 5],
    [PropertyType.Detached]: [1, 3],
    [PropertyType.Store]: [1, 9],
    [PropertyType.Office]: [5, 40],
    [PropertyType.Factory]: [1, 5],
    [PropertyType.Warehouse]: [1, 4],
    [PropertyType.ResidentialLand]: [1, 1],
    [PropertyType.CommercialLand]: [1, 1],
  } as Record<PropertyType, [number, number]>,

  /* ============================================================
     8) 준공연도 범위 (현실 비중 기반)
  ============================================================ */
  yearBuiltRange: [1992, 2022] as [number, number],
};
