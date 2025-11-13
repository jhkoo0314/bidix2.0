// src/lib/generators/courtdocsmocker.ts
// BIDIX Auction Engine v2.2 – Court Docs Scenario Mocker
// Version: 2.2
// Last Updated: 2025-11-14

import {
  CourtDocsNormalized,
  RightType,
  PropertySeed,
} from "@/lib/types";

import { randomInt, sampleWeighted } from "./generatorhelpers";

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

  const registry = generateRegistryMock(seed, scenario, baseRightDate);
  const maj = generateMAJMock(seed, scenario, baseRightDate);
  const distribution = generateDistributionMock(seed, scenario);

  return {
    meta: {
      caseNo: `${seed.address?.slice(0, 2) ?? "XX"}-${randomInt(10000, 99999)}`,
      courtName: inferCourt(seed.address),
      capturedAt: new Date().toISOString(),
    },
    registry,
    maj,
    distribution,
    occupants: maj.tenants, // CourtDocsLayer와 동일 구조
    quality: {
      ocrConfidence: 0.95,
      missingFields: [],
      warnings: [],
    },
  };
}

/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Registry 생성 (등기부)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
function generateRegistryMock(
  seed: PropertySeed,
  scenario: ScenarioType,
  baseRightDate: string,
) {
  const rights: Array<{ section: string; type: string; date: string }> = [];

  // 기본 근저당 1개
  rights.push({
    section: "을구",
    type: "근저당",
    date: randomPastDate(2012, 2021),
  });

  if (scenario === "COMPLEX_RIGHTS") {
    // 추가 위험 권리들
    rights.push({
      section: "을구",
      type: "가압류",
      date: randomPastDate(2016, 2022),
    });
    rights.push({
      section: "갑구",
      type: "가처분",
      date: randomPastDate(2018, 2023),
    });
    if (Math.random() < 0.4) {
      rights.push({
        section: "을구",
        type: "법정지상권",
        date: randomPastDate(2000, 2010),
      });
    }
  }

  return {
    parcel: { buildingUse: seed.buildingUse ?? "apt" },
    rights,
    baseRightDate,
  };
}

/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MAJ / Occupants 생성
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
function generateMAJMock(
  seed: PropertySeed,
  scenario: ScenarioType,
  baseRightDate: string,
) {
  let tenants = [];

  if (scenario === "SAFE_PROPERTY") {
    tenants = [];
  }

  if (scenario === "PROTECTED_TENANT") {
    tenants = [
      {
        name: "홍길동",
        deposit: randomInt(5_000_000, 80_000_000),
        moveInDate: randomPastDate(2016, 2020), // 말소기준권리 이전
        fixedDate: randomPastDate(2016, 2020),
        protected: true,
      },
    ];
  }

  if (scenario === "COMPLEX_RIGHTS") {
    tenants = [
      {
        name: "김세입",
        deposit: randomInt(10_000_000, 200_000_000),
        moveInDate: randomPastDate(2019, 2023), // 말소기준 이후 → 대항력 없음
        fixedDate: undefined,
        protected: false,
      },
      {
        name: "박보증",
        deposit: randomInt(5_000_000, 50_000_000),
        moveInDate: randomPastDate(2015, 2017), // 대항력 존재 가능
        fixedDate: randomPastDate(2016, 2018),
        protected: true,
      },
    ];
  }

  return {
    baseRight: "근저당권",
    baseRightDate,
    occupancy: {
      type: tenants.length ? "tenant" : "vacant",
    },
    tenants,
    specialNotes: tenants.length
      ? ["임차인 보증금 및 대항력 여부 확인 필요"]
      : [],
    claimDeadline: randomFutureDate(2025, 2026),
  };
}

/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  배당표(Distribution) 생성
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
function generateDistributionMock(
  seed: PropertySeed,
  scenario: ScenarioType,
) {
  if (scenario === "SAFE_PROPERTY") {
    return {
      rows: [],
      totalClaimAmount: 0,
      totalPaidAmount: 0,
    };
  }

  const rows = [
    {
      creditor: "국민은행",
      type: "근저당",
      claimAmount: randomInt(50_000_000, 200_000_000),
      paidAmount: 0,
      rankNo: 1,
      notes: "",
    },
  ];

  if (scenario === "COMPLEX_RIGHTS") {
    rows.push({
      creditor: "신한카드",
      type: "가압류",
      claimAmount: randomInt(5_000_000, 30_000_000),
      paidAmount: 0,
      rankNo: 2,
      notes: "",
    });
  }

  return {
    rows,
    totalClaimAmount: rows.reduce((s, r) => s + r.claimAmount, 0),
    totalPaidAmount: 0,
  };
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

function randomFutureDate(startYear: number, endYear: number) {
  const year = randomInt(startYear, endYear);
  const month = randomInt(1, 12);
  const day = randomInt(1, 28);
  return new Date(year, month - 1, day).toISOString();
}

function inferCourt(address?: string) {
  if (!address) return "○○지방법원";
  if (address.includes("서울")) return "서울중앙지방법원";
  if (address.includes("경기")) return "수원지방법원";
  if (address.includes("인천")) return "인천지방법원";
  if (address.includes("부산")) return "부산지방법원";
  return "○○지방법원";
}
