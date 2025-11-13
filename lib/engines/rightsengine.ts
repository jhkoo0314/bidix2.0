// lib/engines/rightsengine.ts
// BIDIX Auction Engine v2.1 - RightsEngine
// Version: 2.1
// Last Updated: 2025-11-13

import { Rights, RightType, CourtDocsNormalized, Occupant } from "@/lib/types";
import { Policy } from "@/lib/policy/policy";
import defaultPolicy from "@/lib/policy/defaultpolicy";
import { RIGHTS_POLICY_TABLE } from "@/lib/policy/rightspolicy";
import { roundToK } from "@/lib/utils/number";

/**
 * ✅ 엔진 목적
 * 1) 권리 인수 금액 계산 (등기 + 세입자)
 * 2) 명도비용 + 명도 리스크 산출
 * 3) breakdown 배열에 상세 정보 포함
 */
export class RightsEngine {
  static evaluate(
    courtDocs: CourtDocsNormalized | undefined,
    policy: Policy = defaultPolicy,
  ): Rights {
    if (!courtDocs) {
      return emptyRightsResult();
    }

    const rightsFromRegistry = extractRightsFromRegistry(courtDocs);
    const tenantsFromMAJ = extractTenants(courtDocs);

    const breakdown = [
      ...mapRightsToBreakdown(rightsFromRegistry),
      ...mapTenantsToRights(tenantsFromMAJ, policy),
    ];

    const assumableRightsTotal = sum(breakdown.map((r) => r.payout));
    const evictionCostEstimated = estimateEvictionCost(
      tenantsFromMAJ.length,
      policy,
      breakdown,
    );
    const evictionRisk = calculateEvictionRisk(breakdown);

    return {
      assumableRightsTotal,
      evictionCostEstimated,
      evictionRisk,
      breakdown,
      riskFlags: extractRiskFlags(breakdown, evictionRisk),
    };
  }
}

/* ======================================================
 * 🔍 Step 1. 등기부 내 권리 추출
 * ====================================================== */
function extractRightsFromRegistry(courtDocs: CourtDocsNormalized) {
  return courtDocs.registeredRights ?? [];
}

/* ======================================================
 * 🔍 Step 2. MAJ 세입자 정보 → 권리로 변환
 * ====================================================== */
function extractTenants(courtDocs: CourtDocsNormalized) {
  return courtDocs.occupants ?? [];
}

function mapTenantsToRights(tenants: Occupant[], policy: Policy) {
  return tenants.map((t) => {
    // 보호된 임차인 판단: 대항력 있거나 소액임차인인 경우
    const isProtected = Boolean(
      t.hasCountervailingPower || t.isSmallClaimTenant,
    );
    const deposit = t.deposit ?? 0;

    const payout = isProtected
      ? policy.rights.protectedTenantExtra ?? deposit
      : deposit;

    return {
      type: isProtected
        ? RightType.TenantProtected
        : RightType.TenantUnprotected,
      inheritable: isProtected,
      payout,
      risk: isProtected ? 5 : 3,
    };
  });
}

/* ======================================================
 * 🔍 Step 3. 일반 권리 매핑 → payout/risk 적용
 * ====================================================== */
function mapRightsToBreakdown(rights: Array<{ type?: string }>): Array<{
  type: RightType;
  inheritable: boolean;
  payout: number;
  risk: number;
}> {
  return rights
    .map((r) => {
      const key = normalizeToRightType(r.type);
      const row = RIGHTS_POLICY_TABLE[key];

      if (!row) {
        console.warn(
          `[RightsEngine] No policy found for right type: "${key}". Skipping.`,
        );
        return null;
      }

      return {
        type: key,
        inheritable: row.inheritable,
        payout: row.basePayout,
        risk: row.risk,
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);
}

/**
 * 등기부 원본 텍스트(string)를 표준화된 RightType Enum으로 변환
 */
const MAPPING_RULES: Array<[string[], RightType]> = [
  [["법정지상권"], RightType.StatutorySurface],
  [["근저당"], RightType.Mortgage],
  [["전세", "임차권"], RightType.Leasehold],
  [["가등기"], RightType.ProvisionalRegistry],
  [["예고등기"], RightType.NoticeRegistry],
  [["가처분"], RightType.Injunction],
  [["가압류"], RightType.ProvisionalSeizure],
  [["압류"], RightType.Seizure],
  [["유치권"], RightType.Lien],
  [["지상권"], RightType.SurfaceRight],
  [["지역권"], RightType.Easement],
  [["분묘"], RightType.GraveRight],
  [["질권"], RightType.Pledge],
  [["조세"], RightType.TaxLien],
  [["임차인"], RightType.TenantUnprotected],
];

function normalizeToRightType(s?: string): RightType {
  if (!s) return RightType.Mortgage;
  const v = s.toLowerCase().replace(/\s+/g, "");

  for (const [keywords, type] of MAPPING_RULES) {
    if (keywords.some((keyword) => v.includes(keyword))) {
      return type;
    }
  }

  console.warn(
    `[RightsEngine] Unhandled right string: "${s}". Defaulting to Mortgage.`,
  );
  return RightType.Mortgage;
}

/* ======================================================
 * 🔍 Step 4. 명도비용 & 리스크 산정
 * ====================================================== */
function estimateEvictionCost(
  tenantCount: number,
  policy: Policy,
  breakdown: Array<{
    type: RightType;
    inheritable: boolean;
    payout: number;
    risk: number;
  }>,
) {
  const base = policy.rights.evictionBaseCost;
  const riskWeight = policy.rights.evictionRiskWeight;

  // 권리 risk 점수 합산 + 세입자 수 반영
  const riskScore = breakdown.reduce((acc, r) => acc + r.risk, 0);
  const scaledRisk = riskScore * riskWeight;

  const factor = 1 + scaledRisk + tenantCount * 0.4;

  return roundToK(base * factor);
}

function calculateEvictionRisk(
  breakdown: Array<{ risk: number; type: RightType }>,
): number {
  if (!breakdown.length) return 0.15;
  const avg = breakdown.reduce((a, b) => a + b.risk, 0) / breakdown.length;
  return Math.min(1, avg / 5); // 5점 만점 기준
}

/* 리스크 플래그(시뮬레이션 UI에 표시) */
function extractRiskFlags(
  breakdown: Array<{ risk: number; type: RightType }>,
  evictionRisk: number,
) {
  const flags: string[] = [];
  if (evictionRisk > 0.6) flags.push("명도 리스크 高");
  if (breakdown.some((r) => r.type === RightType.Lien))
    flags.push("유치권 존재");
  if (breakdown.some((r) => r.type === RightType.StatutorySurface))
    flags.push("법정지상권 우려");
  return flags;
}

/* 빈 결과 (문서 없음) */
function emptyRightsResult(): Rights {
  return {
    assumableRightsTotal: 0,
    evictionCostEstimated: 0,
    evictionRisk: 0,
    breakdown: [],
    riskFlags: [],
  };
}

/* 숫자 합 */
function sum(arr: number[]) {
  return arr.reduce((s, v) => s + v, 0);
}
