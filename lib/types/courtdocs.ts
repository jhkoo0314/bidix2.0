// lib/types/courtdocs.ts
// BIDIX AI – Court Documents Normalized Structure v2.2
// Last Updated: 2025-11-13

import { RightType } from "./rights";

export interface RegisteredRight {
  type: RightType;
  date: string;
  creditor: string;
  amount: number;
  isBaseRight?: boolean;
}

export interface Occupant {
  name: string;
  moveInDate: string;
  fixedDate?: string;
  dividendRequested: boolean;
  deposit: number;
  rent: number;
  hasCountervailingPower?: boolean;
  hasFixedDate?: boolean;
  isSmallClaimTenant?: boolean;
  evictionRiskLevel?: "low" | "medium" | "high";
}

export interface CourtDocsNormalized {
  caseNumber: string;
  propertyDetails: string;

  registeredRights: RegisteredRight[];
  occupants: Occupant[];

  baseRightDate: string;
  remarks?: string;
}
