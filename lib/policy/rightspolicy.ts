// src/lib/policy/rightspolicy.ts
// Auction Engine v2.0 - Rights Reference Table (18종 권리 기준값)
// Version: 2.0
// Last Updated: 2025-11-07

/**
 * 이 파일은 "고정 테이블"이다.
 * 숫자는 정책이 아니라 기준값이므로 default-policy.ts와 분리됨.
 *
 * ✅ 엔진에서 참조되는 항목:
 *  - inheritable: 말소 불가 여부 (true = 인수해야 함)
 *  - basePayout: 평균 인수금액 기준 (없으면 0)
 *  - risk: 0~5 위험도 (명도 난이도/배당 리스크 포함)
 *
 * ⚠️ 실무 데이터 수집 후 조정 예정
 */

import { RightType } from "@/lib/types/rights";

export const RIGHTS_POLICY_TABLE: Record<
  RightType,
  {
    label: string;
    inheritable: boolean;
    basePayout: number;
    risk: number; // 0~5 (5가 가장 위험)
  }
> = {
  [RightType.Mortgage]: {
    label: "근저당권",
    inheritable: false,
    basePayout: 0,
    risk: 1,
  },
  [RightType.Pledge]: {
    label: "질권",
    inheritable: false,
    basePayout: 0,
    risk: 1,
  },
  [RightType.ProvisionalSeizure]: {
    label: "가압류",
    inheritable: false,
    basePayout: 0,
    risk: 1,
  },
  [RightType.Seizure]: {
    label: "압류",
    inheritable: false,
    basePayout: 0,
    risk: 1,
  },
  [RightType.Injunction]: {
    label: "가처분",
    inheritable: false,
    basePayout: 0,
    risk: 2,
  },
  [RightType.Leasehold]: {
    label: "임차권",
    inheritable: true,
    basePayout: 40000000,
    risk: 4,
  },
  [RightType.TenantProtected]: {
    label: "대항력+확정일자 세입자",
    inheritable: true,
    basePayout: 80000000,
    risk: 5,
  },
  [RightType.TenantUnprotected]: {
    label: "미보증금 세입자",
    inheritable: false,
    basePayout: 0,
    risk: 3,
  },
  [RightType.Lien]: {
    label: "유치권",
    inheritable: true,
    basePayout: 30000000,
    risk: 5,
  },
  [RightType.StatutorySurface]: {
    label: "법정지상권",
    inheritable: true,
    basePayout: 0,
    risk: 4,
  },
  [RightType.SurfaceRight]: {
    label: "지상권",
    inheritable: true,
    basePayout: 15000000,
    risk: 4,
  },
  [RightType.Easement]: {
    label: "지역권",
    inheritable: true,
    basePayout: 5000000,
    risk: 2,
  },
  [RightType.GraveRight]: {
    label: "분묘기지권",
    inheritable: true,
    basePayout: 0,
    risk: 5,
  },
  [RightType.PriorLeasehold]: {
    label: "선순위 임차권",
    inheritable: true,
    basePayout: 60000000,
    risk: 5,
  },
  [RightType.PriorTenant]: {
    label: "선순위 대항력 세입자",
    inheritable: true,
    basePayout: 90000000,
    risk: 5,
  },
  [RightType.TaxLien]: {
    label: "조세채권",
    inheritable: false,
    basePayout: 0,
    risk: 2,
  },
  [RightType.NoticeRegistry]: {
    label: "가등기",
    inheritable: true,
    basePayout: 20000000,
    risk: 3,
  },
  [RightType.ProvisionalRegistry]: {
    label: "예고등기",
    inheritable: true,
    basePayout: 12000000,
    risk: 3,
  },
};
