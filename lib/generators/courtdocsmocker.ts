// lib/generators/courtdocsmocker.ts
// BIDIX Auction Engine v2.2 – Court Docs Scenario Mocker
// Version: 2.2
// Last Updated: 2025-11-14

import {
  CourtDocsNormalized,
  PropertySeed,
  RegisteredRight,
  Occupant,
  RightType,
} from "@/lib/types";

import { randomInt } from "./generatorhelpers";

export type ScenarioType =
  | "SAFE_PROPERTY"
  | "PROTECTED_TENANT"
  | "COMPLEX_RIGHTS";

/**
 * Court Docs Mock Generator (SSOT 기반)
 * - PropertySeed 기반으로 권리/임차인/등기부 패턴을 자동 생성
 * - RightsEngine & CourtDocsLayer와 100% 호환되는 구조
 */
export function generateCourtDocs(
  seed: PropertySeed,
  scenario: ScenarioType,
): CourtDocsNormalized {
  const baseRightDate = randomPastDate(2015, 2023);

  const registeredRights = generateRegistryMock(seed, scenario);
  const occupants = generateMAJMock(seed, scenario);

  return {
    caseNumber: `${seed.address?.slice(0, 2) ?? "XX"}-${randomInt(
      10000,
      99999,
    )}`,
    propertyDetails: seed.address ?? "주소 정보 없음",
    registeredRights,
    occupants,
    baseRightDate,
    remarks:
      scenario === "PROTECTED_TENANT"
        ? "임차인 보증금 및 대항력 여부 확인 필요"
        : scenario === "COMPLEX_RIGHTS"
        ? "복잡한 권리 관계 존재"
        : undefined,
  };
}

/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Registry 생성 (등기부)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
function generateRegistryMock(
  _seed: PropertySeed,
  scenario: ScenarioType,
): RegisteredRight[] {
  const rights: RegisteredRight[] = [];

  // 기본 근저당 1개
  rights.push({
    type: RightType.Mortgage,
    date: randomPastDate(2012, 2021),
    creditor: "국민은행",
    amount: randomInt(50_000_000, 200_000_000),
    isBaseRight: true,
  });

  if (scenario === "COMPLEX_RIGHTS") {
    // 추가 위험 권리들
    rights.push({
      type: RightType.ProvisionalSeizure,
      date: randomPastDate(2016, 2022),
      creditor: "신한카드",
      amount: randomInt(5_000_000, 30_000_000),
      isBaseRight: false,
    });
    rights.push({
      type: RightType.Injunction,
      date: randomPastDate(2018, 2023),
      creditor: "○○금융",
      amount: randomInt(10_000_000, 50_000_000),
      isBaseRight: false,
    });
    if (Math.random() < 0.4) {
      rights.push({
        type: RightType.StatutorySurface,
        date: randomPastDate(2000, 2010),
        creditor: "○○건설",
        amount: randomInt(20_000_000, 100_000_000),
        isBaseRight: false,
      });
    }
  }

  return rights;
}

/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MAJ / Occupants 생성
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
function generateMAJMock(
  _seed: PropertySeed,
  scenario: ScenarioType,
): Occupant[] {
  const tenants: Occupant[] = [];

  if (scenario === "SAFE_PROPERTY") {
    return [];
  }

  if (scenario === "PROTECTED_TENANT") {
    tenants.push({
      name: "홍길동",
      deposit: randomInt(5_000_000, 80_000_000),
      rent: randomInt(500_000, 1_500_000),
      moveInDate: randomPastDate(2016, 2020), // 말소기준권리 이전
      fixedDate: randomPastDate(2016, 2020),
      dividendRequested: false,
    });
  }

  if (scenario === "COMPLEX_RIGHTS") {
    tenants.push({
      name: "김세입",
      deposit: randomInt(10_000_000, 200_000_000),
      rent: randomInt(800_000, 2_000_000),
      moveInDate: randomPastDate(2019, 2023), // 말소기준 이후 → 대항력 없음
      fixedDate: undefined,
      dividendRequested: false,
    });
    tenants.push({
      name: "박보증",
      deposit: randomInt(5_000_000, 50_000_000),
      rent: randomInt(600_000, 1_800_000),
      moveInDate: randomPastDate(2015, 2017), // 대항력 존재 가능
      fixedDate: randomPastDate(2016, 2018),
      dividendRequested: true,
    });
  }

  return tenants;
}

/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Helper Functions
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
function randomPastDate(startYear: number, endYear: number) {
  const year = randomInt(startYear, endYear);
  const month = randomInt(1, 12);
  const day = randomInt(1, 28);
  return new Date(year, month - 1, day).toISOString();
}
