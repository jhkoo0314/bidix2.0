// lib/types/rights.ts
// Auction Engine v2.2 – Rights Layer Types
// Last Updated: 2025-11-13

export enum RightType {
  Mortgage = "mortgage",
  Pledge = "pledge",
  ProvisionalSeizure = "provisional_seizure",
  Seizure = "seizure",
  Injunction = "injunction",
  Leasehold = "leasehold",
  TenantProtected = "tenant_protected",
  TenantUnprotected = "tenant_unprotected",
  Lien = "lien",
  StatutorySurface = "statutory_surface",
  SurfaceRight = "surface_right",
  Easement = "easement",
  GraveRight = "grave_right",
  PriorLeasehold = "prior_leasehold",
  PriorTenant = "prior_tenant",
  TaxLien = "tax_lien",
  NoticeRegistry = "notice_registry",
  ProvisionalRegistry = "provisional_registry",
}

export interface Rights {
  assumableRightsTotal: number;
  evictionCostEstimated: number;
  evictionRisk: number; 
  riskFlags: string[];

  breakdown: Array<{
    type: RightType;
    inheritable: boolean;
    payout: number;
    risk: number;
  }>;
}
