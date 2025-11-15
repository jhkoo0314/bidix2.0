// lib/types/index.ts
// Auction Engine v2.0 - SSOT Barrel Export
// Version: 2.0
// Last Updated: 2025-11-07

// Vercel 빌드 환경 호환성을 위해 절대 경로 사용
export * from "@/lib/types/property";
export * from "@/lib/types/valuation";
export * from "@/lib/types/rights";
export * from "@/lib/types/cost";
export * from "@/lib/types/profit";
export * from "@/lib/types/courtdocs";
export * from "@/lib/types/result";

// Explicit re-exports for commonly used types (to ensure TypeScript resolution)
export { DifficultyMode, PropertyCategory, PropertyType } from "@/lib/types/property";
export type { PropertySeed, Property } from "@/lib/types/property";

// Policy types (SSOT re-export)
export type { Policy, PolicyOverrides } from "@/lib/policy/policy";