// src/lib/engines/propertyengine.ts
// BIDIX Auction Engine v2.1 - PropertyEngine (Realistic Appraisal)
// Version: 2.1
// Last Updated: 2025-11-13

import {
  PropertySeed,
  Property,
  PropertyType,
  PropertyCategory,
  DifficultyMode,
} from "@/lib/types";

import { DATASET_PRESETS } from "@/lib/generators/datasetpresets";

/**
 * 목적
 * - PropertySeed → Property 정규화
 * - 감정가(appraisalValue)를 현실형 공식으로 1차 산출
 * - 이후 ValuationEngine에서 FMV/Exit/최저가 등을 추가 계산
 */
export class PropertyEngine {
  /** 외부 진입점: Seed → Property */
  static normalize(seed: PropertySeed): Property {
    validateSeed(seed);

    const id = seed.id ?? generatePropertyId();
    const yearBuilt = seed.yearBuilt ?? getFallbackYearBuilt(seed.type);

    /** 층 정보 보정: 최소 1층 보장 */
    const floorInfo = {
      total: seed.floorInfo?.total ?? 1,
      current: seed.floorInfo?.current ?? 1,
    };

    const appraisalValue = estimateAppraisalValue(seed, yearBuilt);

    return {
      id,
      category: seed.category,
      type: seed.type,
      sizeM2: seed.sizeM2,
      landSizeM2: seed.landSizeM2 ?? 0,
      buildingUse: DATASET_PRESETS.buildingUseByType[seed.type],
      yearBuilt,
      appraisalValue,
      auctionStep: clampAuctionStep(seed.auctionStep),
      address: seed.address ?? "주소 정보 없음",
      difficulty: seed.difficulty ?? DifficultyMode.Normal,
      floorInfo,
    };
  }
}

/* ======================================================
 * 내부 유틸 함수
 * ====================================================== */

/** 유니크 ID 생성 */
function generatePropertyId(): string {
  return `prop_${Math.random().toString(36).slice(2, 12)}`;
}

/** 최저 1회차 ~ 최대 5회차로 보정 */
function clampAuctionStep(step?: number): number {
  if (!step || step < 1) return 1;
  if (step > 5) return 5;
  return step;
}

/**
 * 현실형 감정가 1차 추정
 * 공식:
 *   appraisalValue =
 *     sizeM2
 *     × basePricePerM2[type]
 *     × regionMultiplier[region]
 *     × typeAdjustment[type]
 *     × depreciationMultiplier(yearBuilt)
 */
function estimateAppraisalValue(seed: PropertySeed, yearBuilt: number): number {
  const basePrice = DATASET_PRESETS.basePricePerM2[seed.type];
  const typeAdjustment =
    DATASET_PRESETS.typeAdjustments[seed.type] ?? 1.0;

  const region = inferRegionFromAddress(seed.address);
  const regionMultiplier = region
    ? DATASET_PRESETS.regionMultipliers[region]
    : 1.0;

  const depreciation = getDepreciationMultiplier(yearBuilt);

  const raw =
    seed.sizeM2 *
    basePrice *
    regionMultiplier *
    typeAdjustment *
    depreciation;

  return Math.round(raw);
}

/** 주소에서 지역(서울/경기/…) 추론 */
type RegionKey = keyof typeof DATASET_PRESETS.regionWeights;

function inferRegionFromAddress(address?: string): RegionKey | null {
  if (!address) return null;
  const [firstToken] = address.split(" ");
  if (!firstToken) return null;

  const regions = Object.keys(DATASET_PRESETS.regionWeights) as RegionKey[];

  return regions.includes(firstToken as RegionKey)
    ? (firstToken as RegionKey)
    : null;
}

/** 연식에 따른 감가율 계산 */
function getDepreciationMultiplier(yearBuilt: number): number {
  const nowYear = new Date().getFullYear();
  const age = Math.max(0, nowYear - yearBuilt);

  if (age <= 10) return 1.0;
  if (age <= 20) return 0.9;
  if (age <= 30) return 0.8;
  return 0.7;
}

/** 타입별 기본 준공연도 (Seed에 yearBuilt 없을 때 fallback) */
function getFallbackYearBuilt(type: PropertyType): number {
  const now = new Date().getFullYear();

  switch (type) {
    case PropertyType.Apartment:
    case PropertyType.Officetel:
      return now - 10;
    case PropertyType.Villa:
    case PropertyType.MultiHouse:
      return now - 15;
    case PropertyType.Detached:
      return now - 25;
    case PropertyType.Store:
    case PropertyType.Office:
      return now - 20;
    case PropertyType.Factory:
    case PropertyType.Warehouse:
      return now - 30;
    case PropertyType.ResidentialLand:
    case PropertyType.CommercialLand:
      return now;
    default:
      return now - 20;
  }
}

/** Seed 유효성 검증 */
function validateSeed(seed: PropertySeed): void {
  if (!Object.values(PropertyType).includes(seed.type))
    throw new Error("[PropertyEngine] Invalid PropertyType");

  if (!Object.values(PropertyCategory).includes(seed.category))
    throw new Error("[PropertyEngine] Invalid PropertyCategory");

  if (!seed.sizeM2 || seed.sizeM2 <= 0)
    throw new Error("[PropertyEngine] sizeM2 must be > 0");

  if (
    seed.difficulty &&
    !Object.values(DifficultyMode).includes(seed.difficulty)
  ) {
    throw new Error("[PropertyEngine] Invalid DifficultyMode");
  }
}
