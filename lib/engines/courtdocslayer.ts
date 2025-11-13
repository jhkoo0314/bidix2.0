// src/lib/layers/courtdocslayer.ts
// BIDIX Auction Engine v2.2 - CourtDocs Normalization Layer
// Version: 2.2
// Last Updated: 2025-11-14

import {
  CourtDocsNormalized,
  Occupant,
  RegistryRight,
  PropertySeed,
} from "@/lib/types";

/**
 * normalizeCourtDocs()
 * -----------------------
 * - generateCourtDocs()가 만들어낸 rawCourtDocs를 정규화한다.
 * - 엔진(Valuation / RightsEngine / CostEngine)이 직접 사용 가능한 구조로 변환한다.
 * - 대항력 / 확정일자 / 소액임차인 / 명도 위험도 / 권리순위 등을 계산한다.
 */
export function normalizeCourtDocs(
  raw: CourtDocsNormalized,
  property?: PropertySeed
): CourtDocsNormalized {
  const baseRightDate = new Date(raw.baseRightDate);

  /*──────────────────────────────────────────────
    1) Occupants 정규화
  ──────────────────────────────────────────────*/
  const occupants: Occupant[] = raw.occupants.map((occ) => {
    const moveInDate = new Date(occ.moveInDate);
    const fixedDate = occ.fixedDate ? new Date(occ.fixedDate) : null;

    // ① 대항력 여부: 전입일 < 말소기준권리일
    const hasCountervailingPower = moveInDate < baseRightDate;

    // ② 확정일자 여부
    const hasFixedDate = fixedDate ? fixedDate < baseRightDate : false;

    // ③ 소액임차인 판별 (지역기준 확장 가능)
    const isSmallClaimTenant = checkSmallClaimTenant(
      occ.deposit,
      raw.region ?? "서울"
    );

    // ④ 명도 위험 수준 (엔진에서 활용)
    const evictionRiskLevel = computeEvictionRiskLevel(
      hasCountervailingPower,
      hasFixedDate,
      occ.isBusiness
    );

    return {
      ...occ,
      hasCountervailingPower,
      hasFixedDate,
      isSmallClaimTenant,
      evictionRiskLevel,
    };
  });

  /*──────────────────────────────────────────────
    2) 등기 권리(Registry Rights) 정규화
  ──────────────────────────────────────────────*/
  const rights: RegistryRight[] = raw.registeredRights.map(
    (right, idx): RegistryRight => {
      const priorityDate = new Date(right.priorityDate);

      return {
        ...right,
        rank: idx + 1,
        priorityDate,
        isDeletedRight: !!right.isDeletedRight,
        typeLabel: right.typeLabel ?? "unknown",
      };
    }
  );

  /*──────────────────────────────────────────────
    3) 최종 CourtDocs 조립
  ──────────────────────────────────────────────*/
  const result: CourtDocsNormalized = {
    ...raw,
    occupants,
    registeredRights: rights,
    baseRightDate,
  };

  return result;
}

/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  소액임차인 자동판별 (지역기준 확장 가능)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
function checkSmallClaimTenant(
  deposit: number,
  region: string
): boolean {
  // 기본값은 서울 기준
  const LIMIT = {
    서울: 15000000,
    경기: 13000000,
    인천: 12000000,
    부산: 11000000,
    대구: 10000000,
    광주: 10000000,
  };

  const threshold = LIMIT[region] ?? 15000000;
  return deposit <= threshold;
}

/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  명도 위험도 계산 (Eviction Risk Level)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
function computeEvictionRiskLevel(
  hasCountervailingPower: boolean,
  hasFixedDate: boolean,
  isBusiness: boolean | undefined
): "low" | "medium" | "high" {
  if (hasCountervailingPower && hasFixedDate) return "high";

  if (hasCountervailingPower && !hasFixedDate) return "medium";

  if (isBusiness) return "medium";

  return "low";
}
